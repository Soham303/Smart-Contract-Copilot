'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initWalletStandardListeners,
  detectPetraWallet,
  getPetraProvider,
  UnifiedPetraWallet,
} from '../../lib/petraWallet';

interface WalletContextType {
  walletAddress: string | null;
  shortAddress: string | null;
  isConnected: boolean;
  isPetraInstalled: boolean;
  balanceApt: string;
  network: string;
  isConnecting: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  useDeveloperAccount: () => void;
  showInstallModal: boolean;
  setShowInstallModal: (show: boolean) => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balanceApt, setBalanceApt] = useState<string>('0.00');
  const [network, setNetwork] = useState<string>('testnet');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isPetraInstalled, setIsPetraInstalled] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Check if Petra is installed in the browser window
  const checkPetraInstalled = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const provider = await detectPetraWallet(400);
    const installed = Boolean(provider);
    setIsPetraInstalled(installed);
    return installed;
  }, []);

  // Fetch real on-chain balance for the Aptos address
  const fetchBalance = useCallback(async (address: string) => {
    try {
      const res = await fetch(
        `https://api.testnet.aptoslabs.com/v1/accounts/${address}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`
      );
      if (res.ok) {
        const data = await res.json();
        const octas = Number(data?.data?.coin?.value || 0);
        const apt = (octas / 100_000_000).toFixed(2);
        setBalanceApt(apt);
        if (typeof window !== 'undefined') {
          localStorage.setItem('scc_wallet_bal', apt);
        }
      } else {
        setBalanceApt('0.00');
      }
    } catch (e) {
      console.warn('Could not fetch Aptos balance:', e);
    }
  }, []);

  // Check on mount & listen for Petra injection
  useEffect(() => {
    initWalletStandardListeners();
    checkPetraInstalled();

    // Check if user previously connected a wallet
    if (typeof window !== 'undefined') {
      const storedAddr = localStorage.getItem('scc_wallet_addr');
      const isConnectedStored = localStorage.getItem('scc_wallet_connected') === 'true';
      if (storedAddr && isConnectedStored) {
        setWalletAddress(storedAddr);
        fetchBalance(storedAddr);
      }
    }

    // Petra may inject asynchronously
    const timer = setTimeout(() => {
      checkPetraInstalled();
    }, 600);

    return () => clearTimeout(timer);
  }, [checkPetraInstalled, fetchBalance]);

  // Connect to actual Petra Wallet
  const connectWallet = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined') return false;

      // Detect provider with up to 2.5s tolerance to handle extension injection
      const petra = await detectPetraWallet(2500);

      // If Petra extension is not detected in browser
      if (!petra) {
        setIsPetraInstalled(false);
        setShowInstallModal(true);
        setIsConnecting(false);
        return false;
      }

      setIsPetraInstalled(true);

      // Trigger actual Petra extension popup
      const response = await petra.connect();
      const address = response?.address || (await petra.account())?.address;

      if (!address) {
        throw new Error('No account address returned from Petra Wallet');
      }

      // Check current network
      try {
        const net = await petra.network();
        const netName = typeof net === 'string' ? net : (net as any)?.name || 'testnet';
        setNetwork(netName.toLowerCase());
      } catch {
        setNetwork('testnet');
      }

      setWalletAddress(address);
      if (typeof window !== 'undefined') {
        localStorage.setItem('scc_wallet_addr', address);
        localStorage.setItem('scc_wallet_connected', 'true');
      }

      await fetchBalance(address);
      setShowInstallModal(false);
      return true;
    } catch (err: any) {
      console.warn('Petra Wallet connection was rejected or failed:', err);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      const petra = getPetraProvider();
      if (petra) {
        petra.disconnect();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('scc_wallet_addr');
        localStorage.removeItem('scc_wallet_connected');
        localStorage.removeItem('scc_wallet_bal');
      }
    } catch (e) {
      console.warn('Petra disconnect error:', e);
    }
    setWalletAddress(null);
    setBalanceApt('0.00');
  };

  // Fallback to Developer Testnet Account
  const useDeveloperAccount = () => {
    const devAddr = process.env.NEXT_PUBLIC_APTOS_ACCOUNT_ADDRESS || '0xaac9efd001c2d99be8ba9433babdb8f349bfd58a949ce01a6e7630e07c984e1a';
    setWalletAddress(devAddr);
    setNetwork('testnet');
    if (typeof window !== 'undefined') {
      localStorage.setItem('scc_wallet_addr', devAddr);
      localStorage.setItem('scc_wallet_connected', 'true');
    }
    fetchBalance(devAddr);
    setShowInstallModal(false);
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  const refreshBalance = async () => {
    if (walletAddress) {
      await fetchBalance(walletAddress);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        shortAddress,
        isConnected: Boolean(walletAddress),
        isPetraInstalled,
        balanceApt,
        network,
        isConnecting,
        connectWallet,
        disconnectWallet,
        useDeveloperAccount,
        showInstallModal,
        setShowInstallModal,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
