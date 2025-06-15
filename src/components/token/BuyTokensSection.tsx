
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { toast } from 'sonner';

export const BuyTokensSection = () => {
  const [amount, setAmount] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const { data: tokenInfo, isLoading: tokenLoading } = useTokenInfo();
  const { data: cryptoPrices, isLoading: pricesLoading } = useCryptoPrices();

  const treasuryAddress = tokenInfo?.treasury_address;
  const isTokenDeployed = !!tokenInfo?.current_price_usd;

  const handleCopyAddress = () => {
    if (treasuryAddress) {
      navigator.clipboard.writeText(treasuryAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Treasury address copied to clipboard!');
    } else {
      toast.info('Treasury address will be available when crypto token is deployed.');
    }
  };

  const handleCardPurchase = () => {
    if (isTokenDeployed) {
      toast.info('Card purchase integration will be activated shortly.');
    } else {
      toast.info('Token purchase will be available when crypto token is deployed.');
    }
  };

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Buy GCAI Tokens
          </h2>
          <p className="text-xl text-text-secondary">
            {isTokenDeployed 
              ? "Purchase GCAI tokens using USDC, SOL, or bank transfer"
              : "Token purchase will be available when the GCAI token is deployed"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card/Bank Transfer Purchase */}
          <Card className={!isTokenDeployed ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Buy with Card/Bank Transfer
                {!isTokenDeployed && <span className="text-sm text-brand-warning">(Coming Soon)</span>}
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
                    disabled={!isTokenDeployed}
                  />
                </div>
                
                <div className="p-4 bg-brand-primary/10 rounded-lg">
                  <div className="text-sm text-text-secondary mb-1">You will receive approximately:</div>
                  {tokenLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading rates...</span>
                    </div>
                  ) : isTokenDeployed && tokenInfo?.usdc_rate && amount ? (
                    <div className="text-2xl font-bold text-brand-primary">
                      {(parseFloat(amount) * tokenInfo.usdc_rate).toLocaleString()} GCAI
                    </div>
                  ) : (
                    <div className="text-lg text-text-secondary">
                      Exchange rates will be available when token is deployed
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleCardPurchase}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
                size="lg"
                disabled={!isTokenDeployed}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {isTokenDeployed ? 'Buy with Card' : 'Coming Soon'}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Transfer */}
          <Card className={!isTokenDeployed ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle>
                Manual Transfer
                {!isTokenDeployed && <span className="text-sm text-brand-warning ml-2">(Coming Soon)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Treasury Address:</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={treasuryAddress || "Will be available when token is deployed"}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyAddress}
                      variant="outline"
                      size="sm"
                      disabled={!treasuryAddress}
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
                    <div className="text-sm font-semibold text-text-primary">Current Exchange Rates:</div>
                    {tokenLoading ? (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading rates...
                      </div>
                    ) : isTokenDeployed ? (
                      <>
                        <div className="text-sm text-text-secondary">
                          1 USDC = {tokenInfo?.usdc_rate || 'TBD'} GCAI
                        </div>
                        <div className="text-sm text-text-secondary">
                          1 SOL = {tokenInfo?.sol_rate || 'TBD'} GCAI
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-text-secondary">
                        Exchange rates will be set when token is deployed
                      </div>
                    )}
                    {pricesLoading ? (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading SOL price...
                      </div>
                    ) : cryptoPrices?.solana ? (
                      <div className="text-sm text-text-secondary">
                        SOL Price: ${cryptoPrices.solana.usd.toFixed(2)} USD
                      </div>
                    ) : (
                      <div className="text-sm text-text-secondary">
                        SOL Price: Unable to load
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-lg">
                <div className="text-sm text-brand-warning font-semibold mb-1">
                  {isTokenDeployed ? 'Important:' : 'Coming Soon:'}
                </div>
                <div className="text-xs text-text-secondary">
                  {isTokenDeployed 
                    ? 'Send USDC or SOL to the treasury address above. Tokens will be credited to your connected wallet address.'
                    : 'Manual transfer functionality will be available when the crypto token is deployed. Tokens will be credited to your connected wallet address.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!isTokenDeployed && (
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
