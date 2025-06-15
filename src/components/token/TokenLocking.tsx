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
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-48 bg-gray-200 rounded-lg"></CardContent>
            </Card>
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
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight text-center">
            Lock Tokens, Boost Rewards
        </h2>
        <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto mt-4 mb-8">
            Commit your GCAI tokens for a set period to earn substantial APY bonuses on your holdings and enjoy exclusive platform benefits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lockOptions?.map((option: any) => (
            <Card 
              key={option.id} 
              className={`transition-all duration-300 hover:shadow-xl hover:border-brand-primary/50`}
            >
              <CardContent className="p-6 text-center relative overflow-visible flex flex-col gap-3">
                {option.is_popular && !option.is_maximum && (
                  <Badge className="absolute top-3 right-3 bg-orange-100 text-orange-800 border-orange-300">
                    Popular
                  </Badge>
                )}
                 {option.is_maximum && (
                  <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 border-yellow-300">
                    Max Rewards
                  </Badge>
                )}
                <div className="flex items-center justify-center mb-4 text-brand-primary">
                  <Lock className="w-8 h-8" />
                </div>
                
                <h4 className="text-2xl font-bold text-brand-primary mb-1">
                  {option.duration_months} Months
                </h4>
                
                <p className="text-4xl font-extrabold text-brand-success mb-2">
                  +{option.benefit_percentage}%
                </p>
                
                <p className="text-sm text-text-secondary mb-2">
                  Additional Rewards
                </p>
                <div className="flex flex-col gap-2 items-center">
                  <Label htmlFor={`lock-amount-${option.id}`} className="font-semibold text-text-secondary">Amount (GCAI)</Label>
                  <Input
                    id={`lock-amount-${option.id}`}
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputAmounts[option.id] || ''}
                    onChange={(e) => setInputAmounts(prev => ({
                      ...prev, [option.id]: e.target.value
                    }))}
                    className="text-lg max-w-[130px] mx-auto"
                  />
                  {(inputAmounts[option.id] && parseFloat(inputAmounts[option.id]) > 0) && (
                    <div className="p-2 bg-green-50 rounded-lg text-center w-full my-1">
                      <span className="block text-xs text-gray-600 mb-1">Bonus:</span>
                      <span className="font-bold text-brand-success text-lg">
                        {(parseFloat(inputAmounts[option.id]) * option.benefit_percentage / 100).toFixed(2)} GCAI
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={() => handleLock(option)}
                    className="w-full h-10 text-base font-bold mt-2"
                    disabled={
                      !user ||
                      loadingLockId === option.id ||
                      !inputAmounts[option.id] ||
                      parseFloat(inputAmounts[option.id]) <= 0
                    }
                    isLoading={loadingLockId === option.id}
                  >
                    Lock Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
