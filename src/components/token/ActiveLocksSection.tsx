
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Unlock } from 'lucide-react';
import { useTokenLocks } from '@/hooks/useTokenLocks';

export const ActiveLocksSection = () => {
  const { data: tokenLocks } = useTokenLocks();

  const calculateProgress = (lockDate: string, unlockDate: string) => {
    const start = new Date(lockDate).getTime();
    const end = new Date(unlockDate).getTime();
    const now = Date.now();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatTimeRemaining = (unlockDate: string) => {
    const now = Date.now();
    const unlock = new Date(unlockDate).getTime();
    const diff = unlock - now;
    
    if (diff <= 0) return "Unlocked";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Your Active Locks
          </h2>
          <p className="text-xl text-text-secondary">
            Track your locked tokens and unlock dates
          </p>
        </div>

        {tokenLocks && tokenLocks.length > 0 ? (
          <div className="space-y-4">
            {tokenLocks.map((lock) => (
              <Card key={lock.id} className="border-l-4 border-l-brand-primary">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="font-semibold text-text-primary">
                        {lock.amount?.toLocaleString()} GCAI
                      </div>
                      <div className="text-sm text-text-secondary">Amount</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-text-primary">
                        {lock.duration_months} months
                      </div>
                      <div className="text-sm text-text-secondary">Duration</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-text-primary">
                        {new Date(lock.lock_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-text-secondary">Lock Date</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-text-primary">
                        {new Date(lock.unlock_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-text-secondary">Unlock Date</div>
                      <div className="text-xs text-brand-warning mt-1">
                        {formatTimeRemaining(lock.unlock_date)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={calculateProgress(lock.lock_date, lock.unlock_date)} 
                        className="h-2"
                      />
                      <Button 
                        size="sm" 
                        variant={lock.status === 'active' ? 'outline' : 'default'}
                        className="w-full"
                        disabled={lock.status === 'active'}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        {lock.status === 'active' ? 'Locked' : 'Unlock'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Active Locks
              </h3>
              <p className="text-text-secondary">
                Lock your GCAI tokens above to start earning platform shares and passive income.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
