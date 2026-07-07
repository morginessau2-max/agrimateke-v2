import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSales(userId) {
  const [sales,    setSales]    = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchAll()
  }, [userId])

  async function fetchAll() {
    try {
      const [salesRes, expensesRes] = await Promise.all([
        supabase.from('sales').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ])

      if (salesRes.error)    throw salesRes.error
      if (expensesRes.error) throw expensesRes.error

      setSales(salesRes.data       || [])
      setExpenses(expensesRes.data || [])
    } catch (err) {
      console.error('Error fetching sales/expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addSale(form) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          user_id:   userId,
          item:      form.item,
          qty:       parseFloat(form.qty)   || null,
          price:     parseFloat(form.price) || null,
          total:     parseFloat(form.total),
          buyer:     form.buyer || null,
          sale_date: form.date  || null,
        })
        .select()
        .single()

      if (error) throw error
      setSales(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error adding sale:', err)
      throw err
    }
  }

  async function deleteSale(id) {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setSales(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting sale:', err)
      throw err
    }
  }

  async function addExpense(form) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id:      userId,
          description:  form.desc   || 'Expense',
          category:     form.cat    || 'other',
          amount:       parseFloat(form.amount),
          expense_date: form.date   || null,
        })
        .select()
        .single()

      if (error) throw error
      setExpenses(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error adding expense:', err)
      throw err
    }
  }

  async function deleteExpense(id) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  return {
    sales, expenses, loading,
    addSale, deleteSale,
    addExpense, deleteExpense,
    fetchAll
  }
}