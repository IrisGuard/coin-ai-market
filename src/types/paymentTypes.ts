
export interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto' | 'bank_transfer';
  name: string;
  icon?: string;
  enabled: boolean;
  fees?: {
    percentage: number;
    fixed: number;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  coinId?: string;
  coinName?: string;
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  subscriptionPlan?: string;
  cryptoCurrency?: string;
  paymentMethodId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  processingTime?: number;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  retryCount?: number;
}

export interface PaymentValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaymentFormData {
  amount: string;
  currency: string;
  paymentMethod: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface TransactionDetails {
  id: string;
  userId?: string;
  coinId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus['status'];
  paymentMethod: string;
  transactionDate: Date;
  sellerName?: string;
  coinName?: string;
  coinImage?: string;
  fees: {
    platform: number;
    payment: number;
    total: number;
  };
  metadata?: Record<string, any>;
}

export interface PaymentHistory {
  transactions: TransactionDetails[];
  totalCount: number;
  totalSpent: number;
  averageTransaction: number;
  mostRecentTransaction?: TransactionDetails;
}

export interface PaymentConfiguration {
  supportedCurrencies: string[];
  supportedCryptos: string[];
  minimumAmount: number;
  maximumAmount: number;
  platformFeePercentage: number;
  retryAttempts: number;
  sessionTimeoutMinutes: number;
}

export type PaymentEventType = 
  | 'payment_initiated'
  | 'payment_processing'
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_cancelled'
  | 'payment_refunded';

export interface PaymentEvent {
  type: PaymentEventType;
  transactionId: string;
  timestamp: Date;
  data: Record<string, any>;
}

export interface PaymentSubscription {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}
