'use client';

import { useState, useEffect } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { PendingTx } from '@/types';
import { formatTime } from '@/lib/format';
import AddressBadge from '@/components/AddressBadge';
import EmptyState from '@/components/EmptyState';
import { ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';

export default function ApprovalsPage() {
  const router = useRouter();
  const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const response = await fetch('/api/safe/approvals/list');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPendingTxs(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (safeTxHash: string) => {
    setProcessing(safeTxHash);
    
    try {
      const response = await fetch('/api/safe/approvals/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ safeTxHash })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.data.status === 'Executed') {
          alert(`Transaction confirmed and executed! TX: ${result.data.txHash}`);
        } else {
          alert(`Transaction confirmed: ${result.data.message}`);
        }
        loadApprovals(); // Refresh the list
      } else {
        alert(`Confirmation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Confirmation failed:', error);
      alert('Confirmation failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
              <p className="text-gray-600">Review and approve pending transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">
              {pendingTxs.length} pending
            </span>
          </div>
        </div>

        {pendingTxs.length === 0 ? (
          <EmptyState
            title="No approvals pending"
            description="All transactions have been processed. New transactions requiring approval will appear here."
            actionLabel="Make a Payment"
            actionHref="/pay"
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {pendingTxs.map((tx) => (
                <div key={tx.safeTxHash} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-500">
                            {formatTime(tx.submissionDate)}
                          </span>
                        </div>
                        <AddressBadge address={tx.to} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Value
                          </label>
                          <p className="text-sm font-medium text-black">
                            {tx.value} ETH
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Proposer
                          </label>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <AddressBadge address={tx.proposer} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Confirmations
                          </label>
                          <p className="text-sm text-black">{tx.confirmations}/{tx.threshold}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={() => handleConfirm(tx.safeTxHash)}
                        disabled={processing === tx.safeTxHash}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                      >
                        {processing === tx.safeTxHash ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
