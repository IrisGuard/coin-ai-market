
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import EnhancedTransakPayment from '@/components/payment/EnhancedTransakPayment';

export const BuyTokensSection = () => {
  const [amount, setAmount] = useState('');
  const { data: tokenInfo, isLoading: tokenLoading } = useTokenInfo();
  const queryClient = useQueryClient();

  const isTokenDeployed = !!tokenInfo?.current_price_usd;

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your balance will be updated shortly.');
    queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
    queryClient.invalidateQueries({ queryKey: ['token-activity'] });
    setAmount('');
  };

  return (
    <section className="py-16 px-4 bg-slate-50 border-t border-b">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Buy GCAI Tokens
          </h2>
          <p className="text-xl text-text-secondary">
            {isTokenDeployed
              ? 'Securely purchase GCAI tokens using our integrated payment system.'
              : 'Token purchase will be available when the GCAI token is deployed'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className={!isTokenDeployed && !tokenLoading ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Purchase GCAI Tokens
                {!isTokenDeployed && !tokenLoading && <span className="text-sm text-brand-warning ml-2">(Coming Soon)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tokenLoading ? (
                 <div className="flex items-center justify-center gap-2 h-24">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading payment gateway...</span>
                  </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fiat-amount">Amount (USD)</Label>
                    <Input
                      id="fiat-amount"
                      type="number"
                      placeholder="Enter amount in USD"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-lg"
                      disabled={!isTokenDeployed}
                      min="1"
                    />
                  </div>

                  {isTokenDeployed && parseFloat(amount) > 0 && (
                    <EnhancedTransakPayment
                      orderType="coin_purchase"
                      coinId="GCAI"
                      coinName="GCAI Token"
                      price={parseFloat(amount)}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  )}

                  {isTokenDeployed && (!amount || parseFloat(amount) <= 0) && (
                     <div className="text-center text-text-secondary p-4 bg-gray-50 rounded-lg">
                        Please enter an amount to proceed with your purchase.
                      </div>
                  )}
                  
                  {!isTokenDeployed && (
                    <div className="text-center text-text-secondary p-4 bg-gray-50 rounded-lg">
                      Purchase functionality will be enabled soon.
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {!isTokenDeployed && !tokenLoading && (
          <div className="mt-8 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-center">
            <h3 className="text-xl font-bold text-brand-primary mb-2">Token Launch Coming Soon</h3>
            <p className="text-text-secondary">
              The GCAI token will be deployed and available for purchase once our smart contracts are finalized and audited.
              All platform infrastructure is ready and token functionality will be activated immediately upon deployment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
