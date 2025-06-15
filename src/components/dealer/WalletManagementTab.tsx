
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Bitcoin, Banknote, Save, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletData {
  solana_wallet_address?: string;
  ethereum_wallet_address?: string;
  bitcoin_wallet_address?: string;
  usdc_wallet_address?: string;
  bank_name?: string;
  iban?: string;
  swift_bic?: string;
}

const WalletManagementTab = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [walletData, setWalletData] = useState<WalletData>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch existing wallet data
  const { data: storeData, isLoading } = useQuery({
    queryKey: ['dealer-wallet-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setWalletData({
          solana_wallet_address: data.solana_wallet_address || '',
          ethereum_wallet_address: data.ethereum_wallet_address || '',
          bitcoin_wallet_address: data.bitcoin_wallet_address || '',
          usdc_wallet_address: data.usdc_wallet_address || '',
          bank_name: data.bank_name || '',
          iban: data.iban || '',
          swift_bic: data.swift_bic || ''
        });
      }
    }
  });

  // Update wallet mutation
  const updateWalletMutation = useMutation({
    mutationFn: async (data: WalletData) => {
      const { error } = await supabase
        .from('stores')
        .update(data)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-wallet-data'] });
      toast.success('Wallet information updated successfully');
    },
    onError: (error) => {
      console.error('Wallet update error:', error);
      toast.error('Failed to update wallet information');
    }
  });

  const validateAddress = (address: string, type: string): boolean => {
    if (!address) return true; // Empty is valid
    
    const patterns = {
      bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      iban: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/
    };
    
    return patterns[type as keyof typeof patterns]?.test(address) || false;
  };

  const handleInputChange = (field: keyof WalletData, value: string) => {
    setWalletData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (walletData.bitcoin_wallet_address && !validateAddress(walletData.bitcoin_wallet_address, 'bitcoin')) {
      errors.bitcoin_wallet_address = 'Invalid Bitcoin address format';
    }
    
    if (walletData.ethereum_wallet_address && !validateAddress(walletData.ethereum_wallet_address, 'ethereum')) {
      errors.ethereum_wallet_address = 'Invalid Ethereum address format';
    }
    
    if (walletData.solana_wallet_address && !validateAddress(walletData.solana_wallet_address, 'solana')) {
      errors.solana_wallet_address = 'Invalid Solana address format';
    }
    
    if (walletData.iban && !validateAddress(walletData.iban, 'iban')) {
      errors.iban = 'Invalid IBAN format';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    
    updateWalletMutation.mutate(walletData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            Wallet Management
            <Badge variant="outline">Payment Setup</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Configure your payment methods to receive payments from customers. 
            You can set up cryptocurrency wallets and traditional banking information.
          </p>
        </CardContent>
      </Card>

      {/* Cryptocurrency Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-orange-500" />
            Cryptocurrency Wallets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bitcoin */}
            <div className="space-y-2">
              <Label htmlFor="bitcoin">Bitcoin Wallet Address</Label>
              <Input
                id="bitcoin"
                value={walletData.bitcoin_wallet_address || ''}
                onChange={(e) => handleInputChange('bitcoin_wallet_address', e.target.value)}
                placeholder="Enter Bitcoin address (1... or 3... or bc1...)"
                className={validationErrors.bitcoin_wallet_address ? 'border-red-500' : ''}
              />
              {validationErrors.bitcoin_wallet_address && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.bitcoin_wallet_address}
                </div>
              )}
            </div>

            {/* Ethereum */}
            <div className="space-y-2">
              <Label htmlFor="ethereum">Ethereum Wallet Address</Label>
              <Input
                id="ethereum"
                value={walletData.ethereum_wallet_address || ''}
                onChange={(e) => handleInputChange('ethereum_wallet_address', e.target.value)}
                placeholder="Enter Ethereum address (0x...)"
                className={validationErrors.ethereum_wallet_address ? 'border-red-500' : ''}
              />
              {validationErrors.ethereum_wallet_address && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.ethereum_wallet_address}
                </div>
              )}
            </div>

            {/* Solana */}
            <div className="space-y-2">
              <Label htmlFor="solana">Solana Wallet Address</Label>
              <Input
                id="solana"
                value={walletData.solana_wallet_address || ''}
                onChange={(e) => handleInputChange('solana_wallet_address', e.target.value)}
                placeholder="Enter Solana address"
                className={validationErrors.solana_wallet_address ? 'border-red-500' : ''}
              />
              {validationErrors.solana_wallet_address && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.solana_wallet_address}
                </div>
              )}
            </div>

            {/* USDC */}
            <div className="space-y-2">
              <Label htmlFor="usdc">USDC Wallet Address</Label>
              <Input
                id="usdc"
                value={walletData.usdc_wallet_address || ''}
                onChange={(e) => handleInputChange('usdc_wallet_address', e.target.value)}
                placeholder="Enter USDC address (Ethereum-based)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Traditional Banking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-600" />
            Traditional Banking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={walletData.bank_name || ''}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                placeholder="Enter your bank name"
              />
            </div>

            {/* IBAN */}
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={walletData.iban || ''}
                onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase())}
                placeholder="Enter IBAN (e.g., GB29 NWBK 6016 1331 9268 19)"
                className={validationErrors.iban ? 'border-red-500' : ''}
              />
              {validationErrors.iban && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.iban}
                </div>
              )}
            </div>

            {/* SWIFT/BIC */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="swift_bic">SWIFT/BIC Code</Label>
              <Input
                id="swift_bic"
                value={walletData.swift_bic || ''}
                onChange={(e) => handleInputChange('swift_bic', e.target.value.toUpperCase())}
                placeholder="Enter SWIFT/BIC code (e.g., NWBKGB2L)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updateWalletMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {updateWalletMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Wallet Information
            </>
          )}
        </Button>
      </div>

      {/* Status Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2">Payment Methods Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletData.bitcoin_wallet_address ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Bitcoin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletData.ethereum_wallet_address ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Ethereum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletData.solana_wallet_address ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${walletData.iban ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Banking</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagementTab;
