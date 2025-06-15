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

// Gradient border style helper for cards
const cardGradientBorder =
  "relative bg-gradient-to-tr from-blue-50 via-purple-50 to-emerald-50 rounded-2xl shadow-xl p-[1.5px]"; // outer border
const cardInner =
  "rounded-2xl bg-white/80 dark:bg-white/70 p-6 flex flex-col gap-3 h-full backdrop-blur-[2px]"; // inner content
const cardShadow =
  "shadow-[0_2px_8px_rgba(64,116,201,0.08),0_10px_20px_rgba(80,84,236,0.05)]";

export const TokenLocking = () => {
  const [inputAmounts, setInputAmounts] = useState<{ [optionId: string]: string }>({});
  const [loadingLockId, setLoadingLockId] = useState<string | null>(null);
  const { data: lockOptions, isLoading, error: lockOptionsError } = useLockOptions();
  const { refetch: refetchUserLocks } = useTokenLocks();
  const { data: user } = useUser();

  // Λογική Lock (ανά κάρτα)
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
        <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight text-center">
            Lock Tokens, Boost Rewards
        </h2>
        <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto mt-4 mb-8">
            Commit your GCAI tokens for a set period to earn substantial APY bonuses on your holdings and enjoy exclusive platform benefits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div className={`${cardGradientBorder} ${cardShadow}`} key={i}>
              <div className={`${cardInner} animate-pulse min-h-[290px]`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lockOptionsError) {
    return (
      <div className="text-center py-10">
        <p className="font-semibold text-red-600">Error loading locking options.</p>
        <p className="text-sm text-gray-500 mt-2">Could not fetch data from the server. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight text-center mb-1">
          Lock Tokens, Boost Rewards
        </h2>
        <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto mt-4 mb-8">
          Commit your GCAI tokens for a set period to earn substantial APY bonuses on your holdings and enjoy exclusive platform benefits.
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
              className={`${cardGradientBorder} ${cardShadow} min-w-[330px] md:min-w-0 md:w-auto`}
              style={{ minHeight: 325 }}
            >
              {/* Inner soft container for card */}
              <div className={`${cardInner} relative z-10`}>
                {/* Top Branding Badge/Stars */}
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  {option.is_popular && !option.is_maximum && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 shadow-[0_2px_4px_rgba(250,174,53,0.09)]">
                      <Star className="w-3.5 h-3.5 text-orange-400 -ml-1" />
                      Popular
                    </span>
                  )}
                  {option.is_maximum && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-[0_2px_4px_rgba(255,238,45,0.09)]">
                      <ArrowUp className="w-3.5 h-3.5 text-yellow-400 -ml-1" />
                      Max Reward
                    </span>
                  )}
                </div>
                {/* Lock Icon Circle */}
                <div className="flex items-center justify-center mb-4 mt-4">
                  <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary via-electric-purple to-electric-green shadow-lg ring-2 ring-brand-primary/20 w-12 h-12">
                    <Lock className="w-7 h-7 text-white drop-shadow filter" />
                  </span>
                </div>
                {/* Card main values */}
                <h4 className="text-xl font-bold text-brand-primary mb-1 tracking-tight">
                  {option.duration_months} Months
                </h4>
                <div className="mb-2">
                  <span
                    className="
                      text-[2.2rem] font-extrabold block tracking-tight
                      bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green
                      bg-clip-text text-transparent drop-shadow-sm animate-glow
                    "
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    +{option.benefit_percentage}%
                  </span>
                  <p className="text-sm text-text-secondary font-semibold mb-2">
                    Additional Rewards
                  </p>
                </div>
                {/* Amount Input */}
                <div className="flex flex-col gap-2 items-center w-full">
                  <Label
                    htmlFor={`lock-amount-${option.id}`}
                    className="font-semibold text-text-secondary flex items-center gap-2 text-base"
                  >
                    Amount <span className="text-xs text-brand-primary tracking-normal">(GCAI)</span>
                    <TokenIcon size={17} className="ml-0.5" />
                  </Label>
                  <div className="relative w-full max-w-[150px]">
                    <Input
                      id={`lock-amount-${option.id}`}
                      type="number"
                      placeholder="e.g. 1000"
                      value={inputAmounts[option.id] || ''}
                      onChange={e =>
                        setInputAmounts(prev => ({
                          ...prev,
                          [option.id]: e.target.value,
                        }))
                      }
                      className="text-lg font-semibold pr-9 shadow-inner border-2 border-blue-100 focus:border-brand-primary/60 bg-gradient-to-tr from-blue-50/80 via-white/70 to-emerald-50/80 rounded-lg"
                    />
                    <TokenIcon size={19} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {inputAmounts[option.id] && parseFloat(inputAmounts[option.id]) > 0 && (
                    <div className="p-2 bg-green-50 rounded-xl text-center w-full my-1 border border-green-100 flex items-center justify-center gap-2">
                      <span className="block text-xs text-gray-600 mb-0.5">Bonus:</span>
                      <span className="font-bold text-brand-success text-lg flex items-center gap-1">
                        {(parseFloat(inputAmounts[option.id]) * option.benefit_percentage / 100).toFixed(2)}
                        <TokenIcon size={16} className="ml-1" /> GCAI
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={() => handleLock(option)}
                    className={`
                      w-full h-11 text-base font-extrabold mt-2 transition-all rounded-full inline-flex items-center justify-center
                      bg-gradient-to-r from-brand-primary/90 to-brand-success/80
                      hover:from-brand-success/90 hover:to-brand-primary/90
                      text-white shadow-md shadow-brand-primary/20
                      focus:ring-4 focus:ring-electric-blue/30
                      hover:scale-[1.03] active:scale-95
                    `}
                    disabled={
                      !user ||
                      loadingLockId === option.id ||
                      !inputAmounts[option.id] ||
                      parseFloat(inputAmounts[option.id]) <= 0
                    }
                    style={{
                      letterSpacing: "0.015em"
                    }}
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
                        Processing...
                      </span>
                    ) : (
                      <>
                        <TokenIcon size={20} className="mr-2" />
                        Lock Tokens
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-brand-primary text-[15px] mt-4 font-medium opacity-80">
        Θέλω οι κάρτες locking να φαίνονται premium, επαγγελματικές και καλαίσθητες, όχι flat κουτιά. Επίσης, αυτό το στιλ να το συνεχίσουμε και στα επόμενα sections του site ώστε όλη η σελίδα crypto να έχει ενιαία ταυτότητα, υψηλής αισθητικής.
      </div>
    </div>
  );
};
