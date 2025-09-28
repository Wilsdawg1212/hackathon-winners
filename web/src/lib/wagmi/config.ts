import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Get project ID from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'GroupSafe',
      appLogoUrl: 'https://example.com/logo.png',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'GroupSafe',
        description: 'Secure treasury management with policy enforcement',
        url: 'https://groupsafe.app',
        icons: ['https://example.com/icon.png']
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
