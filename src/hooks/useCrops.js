import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCrops(userId) {
  const [crops,   setCrops]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchCrops()
  }, [userId])

  async function fetchCrops() {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCrops(data || [])
    } catch (err) {
      console.error('Error fetching crops:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addCrop(form) {
    try {
      const { data, error } = await supabase
        .from('crops')
        .insert({
          user_id: userId,
          name:    form.name,
          variety: form.variety,
          acres:   parseFloat(form.acres) || 0,
          planted: form.planted || null,
          harvest: form.harvest || null,
          stage:   form.stage || 'seedling',
          notes:   form.notes,
        })
        .select()
        .single()

      if (error) throw error
      setCrops(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error adding crop:', err)
      throw err
    }
  }

  async function updateCropStage(id, stage) {
    try {
      const { data, error } = await supabase
        .from('crops')
        .update({ stage })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      setCrops(prev => prev.map(c => c.id === id ? data : c))
    } catch (err) {
      console.error('Error updating crop stage:', err)
      throw err
    }
  }

  async function deleteCrop(id) {
    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setCrops(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting crop:', err)
      throw err
    }
  }

  return { crops, loading, addCrop, updateCropStage, deleteCrop, fetchCrops }
}