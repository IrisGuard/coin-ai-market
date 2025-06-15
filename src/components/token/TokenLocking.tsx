
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLockOptions } from '@/hooks/useLockOptions';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { Lock, TrendingUp, Star, Crown } from 'lucide-react';
import { toast } from 'sonner';

export const TokenLocking = () => {
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [lockAmount, setLockAmount] = useState('');
  const { data: lockOptions, isLoading } = useLockOptions();
  const { data: userLocks, refetch } = useTokenLocks();

  const handleLock = async () => {
    if (!selectedOption || !lockAmount || parseFloat(lockAmount) <= 0) {
      toast.error('Please select a lock option and enter a valid amount');
      return;
    }

    toast.success(`Locked ${lockAmount} GCAI for ${selectedOption.duration_months} months`);
    setLockAmount('');
    setSelectedOption(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Lock Your Tokens</h3>
        <p className="text-gray-600 mb-6">
          Lock your GCAI tokens to earn additional rewards. Longer lock periods provide higher benefits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {lockOptions?.map((option: any) => (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedOption?.id === option.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              } ${option.is_popular ? 'ring-2 ring-orange-300' : ''}`}
              onClick={() => setSelectedOption(option)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  {option.is_maximum && <Crown className="w-6 h-6 text-yellow-500 mr-2" />}
                  {option.is_popular && <Star className="w-6 h-6 text-orange-500 mr-2" />}
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.duration_months} Months
                </h4>
                
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {option.benefit_percentage}%
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Additional rewards
                </p>
                
                {option.is_popular && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Most Popular
                  </Badge>
                )}
                
                {option.is_maximum && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Maximum Rewards
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedOption && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Lock Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lock-amount">Amount to Lock (GCAI)</Label>
                <Input
                  id="lock-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
                />
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Lock Details:</p>
                <p className="font-medium">Duration: {selectedOption.duration_months} months</p>
                <p className="font-medium">Benefit: {selectedOption.benefit_percentage}% additional rewards</p>
                {lockAmount && (
                  <p className="text-green-600 font-semibold">
                    Total rewards: {(parseFloat(lockAmount) * (1 + selectedOption.benefit_percentage / 100)).toFixed(2)} GCAI
                  </p>
                )}
              </div>
              
              <Button onClick={handleLock} className="w-full">
                Lock Tokens
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {userLocks && userLocks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Locked Tokens</h3>
          <div className="space-y-4">
            {userLocks.map((lock: any) => (
              <Card key={lock.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{lock.amount} GCAI</p>
                      <p className="text-sm text-gray-600">
                        Locked for {lock.duration_months} months • {lock.benefit_percentage}% benefit
                      </p>
                      <p className="text-sm text-gray-500">
                        Unlocks: {new Date(lock.unlock_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={lock.status === 'active' ? 'default' : 'secondary'}>
                      {lock.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
