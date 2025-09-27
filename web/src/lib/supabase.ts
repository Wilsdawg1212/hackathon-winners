// Simple in-memory activity storage for development
// Replace with Supabase when ready for production

export interface ActivityItem {
  id: string;
  at: string;
  type: 'EXECUTED' | 'PENDING' | 'BLOCKED';
  to: string;
  token: string;
  amount: string;
  actor: string;
  tx_hash?: string;
  reason?: string;
}

// In-memory storage (will be lost on server restart)
let activityStore: ActivityItem[] = [
  {
    id: 'demo-1',
    at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: 'EXECUTED',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    token: 'ETH',
    amount: '0.5',
    actor: '0x1234567890123456789012345678901234567890',
    tx_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: 'demo-2',
    at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'PENDING',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    token: 'USDC',
    amount: '100',
    actor: '0x1234567890123456789012345678901234567890',
  },
  {
    id: 'demo-3',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'BLOCKED',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    token: 'ETH',
    amount: '2.0',
    actor: '0x1234567890123456789012345678901234567890',
    reason: 'EXCEEDS_MAX_PER_TX',
  },
];

export async function appendActivity(item: Omit<ActivityItem, 'id' | 'at'>) {
  const newItem: ActivityItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    at: new Date().toISOString(),
  };
  
  activityStore.unshift(newItem); // Add to beginning
  return newItem;
}

export async function listActivity(filters?: {
  type?: 'EXECUTED' | 'PENDING' | 'BLOCKED';
  limit?: number;
}) {
  let filtered = activityStore;
  
  if (filters?.type) {
    filtered = activityStore.filter(item => item.type === filters.type);
  }
  
  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  return filtered;
}

export async function updateActivity(id: string, updates: Partial<ActivityItem>) {
  const index = activityStore.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`Activity item with id ${id} not found`);
  }
  
  activityStore[index] = { ...activityStore[index], ...updates };
  return activityStore[index];
}
