
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedTransakPayment } from '@/hooks/useEnhancedTransakPayment';
import EnhancedTransakPayment from '@/components/payment/EnhancedTransakPayment';
import { Crown, Zap, Shield, Star, Plus } from 'lucide-react';

const ADMIN_SUBSCRIPTION_PLANS = [
  {
    id: 'admin_pro',
    name: 'Admin Pro',
    price: 99,
    currency: 'USD',
    duration_days: 30,
    features: [
      'Advanced Analytics Dashboard',
      'Premium AI Features',
      'Priority Support',
      'Extended API Access',
      'Custom Reporting'
    ],
    popular: false
  },
  {
    id: 'admin_enterprise',
    name: 'Admin Enterprise',
    price: 299,
    currency: 'USD',
    duration_days: 30,
    features: [
      'All Pro Features',
      'White-label Solution',
      'Custom Integrations',
      'Dedicated Account Manager',
      'SLA Guarantee',
      'Advanced Security'
    ],
    popular: true
  }
];

const AdminSubscriptionManager = () => {
  const { getUserSubscriptions, isLoading } = useEnhancedTransakPayment();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const data = await getUserSubscriptions();
      setSubscriptions(data);
    };
    loadSubscriptions();
  }, [getUserSubscriptions]);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    // Reload subscriptions
    getUserSubscriptions().then(setSubscriptions);
  };

  const selectedPlanData = ADMIN_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);

  if (showPayment && selectedPlanData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subscribe to {selectedPlanData.name}</h3>
          <Button variant="outline" onClick={() => setShowPayment(false)}>
            Back
          </Button>
        </div>
        
        <EnhancedTransakPayment
          orderType="subscription"
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
        <h3 className="text-lg font-semibold">Admin Subscription Management</h3>
        <Badge variant="secondary">
          <Crown className="h-4 w-4 mr-1" />
          Premium Features
        </Badge>
      </div>

      {/* Current Subscriptions */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sub.plan_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(sub.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                    {sub.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ADMIN_SUBSCRIPTION_PLANS.map((plan) => (
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
                <Crown className="h-5 w-5 text-yellow-600" />
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
                onClick={() => handleSubscribe(plan.id)}
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Secure Payments</h4>
              <p className="text-sm text-blue-700">
                All payments are processed securely through Transak with crypto and card support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptionManager;
