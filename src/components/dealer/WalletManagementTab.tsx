
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Bitcoin, Shield, CreditCard, Bank, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/securityUtils';

interface WalletFormData {
  solana_wallet_address: string;
  ethereum_wallet_address: string;
  bitcoin_wallet_address: string;
  usdc_wallet_address: string;
  bank_name: string;
  iban: string;
  swift_bic: string;
}

const WalletManagementTab = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showWallets, setShowWallets] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string>('');

  // Fetch dealer store with wallet information
  const { data: dealerStore, isLoading } = useQuery({
    queryKey: ['dealer-store-wallets', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching dealer store:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Update wallet information
  const updateWalletsMutation = useMutation({
    mutationFn: async (walletData: Partial<WalletFormData>) => {
      if (!user?.id || !dealerStore?.id) {
        throw new Error('User or store not found');
      }

      // Sanitize all input data
      const sanitizedData = Object.fromEntries(
        Object.entries(walletData).map(([key, value]) => [
          key,
          typeof value === 'string' ? SecurityUtils.sanitizeText(value) : value
        ])
      );

      const { data, error } = await supabase
        .from('stores')
        .update(sanitizedData)
        .eq('id', dealerStore.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-store-wallets'] });
      toast({
        title: "Success",
        description: "Wallet information updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update wallet information',
        variant: "destructive",
      });
    },
  });

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
      toast({
        title: "Copied",
        description: `${fieldName} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const toggleWalletVisibility = (fieldName: string) => {
    setShowWallets(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const WalletField = ({ 
    label, 
    value, 
    fieldName, 
    icon: Icon, 
    placeholder,
    onUpdate 
  }: {
    label: string;
    value: string;
    fieldName: keyof WalletFormData;
    icon: any;
    placeholder: string;
    onUpdate: (value: string) => void;
  }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [isEditing, setIsEditing] = useState(false);
    const isVisible = showWallets[fieldName];
    const isCopied = copiedField === fieldName;

    const handleSave = () => {
      onUpdate(localValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setLocalValue(value || '');
      setIsEditing(false);
    };

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5 text-blue-600" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  {value ? (
                    <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
                      {isVisible ? value : '•'.repeat(Math.min(value.length, 20))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic p-2">
                      Not set
                    </div>
                  )}
                </div>
                {value && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWalletVisibility(fieldName)}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(value, label)}
                    >
                      {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </>
                )}
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {value ? 'Edit' : 'Add'} {label}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dealerStore) {
    return (
      <Alert>
        <AlertDescription>
          No store found. Please create a store first to manage wallet information.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            My Wallets & Banking
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your payment receiving addresses and banking information
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Secure & Private
        </Badge>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your wallet addresses and banking information are encrypted and only visible to you. 
          Never share your private keys or banking credentials with anyone.
        </AlertDescription>
      </Alert>

      {/* Crypto Wallets Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-orange-500" />
          Cryptocurrency Wallets
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletField
            label="Solana Wallet"
            value={dealerStore.solana_wallet_address || ''}
            fieldName="solana_wallet_address"
            icon={Wallet}
            placeholder="Enter your Solana wallet address"
            onUpdate={(value) => updateWalletsMutation.mutate({ solana_wallet_address: value })}
          />
          <WalletField
            label="Ethereum Wallet"
            value={dealerStore.ethereum_wallet_address || ''}
            fieldName="ethereum_wallet_address"
            icon={Wallet}
            placeholder="Enter your Ethereum wallet address"
            onUpdate={(value) => updateWalletsMutation.mutate({ ethereum_wallet_address: value })}
          />
          <WalletField
            label="Bitcoin Wallet"
            value={dealerStore.bitcoin_wallet_address || ''}
            fieldName="bitcoin_wallet_address"
            icon={Bitcoin}
            placeholder="Enter your Bitcoin wallet address"
            onUpdate={(value) => updateWalletsMutation.mutate({ bitcoin_wallet_address: value })}
          />
          <WalletField
            label="USDC Wallet"
            value={dealerStore.usdc_wallet_address || ''}
            fieldName="usdc_wallet_address"
            icon={Wallet}
            placeholder="Enter your USDC wallet address"
            onUpdate={(value) => updateWalletsMutation.mutate({ usdc_wallet_address: value })}
          />
        </div>
      </div>

      {/* Banking Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bank className="h-5 w-5 text-green-600" />
          Traditional Banking
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletField
            label="Bank Name"
            value={dealerStore.bank_name || ''}
            fieldName="bank_name"
            icon={Bank}
            placeholder="Enter your bank name"
            onUpdate={(value) => updateWalletsMutation.mutate({ bank_name: value })}
          />
          <WalletField
            label="IBAN"
            value={dealerStore.iban || ''}
            fieldName="iban"
            icon={CreditCard}
            placeholder="Enter your IBAN"
            onUpdate={(value) => updateWalletsMutation.mutate({ iban: value })}
          />
          <div className="lg:col-span-2">
            <WalletField
              label="SWIFT/BIC Code"
              value={dealerStore.swift_bic || ''}
              fieldName="swift_bic"
              icon={CreditCard}
              placeholder="Enter your SWIFT/BIC code"
              onUpdate={(value) => updateWalletsMutation.mutate({ swift_bic: value })}
            />
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Tips
          </h4>
          <div className="space-y-2 text-blue-800 text-sm">
            <div>• Double-check all wallet addresses before saving - crypto transactions are irreversible</div>
            <div>• Use only wallets you control and have the private keys for</div>
            <div>• For banking information, ensure accuracy to avoid failed transfers</div>
            <div>• Your information is encrypted and only visible to you</div>
            <div>• Never share your private keys or seed phrases with anyone</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagementTab;
