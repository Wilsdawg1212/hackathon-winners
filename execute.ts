import 'dotenv/config'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'

const RPC_URL = process.env.RPC_URL!
const SAFE_ADDRESS = process.env.SAFE_ADDRESS!
const OWNER2_PK = process.env.OWNER2_PK!
const CHAIN_ID = BigInt(process.env.CHAIN_ID!)
const TX_SERVICE = process.env.TX_SERVICE!
const SAFE_TX_HASH = process.env.SAFE_TX_HASH!

async function main() {
  const api = new SafeApiKit({ chainId: CHAIN_ID, txServiceUrl: TX_SERVICE })
  const protocol = await Safe.init({
    provider: RPC_URL,
    signer: OWNER2_PK,
    safeAddress: SAFE_ADDRESS
  })

  // (Optional) fetch tx details: const tx = await api.getTransaction(SAFE_TX_HASH)
  const sig = await protocol.signHash(SAFE_TX_HASH)
  await api.confirmTransaction(SAFE_TX_HASH, sig.data)

  console.log('Confirmed:', SAFE_TX_HASH)
}

main().catch(console.error)
