
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Copy, ExternalLink } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';

export const BuyTokensSection = () => {
  const [amount, setAmount] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const { data: tokenInfo } = useTokenInfo();

  const treasuryAddress = tokenInfo?.treasury_address || "7xKXmN9p2hVrQFhB3mE8jL4nC6dY5sW9qX8rT1vU3kF2";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleTransakPurchase = () => {
    // Integration with Transak API
    console.log('Opening Transak widget');
  };

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Buy GCAI Tokens
          </h2>
          <p className="text-xl text-text-secondary">
            Purchase GCAI tokens using USDC, SOL, or bank transfer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transak Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Buy with Card/Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fiat-amount">Amount (USD)</Label>
                  <Input
                    id="fiat-amount"
                    type="number"
                    placeholder="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="p-4 bg-brand-primary/10 rounded-lg">
                  <div className="text-sm text-text-secondary mb-1">You will receive approximately:</div>
                  <div className="text-2xl font-bold text-brand-primary">
                    {amount ? (parseFloat(amount) * (tokenInfo?.usdc_rate || 10)).toLocaleString() : '0'} GCAI
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleTransakPurchase}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Buy with Transak
              </Button>
              
              <div className="text-xs text-text-secondary text-center">
                Powered by Transak • Supports 100+ countries • Bank transfer & card payments
              </div>
            </CardContent>
          </Card>

          {/* Manual Transfer */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Send USDC or SOL to our treasury address:</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={treasuryAddress}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyAddress}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {copySuccess && (
                    <div className="text-sm text-brand-success mt-1">Address copied!</div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-bg-primary rounded-lg">
                    <div className="text-sm font-semibold text-text-primary">Exchange Rates:</div>
                    <div className="text-sm text-text-secondary">
                      1 USDC = {tokenInfo?.usdc_rate || 10} GCAI
                    </div>
                    <div className="text-sm text-text-secondary">
                      1 SOL = {tokenInfo?.sol_rate || 1000} GCAI
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-lg">
                <div className="text-sm text-brand-warning font-semibold mb-1">
                  Important:
                </div>
                <div className="text-xs text-text-secondary">
                  After sending, tokens will be credited to your wallet within 5-10 minutes. 
                  Make sure your wallet is connected.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
