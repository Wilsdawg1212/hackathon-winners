import 'dotenv/config'
import express, { Request, Response } from 'express'
import { ethers } from 'ethers'
import { getBudget, updateBudget } from './supabaseService'
import { createClient } from '@supabase/supabase-js'
import { proposeTransaction } from './propose'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function addTransaction(userAddress: string, recipient: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .insert([{ address: userAddress, recipient, value }])

  if (error) {
    throw new Error(`Failed to add transaction: ${error.message}`)
  }
}

const app = express()
app.use(express.json()) // Middleware to parse JSON requests

// Endpoint to handle transactions
app.post('/transaction', async (req: Request, res: Response) => {
  const { userAddress, recipient, value } = req.body

  if (!userAddress || !recipient || !value) {
    return res.status(400).json({ error: 'Missing required fields: userAddress, recipient, or value' })
  }

  try {
    // Fetch the user's budget from Supabase
    const currentBudget = await getBudget(userAddress)

    // Convert transaction value from wei to ETH
    const txValueInEth = parseFloat(ethers.formatEther(value))

    // Check if the transaction exceeds the budget
    if (txValueInEth > currentBudget) {
      return res.status(400).json({ error: `Transaction value exceeds the budget. Current budget: ${currentBudget} ETH` })
    }

    // Propose the transaction
    const safeTxHash = await proposeTransaction(userAddress, recipient, value)

    // Update the user's budget in Supabase
    const newBudget = currentBudget - txValueInEth
    await updateBudget(userAddress, newBudget)

    res.status(200).json({
      message: 'Transaction proposed successfully',
      safeTxHash,
      newBudget
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${3000}`)
})