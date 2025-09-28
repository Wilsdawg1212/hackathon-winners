'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useClient } from 'wagmi';
import { SafeService, SafeAccount } from '@/lib/safe/safeService';
import { getSafeAppDetector, SafeAppInfo } from '@/lib/safe/safeAppDetector';

interface SafeContextType {
  isConnected: boolean;
  safeAddress: string | null;
  userAddress: string | null;
  safeAccount: SafeAccount | null;
  isSafeApp: boolean;
  safeAppInfo: SafeAppInfo | null;
  connectWallet: () => Promise<void>;
  switchWallet: () => Promise<void>;
  createSafe: (owners: string[], threshold?: number) => Promise<void>;
  connectToExistingSafe: (safeAddress: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  loading: boolean;
  error: string | null;
  safeService: SafeService | null;
  connectors: unknown[];
}

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export function SafeProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected: wagmiConnected } = useAccount();
  const { connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const client = useClient();

  const [safeAccount, setSafeAccount] = useState<SafeAccount | null>(null);
  const [safeService, setSafeService] = useState<SafeService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSafeApp, setIsSafeApp] = useState(false);
  const [safeAppInfo, setSafeAppInfo] = useState<SafeAppInfo | null>(null);

  // Initialize Safe App detection
  useEffect(() => {
    const initSafeApp = async () => {
      try {
        const detector = getSafeAppDetector();
        const isDetected = await detector.initialize();
        setIsSafeApp(isDetected);
        
        if (isDetected) {
          const safeInfo = await detector.getSafeInfo();
          setSafeAppInfo(safeInfo);
          
          if (safeInfo) {
            // Create SafeAccount from Safe App info
            const safeAccountInfo: SafeAccount = {
              address: safeInfo.safeAddress,
              owners: safeInfo.owners,
              threshold: safeInfo.threshold,
              nonce: 0, // This would be fetched from the Safe contract
            };
            setSafeAccount(safeAccountInfo);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Safe App detection:', error);
        setIsSafeApp(false);
        setSafeAppInfo(null);
      }
    };

    initSafeApp();
  }, []);

  // Initialize Safe service when wallet connects
  useEffect(() => {
    if (wagmiConnected && address && client && !isSafeApp) {
      const initSafeService = async () => {
        try {
          const safeSvc = new SafeService(client);
          await safeSvc.initialize();
          setSafeService(safeSvc);
        } catch (error) {
          console.error('Failed to initialize Safe service:', error);
          setError('Failed to initialize Safe service');
        }
      };
      
      initSafeService();
    } else if (!wagmiConnected) {
      setSafeService(null);
      if (!isSafeApp) {
        setSafeAccount(null);
      }
    }
  }, [wagmiConnected, address, client, isSafeApp]);

  // Update error state when connect error changes
  useEffect(() => {
    if (connectError) {
      setError(connectError.message);
    }
  }, [connectError]);

  const connectWallet = async () => {
    try {
      setError(null);
      // Wagmi will handle the connection flow
      // The user will see wallet selection in the UI
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
    }
  };

  const switchWallet = async () => {
    try {
      setError(null);
      // Disconnect first, then user can reconnect with different wallet
      disconnect();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch wallet';
      setError(errorMessage);
    }
  };

  const createSafe = async (owners: string[], threshold: number = 1) => {
    if (!safeService) {
      throw new Error('Safe service not initialized');
    }

    try {
      const safe = await safeService.createSafe(owners, threshold);
      setSafeAccount(safe);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create Safe';
      setError(errorMessage);
      throw error;
    }
  };

  const connectToExistingSafe = async (safeAddress: string) => {
    if (!safeService) {
      throw new Error('Safe service not initialized');
    }

    try {
      const safe = await safeService.connectToSafe(safeAddress);
      if (safe) {
        setSafeAccount(safe);
      } else {
        throw new Error('Failed to connect to Safe');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to Safe';
      setError(errorMessage);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      disconnect();
      setSafeAccount(null);
      setSafeService(null);
      setError(null);
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  return (
    <SafeContext.Provider
      value={{
        isConnected: isSafeApp || wagmiConnected,
        safeAddress: isSafeApp ? (safeAccount?.address || address) : address || null,
        userAddress: address || null,
        safeAccount,
        isSafeApp,
        safeAppInfo,
        connectWallet,
        switchWallet,
        createSafe,
        connectToExistingSafe,
        disconnectWallet,
        loading: isPending,
        error,
        safeService,
        connectors,
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