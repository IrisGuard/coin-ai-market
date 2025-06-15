
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { 
  Lock, 
  TrendingUp, 
  Gift, 
  Calendar, 
  Percent, 
  Coins 
} from 'lucide-react';

export const TokenInfoCards = () => {
  const { data: tokenLocks } = useTokenLocks();
  const { data: tokenInfo } = useTokenInfo();

  const totalLocked = tokenLocks?.reduce((sum, lock) => sum + (Number(lock?.amount) || 0), 0) || 0;
  const estimatedAPY = 25; // This should come from Supabase
  const nextUnlockDate = "March 2025"; // This should be calculated from Supabase
  
  const cards = [
    {
      title: 'Stake',
      value: tokenInfo ? 'Available' : 'Coming Soon',
      icon: Lock,
      color: 'text-brand-primary'
    },
    {
      title: 'Lock & Earn',
      value: tokenInfo ? 'Active' : 'Coming Soon',
      icon: TrendingUp,
      color: 'text-brand-success'
    },
    {
      title: 'Claim Rewards',
      value: tokenInfo ? '0 GCAI' : 'Not Available',
      icon: Gift,
      color: 'text-brand-warning'
    },
    {
      title: 'Unlock Schedule',
      value: nextUnlockDate,
      icon: Calendar,
      color: 'text-brand-secondary'
    },
    {
      title: 'Estimated APY',
      value: `${estimatedAPY}%`,
      icon: Percent,
      color: 'text-brand-success'
    },
    {
      title: 'GCAI Locked',
      value: `${totalLocked.toLocaleString()} GCAI`,
      icon: Coins,
      color: 'text-brand-primary'
    }
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <card.icon className={`w-8 h-8 mx-auto ${card.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {card.title}
                </h3>
                <div className="text-xl font-bold text-text-primary">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
