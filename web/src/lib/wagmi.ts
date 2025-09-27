import { createConfig, http } from 'wagmi';
import { gnosis, gnosisChiado } from 'wagmi/chains';
import { getWagmiChain } from './chain';

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '100');
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.gnosis.gateway.fm';

const chain = getWagmiChain(chainId);

export const config = createConfig({
  chains: [gnosis, gnosisChiado],
  transports: {
    [gnosis.id]: http(rpcUrl),
    [gnosisChiado.id]: http(rpcUrl),
  },
});

export { chain };
