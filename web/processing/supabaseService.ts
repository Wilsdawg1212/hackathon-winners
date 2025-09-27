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

// Fetch the department ID for a user
export async function getDepartmentForUser(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('department_id')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch department for user ${userId}: ${error.message}`)
  }

  return data.department_id
}

// Fetch the budget for a department
export async function getBudgetForDepartment(departmentId: number): Promise<number> {
  const { data, error } = await supabase
    .from('budgets')
    .select('budget')
    .eq('department', departmentId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch budget for department ${departmentId}: ${error.message}`)
  }

  return data.budget
}

// Update the budget for a department
export async function updateBudgetForDepartment(departmentId: number, newBudget: number): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .update({ budget: newBudget })
    .eq('department', departmentId)

  if (error) {
    throw new Error(`Failed to update budget for department ${departmentId}: ${error.message}`)
  }
}

// Add a transaction record to the database
export async function addTransaction(
  senderWallet: string,
  ownerWallet: string,
  receiverWallet: string,
  transactionId: string,
  amount: number
): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        sender_wallet: senderWallet,
        owner_wallet: ownerWallet,
        receiver_wallet: receiverWallet,
        transaction_id: transactionId,
        amount
      }
    ])

  if (error) {
    throw new Error(`Failed to add transaction: ${error.message}`)
  }
}