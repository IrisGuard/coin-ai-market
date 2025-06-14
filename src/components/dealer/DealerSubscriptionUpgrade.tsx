
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedTransakPayment } from '@/hooks/useEnhancedTransakPayment';
import EnhancedTransakPayment from '@/components/payment/EnhancedTransakPayment';
import { Store, Zap, Shield, Star, TrendingUp, Users, Package } from 'lucide-react';

const DEALER_UPGRADE_PLANS = [
  {
    id: 'dealer_premium',
    name: 'Premium Dealer',
    price: 49,
    currency: 'USD',
    duration_days: 30,
    features: [
      'Enhanced AI Analysis',
      'Priority Listing',
      'Advanced Analytics',
      '1000+ Coin Listings',
      'Premium Badge'
    ],
    popular: false
  },
  {
    id: 'dealer_pro',
    name: 'Professional Dealer',
    price: 99,
    currency: 'USD',
    duration_days: 30,
    features: [
      'All Premium Features',
      'Unlimited Listings',
      'Featured Store Placement',
      'Custom Store Branding',
      'API Access',
      'Bulk Upload Tools'
    ],
    popular: true
  },
  {
    id: 'dealer_enterprise',
    name: 'Enterprise Dealer',
    price: 199,
    currency: 'USD',
    duration_days: 30,
    features: [
      'All Pro Features',
      'White-label Store',
      'Custom Domain',
      'Dedicated Support',
      'Advanced Integrations',
      'Multi-store Management'
    ],
    popular: false
  }
];

interface DealerSubscriptionUpgradeProps {
  currentTier?: string;
  onUpgradeSuccess?: () => void;
}

const DealerSubscriptionUpgrade: React.FC<DealerSubscriptionUpgradeProps> = ({
  currentTier = 'basic',
  onUpgradeSuccess
}) => {
  const { getUserSubscriptions, isLoading } = useEnhancedTransakPayment();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const data = await getUserSubscriptions();
      setSubscriptions(data.filter(sub => sub.plan_name?.startsWith('dealer_')));
    };
    loadSubscriptions();
  }, [getUserSubscriptions]);

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    onUpgradeSuccess?.();
    // Reload subscriptions
    getUserSubscriptions().then(data => 
      setSubscriptions(data.filter(sub => sub.plan_name?.startsWith('dealer_')))
    );
  };

  const selectedPlanData = DEALER_UPGRADE_PLANS.find(p => p.id === selectedPlan);
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  if (showPayment && selectedPlanData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upgrade to {selectedPlanData.name}</h3>
          <Button variant="outline" onClick={() => setShowPayment(false)}>
            Back
          </Button>
        </div>
        
        <EnhancedTransakPayment
          orderType="store_upgrade"
          price={selectedPlanData.price}
          subscriptionPlan={selectedPlanData.id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Store Subscription Plans</h3>
        <Badge variant="secondary">
          <Store className="h-4 w-4 mr-1" />
          Current: {currentTier}
        </Badge>
      </div>

      {/* Current Subscription Status */}
      {activeSubscription && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Active Subscription</h4>
                  <p className="text-sm text-green-700">
                    {activeSubscription.plan_name} - Expires {new Date(activeSubscription.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEALER_UPGRADE_PLANS.map((plan) => {
          const isCurrentPlan = activeSubscription?.plan_name === plan.id;
          const canUpgrade = !isCurrentPlan;

          return (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.id === 'dealer_premium' && <TrendingUp className="h-5 w-5 text-orange-600" />}
                  {plan.id === 'dealer_pro' && <Users className="h-5 w-5 text-blue-600" />}
                  {plan.id === 'dealer_enterprise' && <Package className="h-5 w-5 text-purple-600" />}
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleUpgrade(plan.id)}
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={isLoading || !canUpgrade}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Secure Crypto & Card Payments</h4>
              <p className="text-sm text-blue-700">
                Pay with SOL, USDC, ETH, BTC or your credit card. All transactions are secured by Transak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerSubscriptionUpgrade;
