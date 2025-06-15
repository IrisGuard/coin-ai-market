
import React, { useState } from 'react';
import { useLockOptions } from '@/hooks/useLockOptions';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LockingHeader } from './locking/LockingHeader';
import { LockingCard } from './locking/LockingCard';

const cardGradientBorder =
  "relative bg-gradient-to-br from-[#00d4ff]/20 via-white/95 to-[#00ff88]/20 rounded-3xl shadow-xl border-2 border-[#00d4ff]/70 glass-card p-2 animate-fade-in";
const cardInner =
  "rounded-2xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 p-6 flex flex-col gap-3 h-full backdrop-blur-sm shadow-lg";

export const TokenLocking = () => {
  const [inputAmounts, setInputAmounts] = useState<{ [optionId: string]: string }>({});
  const [loadingLockId, setLoadingLockId] = useState<string | null>(null);
  const { data: lockOptions, isLoading, error: lockOptionsError } = useLockOptions();
  const { refetch: refetchUserLocks } = useTokenLocks();
  const { data: user } = useUser();

  const handleLock = async (option: any) => {
    if (!user) {
      toast.error('You must be logged in to lock tokens.');
      return;
    }
    const lockAmount = inputAmounts[option.id];
    if (!lockAmount) {
      toast.error('Please enter an amount.');
      return;
    }
    const amount = parseFloat(lockAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount to lock.');
      return;
    }

    setLoadingLockId(option.id);

    const lockPromise = async () => {
      const lockDate = new Date();
      const unlockDate = new Date(lockDate);
      unlockDate.setMonth(unlockDate.getMonth() + option.duration_months);

      const { error: insertError } = await supabase.from('token_locks').insert({
        user_id: user.id,
        amount: amount,
        duration_months: option.duration_months,
        unlock_date: unlockDate.toISOString(),
        benefit_percentage: option.benefit_percentage,
      });

      if (insertError) {
        throw insertError;
      }
    };

    toast.promise(lockPromise(), {
      loading: 'Processing transaction...',
      success: () => {
        refetchUserLocks();
        setInputAmounts((prev) => ({ ...prev, [option.id]: '' }));
        setLoadingLockId(null);
        return `Successfully locked ${amount} GCAI for ${option.duration_months} months!`;
      },
      error: (err: any) => {
        setLoadingLockId(null);
        console.error('Supabase error:', err);
        return `Error: ${err.message}`;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <LockingHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div className={cardGradientBorder} key={i}>
              <div className={`${cardInner} animate-pulse min-h-[350px]`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lockOptionsError) {
    return (
      <div className="text-center py-10">
        <p className="font-extrabold text-xl bg-gradient-to-r from-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent animate-glow">Error loading staking options.</p>
        <p className="text-sm font-bold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent mt-2">Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <LockingHeader />
      <div
        className="
          flex flex-nowrap gap-6 overflow-x-auto pb-2
          md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-x-visible
        "
      >
        {lockOptions?.map((option: any) => (
          <LockingCard
            key={option.id}
            option={option}
            amount={inputAmounts[option.id] || ''}
            onAmountChange={(value) =>
              setInputAmounts(prev => ({
                ...prev,
                [option.id]: value,
              }))
            }
            onLock={() => handleLock(option)}
            isLoading={loadingLockId === option.id}
            isUserLoggedIn={!!user}
          />
        ))}
      </div>
    </div>
  );
};
