'use client';

import { useConnect } from 'wagmi';
import { ChevronDown } from 'lucide-react';

interface WalletSelectorProps {
  onClose: () => void;
}

export function WalletSelector({ onClose }: WalletSelectorProps) {
  const { connect, connectors, isPending, error } = useConnect();

  const getWalletIcon = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMask':
        return '🦊';
      case 'coinbaseWallet':
        return '🔷';
      case 'walletConnect':
        return '🔗';
      case 'injected':
        return '💳';
      case 'safeApp':
        return '🛡️';
      default:
        return '👛';
    }
  };

  const getWalletName = (connector: { id: string; name?: string }) => {
    switch (connector.id) {
      case 'metaMask':
        return 'MetaMask';
      case 'coinbaseWallet':
        return 'Coinbase Wallet';
      case 'walletConnect':
        return 'WalletConnect';
      case 'injected':
        return 'Browser Wallet';
      case 'safeApp':
        return 'Safe Global';
      default:
        return connector.name || 'Unknown Wallet';
    }
  };

  const handleConnect = async (connector: { id: string }) => {
    try {
      await connect({ connector });
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Choose a wallet to connect to GroupSafe
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error.message}</p>
            </div>
          )}

          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getWalletIcon(connector.id)}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {getWalletName(connector)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {connector.id === 'metaMask' && 'Connect using MetaMask browser extension'}
                      {connector.id === 'coinbaseWallet' && 'Connect using Coinbase Wallet app'}
                      {connector.id === 'walletConnect' && 'Connect using any WalletConnect compatible wallet'}
                      {connector.id === 'injected' && 'Connect using your browser wallet'}
                      {connector.id === 'safeApp' && 'Connect using Safe Global app (opens in Safe interface)'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By connecting a wallet, you agree to GroupSafe&apos;s Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
