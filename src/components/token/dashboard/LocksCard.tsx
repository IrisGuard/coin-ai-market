
import React from 'react';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { Lock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const LocksCard = () => {
  const { data: locks, isLoading } = useTokenLocks();

  if (isLoading) {
    return <div className="section-box flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="section-box">
      <h3 className="font-bold text-[18px] mb-4">Your Token Locks</h3>
      {locks && locks.length > 0 ? (
        <ul className="space-y-3">
          {locks.map((lock) => (
            <li key={lock.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-3 text-brand-primary" />
                <div>
                  <span className="font-semibold">{Number(lock.amount).toLocaleString()} GCAI</span>
                  <p className="text-xs text-text-secondary">Unlocks in {formatDistanceToNow(new Date(lock.unlock_date))}</p>
                </div>
              </div>
              <span className="font-bold text-brand-success">+{lock.benefit_percentage}% APY</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-secondary text-center py-4">You have no active token locks.</p>
      )}
    </div>
  );
};
