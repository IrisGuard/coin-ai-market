
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { toast } from 'sonner';

export const BuyTokensSection = () => {
  const [amount, setAmount] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const { data: tokenInfo, isLoading: tokenLoading } = useTokenInfo();

  // Fetch real SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        setSolPrice(data.solana?.usd || null);
      } catch (error) {
        console.error('Failed to fetch SOL price:', error);
        setSolPrice(null);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const treasuryAddress = tokenInfo?.treasury_address || "Treasury address will be available when token is deployed";

  const handleCopyAddress = () => {
    if (tokenInfo?.treasury_address) {
      navigator.clipboard.writeText(tokenInfo.treasury_address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Treasury address copied to clipboard!');
    } else {
      toast.info('Treasury address will be available when crypto token is deployed.');
    }
  };

  const handleTransakPurchase = () => {
    toast.info('Transak integration will be activated when crypto token is deployed.');
  };

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Buy GCAI Tokens
          </h2>
          <p className="text-xl text-text-secondary">
            Purchase GCAI tokens using USDC, SOL, or bank transfer through Transak
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
                  {tokenLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading rates...</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-brand-primary">
                      {amount ? (parseFloat(amount) * (tokenInfo?.usdc_rate || 10)).toLocaleString() : '0'} GCAI
                    </div>
                  )}
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
                  <Label>Treasury Address (Available when token is deployed):</Label>
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
                      disabled={!tokenInfo?.treasury_address}
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
                    ) : (
                      <>
                        <div className="text-sm text-text-secondary">
                          1 USDC = {tokenInfo?.usdc_rate || 10} GCAI
                        </div>
                        <div className="text-sm text-text-secondary">
                          1 SOL = {tokenInfo?.sol_rate || 1000} GCAI
                        </div>
                      </>
                    )}
                    {loadingPrice ? (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading SOL price...
                      </div>
                    ) : solPrice ? (
                      <div className="text-sm text-text-secondary">
                        SOL Price: ${solPrice.toFixed(2)} USD
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
                  Important:
                </div>
                <div className="text-xs text-text-secondary">
                  Manual transfer functionality will be available when the crypto token is deployed. 
                  Tokens will be credited to your connected wallet address.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
