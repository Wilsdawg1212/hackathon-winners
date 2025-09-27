import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Fetch the budget for a specific address
export async function getBudget(address: string): Promise<number> {
  const { data, error } = await supabase
    .from('budgets')
    .select('budget')
    .eq('address', address)
    .single()

  if (error) {
    throw new Error(`Failed to fetch budget for address ${address}: ${error.message}`)
  }

  return parseFloat(data.budget)
}

// Update the budget for a specific address
export async function updateBudget(address: string, newBudget: number): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .update({ budget: newBudget })
    .eq('address', address)

  if (error) {
    throw new Error(`Failed to update budget for address ${address}: ${error.message}`)
  }
}

// Add a new user to the database
export async function addUser(address: string, name: string, initialBudget: number): Promise<void> {
  const { error: userError } = await supabase
    .from('users')
    .insert([{ address, name }])

  if (userError) {
    throw new Error(`Failed to add user: ${userError.message}`)
  }

  const { error: budgetError } = await supabase
    .from('budgets')
    .insert([{ address, budget: initialBudget }])

  if (budgetError) {
    throw new Error(`Failed to add budget: ${budgetError.message}`)
  }
}