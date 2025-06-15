
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { Wallet, Send, Download, Lock, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const TokenWallet = () => {
  const { data: walletData, isLoading } = useWalletBalance();
  const { connected, publicKey, connecting, connect, disconnect, isAvailable } = useSolanaWallet();

  const handleConnect = async () => {
    if (!isAvailable) {
      toast.error('Please install Phantom or Solflare wallet to continue.');
      window.open('https://phantom.app/', '_blank');
      return;
    }
    
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected.');
    } catch (error) {
      toast.error('Failed to disconnect wallet.');
    }
  };

  const handleSend = () => {
    if (!connected) {
      toast.info('Please connect your wallet first.');
      return;
    }
    toast.info('Send tokens feature will be available when GCAI token is deployed.');
  };

  const handleReceive = () => {
    if (!connected) {
      toast.info('Please connect your wallet first.');
      return;
    }
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success('Wallet address copied to clipboard!');
    }
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
          Connect your Solana wallet to manage GCAI tokens and view balances.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!connected ? (
            <div className="text-center py-8">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Your Solana Wallet
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your Phantom or Solflare wallet to access GCAI token features.
              </p>
              <Button 
                onClick={handleConnect}
                disabled={connecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
              
              {!isAvailable && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    No Solana wallet detected. 
                    <a 
                      href="https://phantom.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Install Phantom <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
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
                <Button onClick={handleSend} variant="outline" className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Tokens
                </Button>
                <Button onClick={handleReceive} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Copy Address
                </Button>
                <Button onClick={handleDisconnect} variant="outline" className="flex-1">
                  <Wallet className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>

              {publicKey && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Connected Wallet:</p>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {publicKey}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
