import { gnosis, gnosisChiado } from 'wagmi/chains';

export const CHAIN_CONFIGS = {
  1: {
    name: 'Ethereum Mainnet',
    safeTxServiceUrl: 'https://safe-transaction-mainnet.safe.global',
    explorerTxPrefix: 'https://etherscan.io/tx/',
  },
  100: {
    name: 'Gnosis Chain',
    safeTxServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global',
    explorerTxPrefix: 'https://gnosis.blockscout.com/tx/',
  },
  10200: {
    name: 'Gnosis Chiado',
    safeTxServiceUrl: 'https://safe-transaction-chiado.safe.global',
    explorerTxPrefix: 'https://gnosis-chiado.blockscout.com/tx/',
  },
} as const;

export function getChainConfig(chainId: number) {
  return CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS] || CHAIN_CONFIGS[100];
}

export function getSafeTxServiceUrl(chainId: number): string {
  const envUrl = process.env.SAFE_TX_SERVICE_URL;
  if (envUrl) return envUrl;
  
  return getChainConfig(chainId).safeTxServiceUrl;
}

export function getExplorerTxUrl(txHash: string): string {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '100');
  const prefix = process.env.NEXT_PUBLIC_EXPLORER_TX_PREFIX || getChainConfig(chainId).explorerTxPrefix;
  return `${prefix}${txHash}`;
}

export function isTestnet(chainId: number): boolean {
  return chainId === 10200; // Chiado testnet
}

export function getWagmiChain(chainId: number) {
  switch (chainId) {
    case 100:
      return gnosis;
    case 10200:
      return gnosisChiado;
    default:
      return gnosis;
  }
}
