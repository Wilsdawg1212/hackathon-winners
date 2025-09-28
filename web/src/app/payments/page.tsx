'use client';

import { useState } from 'react';
import { useSafe } from '@/contexts/SafeContext';
import { WalletSelector } from '@/components/WalletSelector';
import { Wallet } from 'lucide-react';

export default function PaymentsPage() {
  const { isConnected, safeAddress, userAddress, safeAccount, safeService, isSafeApp, safeAppInfo, disconnectWallet, loading, error } = useSafe();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const handlePayment = async () => {
    if (!recipient || !amount || !safeService || !safeAddress) return;
    
    setPaymentLoading(true);
    try {
      console.log('Processing payment:', { recipient, amount, safeAddress });
      
      // Create a Safe transaction
      const transaction = await safeService.createTransaction(
        safeAddress,
        recipient,
        amount
      );
      
      console.log('Created transaction:', transaction);
      
      // Execute the transaction (in demo mode)
      const result = await safeService.executeTransaction(transaction);
      
      console.log('Transaction result:', result);
      
      alert(`Payment of ${amount} ETH to ${recipient} processed successfully!\nTransaction Hash: ${result.hash}`);
      setRecipient('');
      setAmount('');
    } catch (error: unknown) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GroupSafe Payments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure, policy-enforced payments for shared treasuries. 
            Make everyday payments fast and safe for your team.
          </p>
        </div>

        {/* Connection Status */}
        <div className="max-w-2xl mx-auto mb-8">
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to start making secure payments. 
                You can switch between different accounts anytime.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={() => setShowWalletSelector(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Choose from MetaMask, Coinbase Wallet, or other supported wallets
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <span className="text-green-800 font-medium block">
                      Wallet Connected
                    </span>
                    <span className="text-green-600 text-sm">
                      {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowWalletSelector(true)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Switch Wallet
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    onClick={disconnectWallet}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200">
                {isSafeApp && safeAppInfo ? (
                  <div className="text-green-700 text-sm">
                    <p><strong>🛡️ Connected via Safe Global</strong></p>
                    <p><strong>Safe Address:</strong> {safeAppInfo.safeAddress.slice(0, 6)}...{safeAppInfo.safeAddress.slice(-4)}</p>
                    <p><strong>Owners:</strong> {safeAppInfo.owners.length}</p>
                    <p><strong>Threshold:</strong> {safeAppInfo.threshold}</p>
                    <p><strong>Chain ID:</strong> {safeAppInfo.chainId}</p>
                    <p className="mt-2 text-xs"><strong>Note:</strong> You&apos;re connected to a Safe account with modular roles and budgets enabled.</p>
                  </div>
                ) : safeAccount ? (
                  <div className="text-green-700 text-sm">
                    <p><strong>Safe Account:</strong> {safeAccount.address.slice(0, 6)}...{safeAccount.address.slice(-4)}</p>
                    <p><strong>Owners:</strong> {safeAccount.owners.length}</p>
                    <p><strong>Threshold:</strong> {safeAccount.threshold}</p>
                  </div>
                ) : (
                  <div className="text-green-700 text-sm">
                    <p><strong>Note:</strong> This demo connects directly to your personal wallet. 
                    Connect via Safe Global to access modular roles and budgets.</p>
                    <p className="mt-2"><strong>To switch wallets:</strong> Click &quot;Switch Wallet&quot; above to choose a different wallet or account.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        {isConnected && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Make a Payment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={!recipient || !amount || paymentLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {paymentLoading ? 'Processing...' : 'Send Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why GroupSafe?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Policy Enforcement
              </h3>
              <p className="text-gray-600">
                Automatic policy validation ensures payments comply with your organization&apos;s rules
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast & Secure
              </h3>
              <p className="text-gray-600">
                Routine payments execute immediately while maintaining security through Safe multisig
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Audit Trail
              </h3>
              <p className="text-gray-600">
                Complete transparency with detailed logs of every payment and policy decision
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector onClose={() => setShowWalletSelector(false)} />
      )}
    </div>
  );
}
