const https = require('https')
const { createClient } = require('@supabase/supabase-js')

const FREE_DAILY_LIMIT = 10
const MODEL            = 'claude-sonnet-4-20250514'
const MAX_TOKENS       = 1024
const MAX_HISTORY      = 12

const admin      = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const authClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

// Start of "today" in Nairobi (UTC+3), returned as a UTC ISO string
function startOfTodayNairobi() {
  const offset = 3 * 60 * 60 * 1000
  const shifted = new Date(Date.now() + offset)
  shifted.setUTCHours(0, 0, 0, 0)
  return new Date(shifted.getTime() - offset).toISOString()
}

function callAnthropic(payload) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(payload)
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    }, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => resolve({ status: res.statusCode, text: data }))
    })
    req.on('error', reject)
    req.write(bodyStr)
    req.end()
  })
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  try {
    // 1. Who is calling?
    const token = (event.headers.authorization || '').replace('Bearer ', '')
    if (!token) return json(401, { error: 'Please sign in to use Shamba Bot.' })

    const { data: { user }, error: authError } = await authClient.auth.getUser(token)
    if (authError || !user) return json(401, { error: 'Your session has expired. Please sign in again.' })

    // 2. What plan are they on?
    const { data: profile } = await admin
      .from('profiles').select('plan').eq('id', user.id).single()
    const isFree = (profile?.plan || 'free') === 'free'

    // 3. How many messages today?
    const { count } = await admin
      .from('message_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfTodayNairobi())
    const used = count || 0

    if (isFree && used >= FREE_DAILY_LIMIT) {
      return json(429, {
        error: 'limit_reached',
        usage: { used, limit: FREE_DAILY_LIMIT },
      })
    }

    // 4. Clean the request. The server decides the model and token size.
    const incoming = JSON.parse(event.body || '{}')
    const messages = (Array.isArray(incoming.messages) ? incoming.messages : [])
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))

    if (messages.length === 0) return json(400, { error: 'No message provided.' })

    const system = typeof incoming.system === 'string' ? incoming.system.slice(0, 6000) : ''

    // 5. Get the reply (or a fake one in test mode)
    let reply
    const dryRun = String(process.env.SHAMBA_DRY_RUN || '').trim().toLowerCase() === 'true'
    console.log('[chat] test mode:', dryRun)
    if (dryRun) {
      reply = { content: [{ type: 'text', text: 'Test mode reply. The message limit and counter are working.' }] }
    } else {
      const result = await callAnthropic({ model: MODEL, max_tokens: MAX_TOKENS, system, messages })
      let parsed
      try { parsed = JSON.parse(result.text) } catch { parsed = null }

      if (result.status !== 200 || !parsed?.content) {
        console.error('Anthropic error:', result.status, result.text.slice(0, 300))
        return json(502, { error: 'Shamba Bot is unavailable right now. Please try again later.' })
      }
      reply = parsed
    }

    // 6. Count the message only after a successful reply
    await admin.from('message_logs').insert({ user_id: user.id })

    return json(200, {
      content: reply.content,
      usage: { used: used + 1, limit: isFree ? FREE_DAILY_LIMIT : null },
    })

  } catch (err) {
    console.error('chat function error:', err)
    return json(500, { error: 'Something went wrong. Please try again.' })
  }
}