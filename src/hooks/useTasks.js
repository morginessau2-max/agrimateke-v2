import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTasks(userId) {
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchTasks()
  }, [userId])

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addTask(form) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id:     userId,
          title:       form.title,
          description: form.desc,
          priority:    form.priority || 'medium',
          category:    form.category || 'general',
          due_date:    form.due || null,
          done:        false,
        })
        .select()
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error adding task:', err)
      throw err
    }
  }

  async function toggleTask(id, done) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ done })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      setTasks(prev => prev.map(t => t.id === id ? data : t))
    } catch (err) {
      console.error('Error toggling task:', err)
      throw err
    }
  }

  async function deleteTask(id) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      throw err
    }
  }

  return { tasks, loading, addTask, toggleTask, deleteTask, fetchTasks }
}