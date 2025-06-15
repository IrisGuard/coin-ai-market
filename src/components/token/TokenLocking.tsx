
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLockOptions } from '@/hooks/useLockOptions';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Star, ArrowUp } from 'lucide-react';
import TokenIcon from './TokenIcon';

// Premium gradient border style for ultra-vivid cards
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

  // Premium ultra-vivid gradient for bonus percent box
  const getPercentBoxClass = () =>
    "block mx-auto rounded-full px-6 py-4 mb-4 mt-3 shadow-[0_0_30px_#00d4ff80] " +
    "bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] animate-glow " +
    "text-white text-[2.2rem] font-extrabold tracking-tight border-2 border-white/50 " +
    "shadow-xl transform hover:scale-105 transition-all duration-300";

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center animate-glow drop-shadow">
          Premium Token Staking Platform
        </h2>
        <p className="text-lg font-bold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent text-center max-w-2xl mx-auto animate-glow">
          Lock your GCAI tokens to earn premium rewards and unlock exclusive AI features
        </p>
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
      <div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center mb-2 drop-shadow animate-glow">
          Premium GCAI Token Staking
        </h2>
        <p className="text-lg font-bold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent text-center max-w-2xl mx-auto mt-4 mb-8 animate-glow">
          Lock your GCAI tokens for guaranteed high-yield returns and exclusive access to advanced AI features
        </p>
        <div
          className="
            flex flex-nowrap gap-6 overflow-x-auto pb-2
            md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-x-visible
          "
        >
          {lockOptions?.map((option: any) => (
            <div
              key={option.id}
              className={`${cardGradientBorder} min-w-[330px] md:min-w-0 md:w-auto`}
              style={{ minHeight: 380 }}
            >
              <div className={`${cardInner} relative z-10`}>
                {/* Premium Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  {option.is_popular && !option.is_maximum && (
                    <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold bg-gradient-to-r from-[#ff9500] to-[#ff6b00] text-white shadow-[0_0_15px_#ff950080] animate-glow">
                      <Star className="w-3.5 h-3.5 -ml-1" />
                      Most Popular
                    </span>
                  )}
                  {option.is_maximum && (
                    <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-black shadow-[0_0_15px_#ffd70080] animate-glow">
                      <ArrowUp className="w-3.5 h-3.5 -ml-1" />
                      Maximum APY
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  {/* Premium Lock Icon */}
                  <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] shadow-[0_0_25px_#00d4ff80] ring-4 ring-white/30 w-14 h-14 mt-6 animate-glow">
                    <Lock className="w-8 h-8 text-white drop-shadow-lg" />
                  </span>
                  {/* Duration Title */}
                  <h4 className="text-2xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent mb-1 tracking-tight mt-4 animate-glow">
                    {option.duration_months} Months
                  </h4>
                  {/* Ultra-Vivid Bonus Percent Box */}
                  <span className={getPercentBoxClass()}>
                    +{option.benefit_percentage}%
                  </span>
                  <span className="block text-sm font-extrabold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent mb-4 -mt-2 animate-glow">
                    Annual Percentage Yield
                  </span>
                </div>
                {/* Premium Input Section */}
                <div className="flex flex-col gap-3 items-center w-full">
                  <Label
                    htmlFor={`lock-amount-${option.id}`}
                    className="font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent flex items-center gap-2 text-base animate-glow"
                  >
                    Amount to Lock <span className="text-xs bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">(GCAI)</span>
                    <TokenIcon size={18} className="ml-1" />
                  </Label>
                  <div className="relative w-full max-w-[180px]">
                    <Input
                      id={`lock-amount-${option.id}`}
                      type="number"
                      placeholder="Enter amount"
                      value={inputAmounts[option.id] || ''}
                      onChange={e =>
                        setInputAmounts(prev => ({
                          ...prev,
                          [option.id]: e.target.value,
                        }))
                      }
                      className="
                        text-lg font-extrabold pr-12 py-3 pl-4
                        shadow-lg border-2 border-[#00d4ff]/60 focus:border-[#00d4ff] focus:shadow-[0_0_25px_#00d4ff80]
                        glass-card bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10
                        rounded-xl 
                        transition-all duration-300
                        outline-none
                        animate-glow
                      "
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <TokenIcon size={20} />
                    </span>
                  </div>
                  {inputAmounts[option.id] && parseFloat(inputAmounts[option.id]) > 0 && (
                    <div className="p-3 glass-card bg-gradient-to-r from-[#00ff88]/20 via-white/90 to-[#0070fa]/20 rounded-xl text-center w-full border-2 border-[#00ff88]/60 flex items-center justify-center gap-2 shadow-lg animate-fade-in">
                      <span className="block text-sm font-bold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">Bonus Earned:</span>
                      <span className="font-extrabold text-lg bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent flex items-center gap-1 animate-glow">
                        {(parseFloat(inputAmounts[option.id]) * option.benefit_percentage / 100).toFixed(2)}
                        <TokenIcon size={16} className="ml-1" /> GCAI
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={() => handleLock(option)}
                    className={`
                      w-full h-12 text-base font-extrabold mt-3 transition-all rounded-xl inline-flex items-center justify-center
                      bg-gradient-to-r from-[#00d4ff] via-[#0070fa] to-[#7c3aed]
                      hover:from-[#00ff88] hover:via-[#00d4ff] hover:to-[#0070fa]
                      ${inputAmounts[option.id] ? 'shadow-[0_0_30px_#00d4ff80] scale-105' : 'opacity-80'}
                      text-white shadow-xl
                      focus:ring-4 focus:ring-[#00d4ff]/50
                      hover:scale-110 active:scale-95
                      duration-300 animate-glow
                      border-2 border-white/30
                    `}
                    disabled={
                      !user ||
                      loadingLockId === option.id ||
                      !inputAmounts[option.id] ||
                      parseFloat(inputAmounts[option.id]) <= 0
                    }
                  >
                    {loadingLockId === option.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Processing Transaction...
                      </span>
                    ) : (
                      <>
                        <TokenIcon size={22} className="mr-2" />
                        Lock GCAI Tokens
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
