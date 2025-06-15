
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Wallet, Send, Download, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const TokenWallet = () => {
  const { data: walletData, isLoading } = useWalletBalance();

  const handleConnect = () => {
    toast.info('Wallet connection feature coming soon!');
  };

  const handleSend = () => {
    toast.info('Send tokens feature coming soon!');
  };

  const handleReceive = () => {
    toast.info('Receive tokens feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-48 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">GCAI Wallet</h3>
        <p className="text-gray-600">
          Manage your GCAI tokens, view balances, and perform transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-blue-600">
                {walletData?.gcai_balance || 0} GCAI
              </p>
              <p className="text-sm text-gray-500">
                ≈ ${((walletData?.gcai_balance || 0) * 0.1).toFixed(2)} USD
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Locked Balance</p>
              <p className="text-3xl font-bold text-orange-600">
                {walletData?.locked_balance || 0} GCAI
              </p>
              <p className="text-sm text-gray-500">
                <Lock className="w-4 h-4 inline mr-1" />
                Earning rewards
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleConnect} className="flex-1">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Button onClick={handleSend} variant="outline" className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Tokens
            </Button>
            <Button onClick={handleReceive} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Receive Tokens
            </Button>
          </div>

          {walletData?.wallet_address && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Wallet Address:</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                {walletData.wallet_address}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
