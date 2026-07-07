import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLivestock(userId) {
  const [livestock, setLivestock] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchLivestock()
  }, [userId])

  async function fetchLivestock() {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*, livestock_records(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLivestock(data || [])
    } catch (err) {
      console.error('Error fetching livestock:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addLivestock(form) {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .insert({
          user_id: userId,
          emoji:   form.emoji || '🐄',
          name:    form.name,
          type:    form.type  || 'Dairy',
          count:   parseInt(form.count) || 0,
          notes:   form.notes || null,
        })
        .select()
        .single()

      if (error) throw error
      setLivestock(prev => [{ ...data, livestock_records: [] }, ...prev])
      return data
    } catch (err) {
      console.error('Error adding livestock:', err)
      throw err
    }
  }

  async function addRecord(livestockId, record) {
    try {
      const { data, error } = await supabase
        .from('livestock_records')
        .insert({
          livestock_id:  livestockId,
          user_id:       userId,
          type:          record.type,
          qty:           parseFloat(record.qty),
          recorded_date: record.date || null,
        })
        .select()
        .single()

      if (error) throw error
      setLivestock(prev => prev.map(l =>
        l.id === livestockId
          ? { ...l, livestock_records: [data, ...(l.livestock_records || [])] }
          : l
      ))
      return data
    } catch (err) {
      console.error('Error adding record:', err)
      throw err
    }
  }

  async function deleteLivestock(id) {
    try {
      const { error } = await supabase
        .from('livestock')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setLivestock(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting livestock:', err)
      throw err
    }
  }

  return { livestock, loading, addLivestock, addRecord, deleteLivestock, fetchLivestock }
}