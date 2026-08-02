const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { action, vetId, token } = JSON.parse(event.body)

    // Verify user is authenticated
    const supabaseAuth = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
    if (authError || !user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    // Check if admin using service role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden — admins only' }) }
    }

    // Fetch pending vets
    if (action === 'fetch_pending') {
      const { data, error } = await supabaseAdmin
        .from('vets')
        .select('*')
        .eq('verified', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return {
        statusCode: 200,
        body: JSON.stringify({ vets: data || [] })
      }
    }

    // Approve vet
    if (action === 'approve') {
      const { error } = await supabaseAdmin
        .from('vets')
        .update({ verified: true })
        .eq('id', vetId)

      if (error) throw error
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Vet approved' })
      }
    }

    // Reject vet
    if (action === 'reject') {
      const { error } = await supabaseAdmin
        .from('vets')
        .delete()
        .eq('id', vetId)

      if (error) throw error
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Vet rejected and removed' })
      }
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action' }) }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}