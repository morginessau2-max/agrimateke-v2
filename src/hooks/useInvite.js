import { supabase } from '../lib/supabase'

export async function acceptInvite(token) {
  const { data, error } = await supabase.rpc('accept_invite', { invite_token: token })
  if (error) return { error: error.message }
  if (data?.error) return { error: data.error }
  return { success: true, cooperativeName: data?.cooperative_name || 'your cooperative' }
}