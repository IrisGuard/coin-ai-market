
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, TrendingUp, Gift } from 'lucide-react';
import { useLockOptions } from '@/hooks/useLockOptions';

export const TokenLockingSection = () => {
  const { data: lockOptions } = useLockOptions();

  const handleLockTokens = (duration: number) => {
    console.log(`Locking tokens for ${duration} months`);
  };

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Lock GCAI Tokens - Earn Platform Shares
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Κλείδωσε tokens = Παίρνεις μετοχές πλατφόρμας + Passive income
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockOptions?.map((option) => (
            <Card 
              key={option.id} 
              className="relative overflow-hidden border-2 hover:border-brand-primary transition-all duration-300 hover:shadow-xl"
            >
              {option.display_order === 2 && (
                <Badge className="absolute top-4 right-4 bg-brand-warning text-white">
                  POPULAR
                </Badge>
              )}
              {option.display_order === 5 && (
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
      </div>
    </section>
  );
};
