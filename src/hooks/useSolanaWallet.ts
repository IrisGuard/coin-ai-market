
import { useState, useCallback, useEffect } from 'react';

interface WalletAdapter {
  publicKey: { toString: () => string } | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    solana?: WalletAdapter;
  }
}

export const useSolanaWallet = () => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana) {
      setWallet(window.solana);
      setConnected(window.solana.connected);
      if (window.solana.publicKey) {
        setPublicKey(window.solana.publicKey.toString());
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!wallet) {
      console.warn('Solana wallet not detected. Please install Phantom or Solflare.');
      return;
    }

    try {
      setConnecting(true);
      await wallet.connect();
      setConnected(true);
      if (wallet.publicKey) {
        setPublicKey(wallet.publicKey.toString());
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  }, [wallet]);

  const disconnect = useCallback(async () => {
    if (!wallet) return;

    try {
      await wallet.disconnect();
      setConnected(false);
      setPublicKey(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [wallet]);

  return {
    wallet,
    connected,
    publicKey,
    connecting,
    connect,
    disconnect,
    isAvailable: !!wallet
  };
};
