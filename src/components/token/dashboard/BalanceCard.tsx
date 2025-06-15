
import React from 'react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Wallet, Landmark, Loader2 } from 'lucide-react';

export const BalanceCard = () => {
  const { data: balance, isLoading } = useWalletBalance();

  if (isLoading) {
    return <div className="section-box flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!balance) {
    return (
        <div className="section-box">
            <h3 className="font-bold text-[18px] mb-4">Your GCAI Balance</h3>
            <p className="text-sm text-text-secondary text-center py-4">No wallet balance found.</p>
        </div>
    );
  }

  return (
    <div className="section-box">
      <h3 className="font-bold text-[18px] mb-4">Your GCAI Balance</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-text-secondary"><Wallet className="w-4 h-4 mr-2" />Available Balance</span>
          <span className="font-bold text-lg">{Number(balance.gcai_balance).toLocaleString()} GCAI</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-text-secondary"><Landmark className="w-4 h-4 mr-2" />Locked Balance</span>
          <span className="font-bold text-lg">{Number(balance.locked_balance).toLocaleString()} GCAI</span>
        </div>
      </div>
    </div>
  );
};
