import 'dotenv/config'
import express, { Request, Response } from 'express'
import { ethers } from 'ethers'
import { getDepartmentForUser, getBudgetForDepartment, updateBudgetForDepartment, addTransaction } from './supabaseService'
import { proposeTransaction } from './propose'

const app = express()
app.use(express.json()) // Middleware to parse JSON requests

app.post('/transaction', async (req: Request, res: Response) => {
  const { userId, recipient, value } = req.body

  if (!userId || !recipient || !value) {
    return res.status(400).json({ error: 'Missing required fields: userId, recipient, or value' })
  }

  try {
    // Fetch the user's department
    const departmentId = await getDepartmentForUser(userId)

    // Fetch the department's budget
    const currentBudget = await getBudgetForDepartment(departmentId)

    // Convert transaction value from wei to ETH
    const txValueInEth = parseFloat(ethers.formatEther(value))

    // Check if the transaction exceeds the budget
    if (txValueInEth > currentBudget) {
      return res.status(400).json({ error: `Transaction value exceeds the budget. Current budget: ${currentBudget} ETH` })
    }

    // Propose the transaction
    const safeTxHash = await proposeTransaction(userId, recipient, value)

    // Update the department's budget
    const newBudget = currentBudget - txValueInEth
    await updateBudgetForDepartment(departmentId, newBudget)

    // Add the transaction to the database
    const senderWallet = userId // Assuming `userId` is the sender's wallet address
    const ownerWallet = process.env.SAFE_ADDRESS! // Safe owner's wallet address
    await addTransaction(senderWallet, ownerWallet, recipient, safeTxHash, txValueInEth)

    res.status(200).json({
      message: 'Transaction proposed successfully',
      safeTxHash,
      newBudget
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})