
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Wallet, CreditCard, Bitcoin, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import EnhancedTransakPayment from '@/components/payment/EnhancedTransakPayment';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import TraditionalPaymentForm from '@/components/payment/TraditionalPaymentForm';

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
  onTransakFailure?: () => void;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  coin,
  dealerStore,
  onTraditionalPurchase,
  onTransakSuccess,
  onTransakFailure
}: CheckoutModalProps) => {
  const [paymentStep, setPaymentStep] = useState<'select' | 'stripe' | 'traditional' | 'crypto' | 'direct'>('select');
  const [copiedField, setCopiedField] = useState<string>('');
  const [showTransak, setShowTransak] = useState(false);

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
      toast.success(`${fieldName} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
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

  const handlePaymentMethodSelect = (method: 'stripe' | 'traditional' | 'crypto' | 'direct') => {
    setPaymentStep(method);
  };

  const handlePaymentSuccess = (transactionId?: string) => {
    onTransakSuccess();
    onClose();
  };

  const handleTransakSuccess = () => {
    onTransakSuccess();
    onClose();
  };

  const handlePaymentError = (error: string) => {
    if (onTransakFailure) {
      onTransakFailure();
    }
  };

  const handleBackToSelection = () => {
    setPaymentStep('select');
    setShowTransak(false);
  };

  if (showTransak || paymentStep === 'crypto') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pay with Crypto/Card - {coin.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToSelection}
              className="w-full"
            >
              ← Back to Payment Options
            </Button>
            <EnhancedTransakPayment
              orderType="coin_purchase"
              coinId={coin.id}
              coinName={coin.name}
              price={coin.price}
              onPaymentSuccess={handleTransakSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render different payment steps
  const renderPaymentContent = () => {
    switch (paymentStep) {
      case 'select':
        return (
          <PaymentMethodSelector 
            coin={coin}
            onMethodSelect={handlePaymentMethodSelect}
          />
        );
      
      case 'stripe':
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToSelection}
              className="w-full"
            >
              ← Back to Payment Options
            </Button>
            <StripePaymentForm
              coin={coin}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        );
      
      case 'traditional':
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToSelection}
              className="w-full"
            >
              ← Back to Payment Options
            </Button>
            <TraditionalPaymentForm
              coin={coin}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        );
      
      case 'direct':
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToSelection}
              className="w-full"
            >
              ← Back to Payment Options
            </Button>
            {/* ... keep existing direct transfer code ... */}
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
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase: {coin.name}</DialogTitle>
        </DialogHeader>

        {renderPaymentContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
