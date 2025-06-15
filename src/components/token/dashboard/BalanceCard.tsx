
import React from 'react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Wallet, Landmark, Loader2 } from 'lucide-react';

export const BalanceCard = () => {
  const { data: balance, isLoading } = useWalletBalance();

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70 shadow-xl p-8 animate-fade-in">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[#00d4ff] w-8 h-8" />
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
        <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70 shadow-xl p-6 animate-fade-in">
            <h3 className="font-extrabold text-xl mb-4 bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">Your GCAI Balance</h3>
            <p className="text-sm text-[#0070fa] text-center py-4 font-semibold">No wallet balance found.</p>
        </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70 shadow-xl p-6 animate-fade-in">
      <h3 className="font-extrabold text-xl mb-5 bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">Your GCAI Balance</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 glass-card bg-gradient-to-r from-white/80 to-white/60 rounded-xl border border-[#00d4ff]/40">
          <span className="flex items-center font-bold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">
            <Wallet className="w-5 h-5 mr-3 text-[#00d4ff]" />
            Available Balance
          </span>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">{Number(balance.gcai_balance).toLocaleString()} GCAI</span>
        </div>
        <div className="flex items-center justify-between p-3 glass-card bg-gradient-to-r from-white/80 to-white/60 rounded-xl border border-[#ff00cc]/40">
          <span className="flex items-center font-bold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">
            <Landmark className="w-5 h-5 mr-3 text-[#ff00cc]" />
            Locked Balance
          </span>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent">{Number(balance.locked_balance).toLocaleString()} GCAI</span>
        </div>
      </div>
    </div>
  );
};
