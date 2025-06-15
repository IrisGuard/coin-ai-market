
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
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [lockAmount, setLockAmount] = useState('');
  const { data: lockOptions, isLoading, error: lockOptionsError } = useLockOptions();
  const { refetch: refetchUserLocks } = useTokenLocks();
  const { data: user } = useUser();

  const handleLock = async () => {
    if (!user) {
      toast.error('You must be logged in to lock tokens.');
      return;
    }
    if (!selectedOption) {
      toast.error('Please select a locking period.');
      return;
    }
    const amount = parseFloat(lockAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount to lock.');
      return;
    }
    
    // In a real scenario, we would check the user's wallet balance first.
    // e.g. const { data: balance } = useWalletBalance();
    // if (amount > balance.gcai) { toast.error("Insufficient GCAI balance."); return; }

    const lockPromise = async () => {
      const lockDate = new Date();
      const unlockDate = new Date(lockDate);
      unlockDate.setMonth(unlockDate.getMonth() + selectedOption.duration_months);

      // The insert object is now aligned with the table schema based on the typescript error.
      // It no longer uses 'lock_option_id'.
      const { error: insertError } = await supabase.from('token_locks').insert({
        user_id: user.id,
        amount: amount,
        duration_months: selectedOption.duration_months,
        unlock_date: unlockDate.toISOString(),
        benefit_percentage: selectedOption.benefit_percentage,
      });

      if (insertError) {
        // Throwing the error will make the toast show the error message.
        throw insertError;
      }
    };

    toast.promise(lockPromise(), {
      loading: 'Processing transaction...',
      success: () => {
        refetchUserLocks();
        setLockAmount('');
        setSelectedOption(null);
        return `Successfully locked ${amount} GCAI for ${selectedOption.duration_months} months!`;
      },
      error: (err: any) => {
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
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-brand-primary/50
                ${ selectedOption?.id === option.id 
                    ? 'ring-2 ring-brand-primary shadow-2xl bg-brand-primary/5' 
                    : 'border-gray-200/80'
                }
              `}
              onClick={() => setSelectedOption(option)}
            >
              <CardContent className="p-6 text-center relative overflow-hidden">
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
                
                <p className="text-sm text-text-secondary">
                  Additional Rewards
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="max-w-lg mx-auto shadow-md border-gray-200/80">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold text-brand-primary">
              {selectedOption ? `Confirm Lock for ${selectedOption.duration_months} Months` : 'Select a Lock Period'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lock-amount" className="font-semibold text-text-secondary">Amount to Lock (GCAI)</Label>
              <Input
                id="lock-amount"
                type="number"
                placeholder="e.g. 1000"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
                disabled={!selectedOption}
                className="text-lg"
              />
            </div>
            
            {selectedOption && lockAmount && parseFloat(lockAmount) > 0 && (
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">You will receive an additional bonus of:</p>
                <p className="text-2xl font-bold text-brand-success">
                  {(parseFloat(lockAmount) * selectedOption.benefit_percentage / 100).toFixed(2)} GCAI
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleLock} 
              className="w-full h-12 text-lg font-bold" 
              disabled={!selectedOption || !lockAmount || parseFloat(lockAmount) <= 0 || !user}
            >
              Lock Tokens Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
