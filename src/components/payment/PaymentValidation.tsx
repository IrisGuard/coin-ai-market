
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PaymentFormData, PaymentValidationError } from '@/types/paymentTypes';

interface PaymentValidationProps {
  formData: PaymentFormData;
  onValidationChange: (isValid: boolean, errors: PaymentValidationError[]) => void;
  showErrors?: boolean;
}

const PaymentValidation = ({ 
  formData, 
  onValidationChange, 
  showErrors = true 
}: PaymentValidationProps) => {
  const [errors, setErrors] = React.useState<PaymentValidationError[]>([]);
  const [isValid, setIsValid] = React.useState(false);

  const validateAmount = (amount: string): PaymentValidationError | null => {
    const numAmount = parseFloat(amount);
    
    if (!amount || amount.trim() === '') {
      return {
        field: 'amount',
        message: 'Amount is required',
        code: 'AMOUNT_REQUIRED'
      };
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return {
        field: 'amount',
        message: 'Amount must be a positive number',
        code: 'AMOUNT_INVALID'
      };
    }
    
    if (numAmount < 1) {
      return {
        field: 'amount',
        message: 'Minimum amount is $1.00',
        code: 'AMOUNT_TOO_LOW'
      };
    }
    
    if (numAmount > 10000) {
      return {
        field: 'amount',
        message: 'Maximum amount is $10,000.00',
        code: 'AMOUNT_TOO_HIGH'
      };
    }
    
    return null;
  };

  const validateCurrency = (currency: string): PaymentValidationError | null => {
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (!currency || currency.trim() === '') {
      return {
        field: 'currency',
        message: 'Currency is required',
        code: 'CURRENCY_REQUIRED'
      };
    }
    
    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      return {
        field: 'currency',
        message: 'Currency not supported',
        code: 'CURRENCY_UNSUPPORTED'
      };
    }
    
    return null;
  };

  const validatePaymentMethod = (paymentMethod: string): PaymentValidationError | null => {
    if (!paymentMethod || paymentMethod.trim() === '') {
      return {
        field: 'paymentMethod',
        message: 'Payment method is required',
        code: 'PAYMENT_METHOD_REQUIRED'
      };
    }
    
    return null;
  };

  const validateBillingAddress = (billingAddress?: PaymentFormData['billingAddress']): PaymentValidationError[] => {
    const errors: PaymentValidationError[] = [];
    
    if (!billingAddress) return errors;
    
    if (!billingAddress.street || billingAddress.street.trim() === '') {
      errors.push({
        field: 'billingAddress.street',
        message: 'Street address is required',
        code: 'STREET_REQUIRED'
      });
    }
    
    if (!billingAddress.city || billingAddress.city.trim() === '') {
      errors.push({
        field: 'billingAddress.city',
        message: 'City is required',
        code: 'CITY_REQUIRED'
      });
    }
    
    if (!billingAddress.zipCode || billingAddress.zipCode.trim() === '') {
      errors.push({
        field: 'billingAddress.zipCode',
        message: 'ZIP code is required',
        code: 'ZIP_REQUIRED'
      });
    }
    
    if (!billingAddress.country || billingAddress.country.trim() === '') {
      errors.push({
        field: 'billingAddress.country',
        message: 'Country is required',
        code: 'COUNTRY_REQUIRED'
      });
    }
    
    return errors;
  };

  const validateCustomerInfo = (customerInfo?: PaymentFormData['customerInfo']): PaymentValidationError[] => {
    const errors: PaymentValidationError[] = [];
    
    if (!customerInfo) return errors;
    
    if (!customerInfo.name || customerInfo.name.trim() === '') {
      errors.push({
        field: 'customerInfo.name',
        message: 'Name is required',
        code: 'NAME_REQUIRED'
      });
    }
    
    if (!customerInfo.email || customerInfo.email.trim() === '') {
      errors.push({
        field: 'customerInfo.email',
        message: 'Email is required',
        code: 'EMAIL_REQUIRED'
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push({
        field: 'customerInfo.email',
        message: 'Please enter a valid email address',
        code: 'EMAIL_INVALID'
      });
    }
    
    return errors;
  };

  React.useEffect(() => {
    const validationErrors: PaymentValidationError[] = [];
    
    // Validate required fields
    const amountError = validateAmount(formData.amount);
    if (amountError) validationErrors.push(amountError);
    
    const currencyError = validateCurrency(formData.currency);
    if (currencyError) validationErrors.push(currencyError);
    
    const paymentMethodError = validatePaymentMethod(formData.paymentMethod);
    if (paymentMethodError) validationErrors.push(paymentMethodError);
    
    // Validate optional fields if provided
    const billingErrors = validateBillingAddress(formData.billingAddress);
    validationErrors.push(...billingErrors);
    
    const customerErrors = validateCustomerInfo(formData.customerInfo);
    validationErrors.push(...customerErrors);
    
    const formIsValid = validationErrors.length === 0;
    
    setErrors(validationErrors);
    setIsValid(formIsValid);
    onValidationChange(formIsValid, validationErrors);
  }, [formData, onValidationChange]);

  const getValidationStatus = () => {
    if (errors.length === 0) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'Payment details are valid'
      };
    } else if (errors.some(e => ['AMOUNT_REQUIRED', 'CURRENCY_REQUIRED', 'PAYMENT_METHOD_REQUIRED'].includes(e.code))) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Required fields missing'
      };
    } else {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        message: 'Some fields need attention'
      };
    }
  };

  if (!showErrors && errors.length === 0) {
    return null;
  }

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-3">
      {/* Validation Status */}
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
        <StatusIcon className={`h-5 w-5 ${status.color}`} />
        <span className={`text-sm font-medium ${status.color}`}>
          {status.message}
        </span>
        <Badge variant={isValid ? "default" : "destructive"} className="ml-auto">
          {isValid ? 'Valid' : `${errors.length} Error${errors.length !== 1 ? 's' : ''}`}
        </Badge>
      </div>

      {/* Error Details */}
      {showErrors && errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <Alert key={index} variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>{error.field}:</strong> {error.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Validation Summary */}
      {errors.length === 0 && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          All payment details are valid and ready for processing
        </div>
      )}
    </div>
  );
};

export default PaymentValidation;
