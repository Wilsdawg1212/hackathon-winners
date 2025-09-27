export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  
  const divisor = Math.pow(10, decimals);
  const formatted = (num / divisor).toFixed(decimals > 6 ? 6 : decimals);
  
  // Remove trailing zeros
  return parseFloat(formatted).toString();
}

export function parseTokenAmount(amount: string, decimals: number = 18): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  
  const multiplier = Math.pow(10, decimals);
  return Math.floor(num * multiplier).toString();
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
