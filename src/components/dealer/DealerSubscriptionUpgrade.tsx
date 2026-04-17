import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check } from 'lucide-react';

interface DealerSubscriptionUpgradeProps {
  onUpgradeSuccess?: () => void;
}

const PLANS = [
  { id: 'starter', name: 'Starter', price: 29, perks: ['Up to 50 listings', 'Basic AI recognition', 'Email support'] },
  { id: 'pro', name: 'Pro', price: 79, perks: ['Up to 500 listings', 'Advanced AI + grading', 'Priority support', 'Bulk uploads'] },
  { id: 'enterprise', name: 'Enterprise', price: 199, perks: ['Unlimited listings', 'Custom AI integration', 'Dedicated support', 'API access'] },
];

const DealerSubscriptionUpgrade: React.FC<DealerSubscriptionUpgradeProps> = ({ onUpgradeSuccess }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {PLANS.map((plan) => (
        <Card key={plan.id} className="border-border bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Crown className="w-5 h-5 text-primary" />
              {plan.name}
            </CardTitle>
            <div className="text-3xl font-bold text-foreground">
              ${plan.price}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => {
                // TODO: integrate Stripe Checkout in next phase
                onUpgradeSuccess?.();
              }}
            >
              Choose {plan.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DealerSubscriptionUpgrade;
