'use client';

import { useState } from 'react';
import { useSafe } from '@/contexts/SafeContext';
import { WalletSelector } from '@/components/WalletSelector';
import { Shield, Users, Settings, ArrowRight } from 'lucide-react';

export default function SafeTestPage() {
  const { 
    isConnected, 
    userAddress, 
    isSafeApp, 
    safeAppInfo,
    disconnectWallet, 
    loading, 
    error 
  } = useSafe();
  
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-purple-600" />
            Safe Global Integration Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your Safe Global connection and explore modular roles and budgets functionality.
          </p>
        </div>

        {/* Connection Status */}
        <div className="max-w-4xl mx-auto mb-8">
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Connect to Safe Global
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Connect your Safe account to access modular roles and budgets. 
                You can connect via regular wallets or directly through the Safe Global interface.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={() => setShowWalletSelector(true)}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Available connection methods:</p>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <span>🦊</span> MetaMask
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🛡️</span> Safe Global
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🔗</span> WalletConnect
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Connection Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Connection Status
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowWalletSelector(true)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Switch
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

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connection Type:</span>
                    <span className="font-medium">
                      {isSafeApp ? '🛡️ Safe Global' : '👛 Regular Wallet'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Address:</span>
                    <span className="font-mono text-sm">
                      {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                  </div>

                  {safeAppInfo && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Safe Address:</span>
                        <span className="font-mono text-sm">
                          {safeAppInfo.safeAddress.slice(0, 6)}...{safeAppInfo.safeAddress.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owners:</span>
                        <span className="font-medium">{safeAppInfo.owners.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threshold:</span>
                        <span className="font-medium">{safeAppInfo.threshold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chain ID:</span>
                        <span className="font-medium">{safeAppInfo.chainId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Available */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Available Features
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Modular Roles</p>
                      <p className="text-sm text-gray-600">
                        {isSafeApp ? 'Available' : 'Requires Safe connection'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Budget Management</p>
                      <p className="text-sm text-gray-600">
                        {isSafeApp ? 'Available' : 'Requires Safe connection'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Policy Enforcement</p>
                      <p className="text-sm text-gray-600">
                        {isSafeApp ? 'Active' : 'Basic mode'}
                      </p>
                    </div>
                  </div>
                </div>

                {!isSafeApp && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Tip:</strong> Connect via Safe Global to unlock advanced features like 
                      spending limits, role-based access control, and policy enforcement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        {isConnected && isSafeApp && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">🎉 Safe Global Connected!</h3>
              <p className="mb-4">
                You&apos;re now connected to Safe Global with modular roles and budgets enabled. 
                You can now access advanced features like:
              </p>
              <ul className="list-disc list-inside space-y-1 text-purple-100">
                <li>Spending limits for different team members</li>
                <li>Role-based access control</li>
                <li>Policy enforcement for transactions</li>
                <li>Multi-signature approvals</li>
              </ul>
              <div className="mt-4">
                <a 
                  href="/payments" 
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Go to Payments <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Selector Modal */}
        {showWalletSelector && (
          <WalletSelector onClose={() => setShowWalletSelector(false)} />
        )}
      </div>
    </div>
  );
}
