
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, TrendingUp, Gift } from 'lucide-react';
import { useLockOptions } from '@/hooks/useLockOptions';
import { toast } from 'sonner';

export const TokenLockingSection = () => {
  const { data: lockOptions, isLoading } = useLockOptions();

  const handleLockTokens = (duration: number) => {
    toast.info(`Token locking for ${duration} months will be available when crypto token is deployed.`);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Loading Lock Options...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Lock GCAI Tokens - Earn Platform Shares
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Lock tokens to receive platform ownership shares and earn passive income from revenue distribution
          </p>
        </div>

        {lockOptions && lockOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockOptions.map((option) => (
              <Card 
                key={option.id} 
                className="relative overflow-hidden border-2 hover:border-brand-primary transition-all duration-300 hover:shadow-xl"
              >
                {option.is_popular && (
                  <Badge className="absolute top-4 right-4 bg-brand-warning text-white">
                    POPULAR
                  </Badge>
                )}
                {option.is_maximum && (
                  <Badge className="absolute top-4 right-4 bg-brand-danger text-white">
                    MAXIMUM
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-text-primary">
                    {option.duration_months} Months
                  </CardTitle>
                  <div className="text-3xl font-bold text-brand-primary">
                    +{option.benefit_percentage}%
                  </div>
                  <div className="text-text-secondary">Bonus Rewards</div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <TrendingUp className="w-4 h-4 text-brand-success" />
                      Platform ownership shares
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Gift className="w-4 h-4 text-brand-warning" />
                      Passive income distribution
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Lock className="w-4 h-4 text-brand-primary" />
                      Early unlock penalty protection
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleLockTokens(option.duration_months)}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white font-semibold"
                    size="lg"
                  >
                    Lock Tokens
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Lock Options Loading
            </h3>
            <p className="text-text-secondary">
              Token locking options will be available when the crypto token is deployed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
