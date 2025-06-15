
import React from 'react';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { Lock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const LocksCard = () => {
  const { data: locks, isLoading } = useTokenLocks();

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl bg-gradient-to-br from-[#ff00cc]/20 via-white/90 to-[#7c3aed]/20 border-2 border-[#ff00cc]/70 shadow-xl p-8 animate-fade-in">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[#ff00cc] w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl bg-gradient-to-br from-[#ff00cc]/20 via-white/90 to-[#7c3aed]/20 border-2 border-[#ff00cc]/70 shadow-xl p-6 animate-fade-in">
      <h3 className="font-extrabold text-xl mb-5 bg-gradient-to-r from-[#7c3aed] via-[#ff00cc] to-[#0070fa] bg-clip-text text-transparent animate-glow">Your Premium Staking Positions</h3>
      {locks && locks.length > 0 ? (
        <ul className="space-y-4">
          {locks.map((lock) => (
            <li key={lock.id} className="flex items-center justify-between p-4 glass-card bg-gradient-to-r from-white/80 to-white/60 rounded-xl border border-[#ff00cc]/40 shadow-md">
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-4 text-[#7c3aed]" />
                <div>
                  <span className="font-extrabold text-lg bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">{Number(lock.amount).toLocaleString()} GCAI</span>
                  <p className="text-sm font-semibold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">Earning rewards • Unlocks in {formatDistanceToNow(new Date(lock.unlock_date))}</p>
                </div>
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent animate-glow">+{lock.benefit_percentage}% APY</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent mb-4">No active staking positions found.</p>
          <p className="text-xs font-medium bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">Start staking GCAI tokens to earn premium rewards and unlock advanced AI features!</p>
        </div>
      )}
    </div>
  );
};
