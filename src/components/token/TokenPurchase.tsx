
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { DollarSign, Coins } from 'lucide-react';
import { toast } from 'sonner';

export const TokenPurchase = () => {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const { data: tokenInfo } = useTokenInfo();

  const calculateGCAI = (amount: string, rate: number) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;
    return numAmount * rate;
  };

  const handlePurchaseWithUSDC = () => {
    const gcaiAmount = calculateGCAI(usdcAmount, tokenInfo?.usdc_rate || 10);
    toast.success(`Purchase initiated: ${gcaiAmount.toLocaleString()} GCAI for ${usdcAmount} USDC`);
  };

  const handlePurchaseWithSOL = () => {
    const gcaiAmount = calculateGCAI(solAmount, tokenInfo?.sol_rate || 1000);
    toast.success(`Purchase initiated: ${gcaiAmount.toLocaleString()} GCAI for ${solAmount} SOL`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Purchase with USDC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="usdc-amount">USDC Amount</Label>
            <Input
              id="usdc-amount"
              type="number"
              placeholder="Enter USDC amount"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
            />
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">You will receive:</p>
            <p className="text-2xl font-bold text-blue-600">
              {calculateGCAI(usdcAmount, tokenInfo?.usdc_rate || 10).toLocaleString()} GCAI
            </p>
            <p className="text-sm text-gray-500">
              Rate: 1 USDC = {tokenInfo?.usdc_rate || 10} GCAI
            </p>
          </div>
          
          <Button 
            onClick={handlePurchaseWithUSDC}
            className="w-full"
            disabled={!usdcAmount || parseFloat(usdcAmount) <= 0}
          >
            Purchase with USDC
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Purchase with SOL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sol-amount">SOL Amount</Label>
            <Input
              id="sol-amount"
              type="number"
              placeholder="Enter SOL amount"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
            />
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">You will receive:</p>
            <p className="text-2xl font-bold text-purple-600">
              {calculateGCAI(solAmount, tokenInfo?.sol_rate || 1000).toLocaleString()} GCAI
            </p>
            <p className="text-sm text-gray-500">
              Rate: 1 SOL = {tokenInfo?.sol_rate || 1000} GCAI
            </p>
          </div>
          
          <Button 
            onClick={handlePurchaseWithSOL}
            className="w-full"
            disabled={!solAmount || parseFloat(solAmount) <= 0}
          >
            Purchase with SOL
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
