'use client';

import { useState, useEffect, useCallback } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { PayRequest, PolicySummary, PolicyCheckResult } from '@/types';
import { formatAddress, isValidAddress } from '@/lib/format';
import TokenAmountInput from '@/components/TokenAmountInput';
import { ArrowLeft, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function PayPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const [to, setTo] = useState('');
  const [token, setToken] = useState('native');
  const [amount, setAmount] = useState('');
  const [policySummary, setPolicySummary] = useState<PolicySummary | null>(null);
  const [policyCheck, setPolicyCheck] = useState<PolicyCheckResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPolicySummary = async () => {
    try {
      const response = await fetch('/api/policy/summary');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPolicySummary(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to load policy summary:', error);
    }
  };

  const checkPolicy = useCallback(async () => {
    if (!to || !amount || !token) return;

    try {
      // For now, we'll do a simple check - in a real implementation,
      // this would call the policy contract directly
      setPolicyCheck({ decision: 'Allow', reason: 'Policy check passed' });
    } catch (error) {
      console.error('Policy check failed:', error);
      setPolicyCheck({ decision: 'Block', reason: 'Policy check failed' });
    }
  }, [to, amount, token]);

  useEffect(() => {
    loadPolicySummary();
  }, []);

  useEffect(() => {
    if (to && amount && token) {
      checkPolicy();
    } else {
      setPolicyCheck(null);
    }
  }, [checkPolicy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!to || !amount || !token) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidAddress(to)) {
      alert('Please enter a valid recipient address');
      return;
    }

    setSubmitting(true);

    try {
      const payRequest: PayRequest = {
        to,
        token,
        amountDecimal: amount,
        from: address!
      };

      const response = await fetch('/api/safe/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payRequest)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.data.decision === 'Allow') {
          if (result.data.status === 'Executed') {
            alert(`Payment executed successfully! Transaction: ${result.data.txHash}`);
          } else {
            alert(`Payment submitted for approval. Safe Tx Hash: ${result.data.safeTxHash}`);
          }
          setTo('');
          setAmount('');
          router.push('/activity');
        } else {
          alert(`Payment blocked: ${result.data.reason}`);
        }
      } else {
        alert(`Payment failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Payment submission failed:', error);
      alert('Payment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'Allow':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Block':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Allow':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Block':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Make a Payment</h1>
            <p className="text-gray-600">Send funds through GroupSafe with policy enforcement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">Quick select:</span>
                      <button
                        type="button"
                        onClick={() => setTo('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-black"
                      >
                        {formatAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Token and Amount */}
                <TokenAmountInput
                  token={token}
                  amount={amount}
                  onTokenChange={setToken}
                  onAmountChange={setAmount}
                  maxAmount={token === 'native' ? policySummary?.maxPerTxNative : policySummary?.maxPerTxUSDC}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isConnected || !to || !amount || !token || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Policy Check Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Check</h3>
              
              {policyCheck ? (
                <div className={`p-4 rounded-lg border ${getDecisionColor(policyCheck.decision)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getDecisionIcon(policyCheck.decision)}
                    <span className="font-medium">{policyCheck.decision}</span>
                  </div>
                  {policyCheck.reason && (
                    <p className="text-sm">{policyCheck.reason}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter recipient and amount to see policy check</p>
                </div>
              )}

              {/* Policy Summary */}
              {policySummary && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Current Policy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max per tx (Native):</span>
                      <span className="font-medium">{policySummary.maxPerTxNative} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max per tx (USDC):</span>
                      <span className="font-medium">{policySummary.maxPerTxUSDC} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        policySummary.paused ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {policySummary.paused ? 'Paused' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                Please connect your wallet to make payments
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
