import { QueuedItem, ActivityItem } from '@/types';

// In-memory storage for serverless environments
// Using a simple object to avoid function serialization issues
const store = {
  queuedItems: [] as QueuedItem[],
  activityItems: [] as ActivityItem[]
};

export function getQueued(): QueuedItem[] {
  return [...store.queuedItems];
}

export function addQueued(item: QueuedItem): void {
  store.queuedItems.push(item);
}

export function removeQueued(id: string): boolean {
  const index = store.queuedItems.findIndex(item => item.id === id);
  if (index !== -1) {
    store.queuedItems.splice(index, 1);
    return true;
  }
  return false;
}

export function getActivity(): ActivityItem[] {
  return [...store.activityItems].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function addActivity(item: ActivityItem): void {
  store.activityItems.unshift(item); // Add to beginning for chronological order
}

export function clearAll(): void {
  store.queuedItems = [];
  store.activityItems = [];
}

export function seedDemoData(): void {
  // Add some demo activity
  const now = new Date();
  addActivity({
    id: 'demo-1',
    at: new Date(now.getTime() - 3600000).toISOString(),
    type: 'EXECUTED',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    token: '0xA0b86a33E6441b8c4C8C0E4b8c4C8C0E4b8c4C8C0',
    amount: '100.00',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    actor: '0x1234567890123456789012345678901234567890'
  });

  addActivity({
    id: 'demo-2',
    at: new Date(now.getTime() - 7200000).toISOString(),
    type: 'QUEUED',
    to: '0x8ba1f109551bD432803012645Hac136c',
    token: 'native',
    amount: '2.5',
    reason: 'Exceeds per-transaction limit',
    actor: '0x1234567890123456789012345678901234567890'
  });
}
