// Demo configuration for GroupSafe
export const DEFAULT_TOKEN_ADDRESS = '0xA0b86a33E6441b8c4C8C0E4b8c4C8C0E4b8c4C8C0'; // Mock USDC
export const NATIVE_TOKEN = 'native';

export const DEMO_RECIPIENTS = [
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  '0x8ba1f109551bD432803012645Hac136c',
  '0x1234567890123456789012345678901234567890'
];

export const EXPLORER_TX_PREFIX = process.env.NEXT_PUBLIC_EXPLORER_TX_URL_PREFIX || 'https://etherscan.io/tx/';

export const DEMO_TOKENS = [
  { address: NATIVE_TOKEN, symbol: 'ETH', decimals: 18 },
  { address: DEFAULT_TOKEN_ADDRESS, symbol: 'USDC', decimals: 6 }
];
