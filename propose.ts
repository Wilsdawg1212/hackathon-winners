import 'dotenv/config'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { MetaTransactionData, OperationType } from '@safe-global/types-kit'

const RPC_URL = process.env.RPC_URL!
const SAFE_ADDRESS = process.env.SAFE_ADDRESS!
const OWNER1_ADDRESS = process.env.OWNER1_ADDRESS!
const OWNER1_PK = process.env.OWNER1_PK!
const CHAIN_ID = BigInt(process.env.CHAIN_ID!)
const TX_SERVICE = process.env.TX_SERVICE!

async function main() {
  const api = new SafeApiKit({ chainId: CHAIN_ID, txServiceUrl: TX_SERVICE }) // or apiKey
  const protocol = await Safe.init({
    provider: RPC_URL,
    signer: OWNER1_PK,
    safeAddress: SAFE_ADDRESS
  })

  const txData: MetaTransactionData = {
    to: '0xRecipient...',        // change me
    value: '10000000000000000',  // 0.01 ETH in wei
    data: '0x',
    operation: OperationType.Call
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
}

main().catch(console.error)
