
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useTransakPayment } from '@/hooks/useTransakPayment';

interface TransakPaymentButtonProps {
  coinId: string;
  amount: number;
  currency?: string;
  className?: string;
  children?: React.ReactNode;
}

const TransakPaymentButton: React.FC<TransakPaymentButtonProps> = ({
  coinId,
  amount,
  currency = 'USD',
  className,
  children
}) => {
  const { createOrder } = useTransakPayment();

  const handlePayment = () => {
    createOrder.mutate({ coinId, amount, currency });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={createOrder.isPending}
      className={className}
    >
      <CreditCard className="h-4 w-4 mr-2" />
      {children || `Pay $${amount} with Crypto`}
      {createOrder.isPending && ' (Creating order...)'}
    </Button>
  );
};

export default TransakPaymentButton;
