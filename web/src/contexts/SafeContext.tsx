'use client';

import React, { createContext, useContext, useState } from 'react';

interface SafeContextType {
  isConnected: boolean;
  safeAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loading: boolean;
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export function SafeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll simulate a connection
      // In a real implementation, you would use the actual Safe Auth Kit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate getting a Safe address
      const mockSafeAddress = '0x1234567890123456789012345678901234567890';
      
      setIsConnected(true);
      setSafeAddress(mockSafeAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setSafeAddress(null);
  };

  return (
    <SafeContext.Provider
      value={{
        isConnected,
        safeAddress,
        connectWallet,
        disconnectWallet,
        loading,
      }}
    >
      {children}
    </SafeContext.Provider>
  );
}

export function useSafe() {
  const context = useContext(SafeContext);
  if (context === undefined) {
    throw new Error('useSafe must be used within a SafeProvider');
  }
  return context;
}
