
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Check, Wallet, CreditCard, Bitcoin, Banknote } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import EnhancedTransakPayment from '@/components/payment/EnhancedTransakPayment';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: {
    id: string;
    name: string;
    price: number;
    image?: string;
    user_id: string;
  };
  dealerStore: {
    name: string;
    solana_wallet_address?: string;
    ethereum_wallet_address?: string;
    bitcoin_wallet_address?: string;
    usdc_wallet_address?: string;
    bank_name?: string;
    iban?: string;
    swift_bic?: string;
  } | null;
  onTraditionalPurchase: () => void;
  onTransakSuccess: () => void;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  coin,
  dealerStore,
  onTraditionalPurchase,
  onTransakSuccess
}: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'crypto' | 'direct'>('traditional');
  const [copiedField, setCopiedField] = useState<string>('');
  const [showTransak, setShowTransak] = useState(false);

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

  const WalletAddressCard = ({ 
    title, 
    address, 
    icon: Icon, 
    currency 
  }: {
    title: string;
    address?: string;
    icon: any;
    currency: string;
  }) => {
    if (!address) return null;

    const isCopied = copiedField === title;

    return (
      <Card className="border-2 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-blue-600" />
            {title}
            <Badge variant="outline">{currency}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs bg-gray-50 p-2 rounded border break-all">
                {address}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyToClipboard(address, title)}
            >
              {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BankingCard = () => {
    if (!dealerStore?.bank_name && !dealerStore?.iban && !dealerStore?.swift_bic) return null;

    return (
      <Card className="border-2 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Banknote className="h-4 w-4 text-green-600" />
            Traditional Banking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dealerStore?.bank_name && (
            <div>
              <span className="text-xs text-gray-600">Bank Name:</span>
              <div className="font-medium">{dealerStore.bank_name}</div>
            </div>
          )}
          
          {dealerStore?.iban && (
            <div>
              <span className="text-xs text-gray-600">IBAN:</span>
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm bg-gray-50 p-2 rounded border flex-1">
                  {dealerStore.iban}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToClipboard(dealerStore.iban!, 'IBAN')}
                >
                  {copiedField === 'IBAN' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
          
          {dealerStore?.swift_bic && (
            <div>
              <span className="text-xs text-gray-600">SWIFT/BIC:</span>
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm bg-gray-50 p-2 rounded border flex-1">
                  {dealerStore.swift_bic}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToClipboard(dealerStore.swift_bic!, 'SWIFT/BIC')}
                >
                  {copiedField === 'SWIFT/BIC' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (showTransak) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pay with Crypto/Card - {coin.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setShowTransak(false)}
              className="w-full"
            >
              ← Back to Payment Options
            </Button>
            <EnhancedTransakPayment
              orderType="coin_purchase"
              coinId={coin.id}
              coinName={coin.name}
              price={coin.price}
              onPaymentSuccess={() => {
                setShowTransak(false);
                onTransakSuccess();
                onClose();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase: {coin.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Coin Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{coin.name}</h3>
                  <p className="text-2xl font-bold text-green-600">${coin.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Sold by</p>
                  <p className="font-medium">{dealerStore?.name || 'Dealer Store'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Payment Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={paymentMethod === 'traditional' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('traditional')}
                className="p-4 h-auto flex-col gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span>Traditional Payment</span>
                <span className="text-xs opacity-70">Internal system</span>
              </Button>

              <Button
                variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('crypto')}
                className="p-4 h-auto flex-col gap-2"
              >
                <Wallet className="h-6 w-6" />
                <span>Crypto/Card Payment</span>
                <span className="text-xs opacity-70">Via Transak</span>
              </Button>

              <Button
                variant={paymentMethod === 'direct' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('direct')}
                className="p-4 h-auto flex-col gap-2"
              >
                <Bitcoin className="h-6 w-6" />
                <span>Direct Transfer</span>
                <span className="text-xs opacity-70">To dealer wallets</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Payment Method Content */}
          {paymentMethod === 'traditional' && (
            <div className="space-y-4">
              <h4 className="font-semibold">Traditional Payment</h4>
              <p className="text-gray-600">Process payment through our secure internal system.</p>
              <Button onClick={onTraditionalPurchase} className="w-full" size="lg">
                Purchase with Traditional Payment
              </Button>
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
              <h4 className="font-semibold">Crypto/Card Payment via Transak</h4>
              <p className="text-gray-600">
                Pay with cryptocurrency or credit/debit card through our secure partner Transak.
              </p>
              <Button onClick={() => setShowTransak(true)} className="w-full" size="lg">
                Continue with Transak Payment
              </Button>
            </div>
          )}

          {paymentMethod === 'direct' && (
            <div className="space-y-4">
              <h4 className="font-semibold">Direct Transfer to Dealer</h4>
              <p className="text-gray-600 mb-4">
                Transfer directly to the dealer's wallet addresses or bank account. 
                <strong> After transfer, contact the dealer to confirm payment.</strong>
              </p>

              {/* Crypto Wallets */}
              <div className="space-y-4">
                <h5 className="font-medium">Cryptocurrency Wallets</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <WalletAddressCard
                    title="Solana Wallet"
                    address={dealerStore?.solana_wallet_address}
                    icon={Wallet}
                    currency="SOL"
                  />
                  <WalletAddressCard
                    title="Ethereum Wallet"
                    address={dealerStore?.ethereum_wallet_address}
                    icon={Wallet}
                    currency="ETH"
                  />
                  <WalletAddressCard
                    title="Bitcoin Wallet"
                    address={dealerStore?.bitcoin_wallet_address}
                    icon={Bitcoin}
                    currency="BTC"
                  />
                  <WalletAddressCard
                    title="USDC Wallet"
                    address={dealerStore?.usdc_wallet_address}
                    icon={Wallet}
                    currency="USDC"
                  />
                </div>
              </div>

              {/* Banking Information */}
              <div className="space-y-4">
                <h5 className="font-medium">Traditional Banking</h5>
                <BankingCard />
              </div>

              {(!dealerStore?.solana_wallet_address && 
                !dealerStore?.ethereum_wallet_address && 
                !dealerStore?.bitcoin_wallet_address && 
                !dealerStore?.usdc_wallet_address &&
                !dealerStore?.bank_name && 
                !dealerStore?.iban) && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <p className="text-yellow-800">
                      The dealer hasn't set up payment addresses yet. Please use one of the other payment methods.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
