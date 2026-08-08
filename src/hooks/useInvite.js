import { supabase } from '../lib/supabase'

export async function acceptInvite(token, userId) {
  try {
    // Find the invite
    const { data: invite, error: fetchError } = await supabase
      .from('cooperative_invites')
      .select('*, cooperatives(*)')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (fetchError || !invite) {
      return { error: 'Invite link is invalid or has already been used.' }
    }

    // Check if expired
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { error: 'This invite link has expired. Ask your cooperative head for a new one.' }
    }

    // Check if cooperative is full
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('cooperative_id', invite.cooperative_id)

    if (count >= 19) {
      return { error: 'This cooperative is full (19/19 members).' }
    }

    // Link farmer to cooperative
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ cooperative_id: invite.cooperative_id })
      .eq('id', userId)

    if (updateError) return { error: updateError.message }

    // Mark invite as used
    await supabase
      .from('cooperative_invites')
      .update({ used: true })
      .eq('id', invite.id)

    return {
      success: true,
      cooperativeName: invite.cooperatives?.name || 'your cooperative'
    }

  } catch (err) {
    return { error: err.message }
  }
}