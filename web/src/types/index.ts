export type Decision = 'Allow' | 'Block';

export interface PolicySummary {
  paused: boolean;
  maxPerTxNative: string;
  maxPerTxUSDC: string;
  allowedRecipientsCount: string;
}

export interface PayRequest {
  to: string;
  token: string;     // ERC20 address or "native"
  amountDecimal: string;    // decimal string, e.g., "200.00"
  from: string;
}

export interface PendingTx {
  safeTxHash: string;
  to: string;
  data: string;
  value: string;
  confirmations: number;
  threshold: number;
  proposer: string;
  submissionDate: string;
}

export interface ActivityItem {
  id: string;
  at: string;
  type: 'EXECUTED' | 'PENDING' | 'BLOCKED';
  to: string;
  token: string;
  amount: string;
  tx_hash?: string;
  reason?: string;
  actor: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PayResponse {
  decision: Decision;
  status?: 'Executed' | 'Pending';
  safeTxHash?: string;
  txHash?: string;
  reason?: string;
}

export interface PolicyCheckResult {
  decision: Decision;
  reason?: string;
}
