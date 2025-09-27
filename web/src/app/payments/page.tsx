'use client';

import { useState } from 'react';
import { useSafe } from '@/contexts/SafeContext';
import { Wallet } from 'lucide-react';

export default function PaymentsPage() {
  const { isConnected, safeAddress, connectWallet, loading } = useSafe();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePayment = async () => {
    if (!recipient || !amount) return;
    
    setPaymentLoading(true);
    try {
      // Here you would implement the actual payment logic using Safe SDK
      console.log('Processing payment:', { recipient, amount });
      
      // Simulate payment processing
      setTimeout(() => {
        alert(`Payment of ${amount} ETH to ${recipient} processed successfully!`);
        setRecipient('');
        setAmount('');
        setPaymentLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
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
                Connect Your Safe Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Gnosis Safe wallet to start making secure payments
              </p>
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-800 font-medium">
                  Connected to Safe: {safeAddress?.slice(0, 6)}...{safeAddress?.slice(-4)}
                </span>
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
    </div>
  );
}
