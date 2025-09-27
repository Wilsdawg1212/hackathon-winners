import 'dotenv/config'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { MetaTransactionData, OperationType } from '@safe-global/types-kit'
import { createClient } from '@supabase/supabase-js'
import { ethers, formatEther } from 'ethers'

const RPC_URL = process.env.RPC_URL!
const SAFE_ADDRESS = process.env.SAFE_ADDRESS!
const OWNER1_ADDRESS = process.env.OWNER1_ADDRESS!
const OWNER1_PK = process.env.OWNER1_PK!
const CHAIN_ID = BigInt(process.env.CHAIN_ID!)
const TX_SERVICE = process.env.TX_SERVICE!
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function getBudget(address: string): Promise<number> {
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

async function updateBudget(address: string, newBudget: number): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .update({ budget: newBudget })
    .eq('address', address)

  if (error) {
    throw new Error(`Failed to update budget for address ${address}: ${error.message}`)
  }
}

async function main() {
  const api = new SafeApiKit({ chainId: CHAIN_ID, txServiceUrl: TX_SERVICE })
  const protocol = await Safe.init({
    provider: RPC_URL,
    signer: OWNER1_PK,
    safeAddress: SAFE_ADDRESS
  })

  const txData: MetaTransactionData = {
    to: '0xRecipient...',        // Replace with the recipient's address
    value: '10000000000000000',  // 0.01 ETH in wei
    data: '0x',
    operation: OperationType.Call
  }

  // Convert transaction value from wei to ETH
  const txValueInEth = parseFloat(formatEther(txData.value))

  // Fetch the sender's budget from Supabase
  const currentBudget = await getBudget(OWNER1_ADDRESS)

  // Check if the transaction exceeds the budget
  if (txValueInEth > currentBudget) {
    throw new Error(`Transaction value exceeds the budget. Current budget: ${currentBudget} ETH`)
  }

  const safeTx = await protocol.createTransaction({ transactions: [txData] })
  const safeTxHash = await protocol.getTransactionHash(safeTx)
  const signature = await protocol.signHash(safeTxHash)

  await api.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTx.data,
    safeTxHash,
    senderAddress: OWNER1_ADDRESS,
    senderSignature: signature.data
  })

  console.log('Proposed:', safeTxHash)

  // Update the budget in Supabase
  const newBudget = currentBudget - txValueInEth
  await updateBudget(OWNER1_ADDRESS, newBudget)

  console.log(`Budget updated. New budget: ${newBudget} ETH`)
}

main().catch((error: Error) => {
  console.error('Error:', error.message)
})
