
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Print, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    transak_order_id?: string;
  };
  coin?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

const TransactionReceiptModal = ({
  isOpen,
  onClose,
  transaction,
  coin
}: TransactionReceiptModalProps) => {
  const receiptData = {
    receiptNumber: `RCP-${transaction.id.slice(0, 8).toUpperCase()}`,
    date: new Date(transaction.created_at).toLocaleDateString(),
    time: new Date(transaction.created_at).toLocaleTimeString(),
    transactionId: transaction.id,
    transakOrderId: transaction.transak_order_id
  };

  const downloadReceipt = () => {
    const receiptContent = generateReceiptHTML();
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.receiptNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully');
  };

  const printReceipt = () => {
    const receiptContent = generateReceiptHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const emailReceipt = () => {
    const subject = `Receipt for ${coin?.name || 'Coin Purchase'} - ${receiptData.receiptNumber}`;
    const body = `Please find attached your receipt for the purchase of ${coin?.name || 'coin'}.

Receipt Number: ${receiptData.receiptNumber}
Transaction ID: ${transaction.id}
Amount: $${transaction.amount.toFixed(2)} ${transaction.currency}
Date: ${receiptData.date} ${receiptData.time}

Thank you for your purchase with CoinVision!`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const generateReceiptHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>CoinVision Receipt - ${receiptData.receiptNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .receipt-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .item-details { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .total { font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #333; padding-top: 10px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 0; }
        .label { font-weight: bold; width: 40%; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CoinVision</div>
        <p>Premium Coin Marketplace</p>
        <h2>RECEIPT</h2>
    </div>
    
    <div class="receipt-info">
        <table>
            <tr><td class="label">Receipt Number:</td><td>${receiptData.receiptNumber}</td></tr>
            <tr><td class="label">Date:</td><td>${receiptData.date}</td></tr>
            <tr><td class="label">Time:</td><td>${receiptData.time}</td></tr>
            <tr><td class="label">Transaction ID:</td><td style="font-family: monospace; font-size: 12px;">${transaction.id}</td></tr>
            ${transaction.transak_order_id ? `<tr><td class="label">Transak Order ID:</td><td style="font-family: monospace; font-size: 12px;">${transaction.transak_order_id}</td></tr>` : ''}
        </table>
    </div>
    
    ${coin ? `
    <div class="item-details">
        <h3>Item Purchased</h3>
        <table>
            <tr><td class="label">Coin Name:</td><td>${coin.name}</td></tr>
            <tr><td class="label">Item ID:</td><td style="font-family: monospace; font-size: 12px;">${coin.id}</td></tr>
            <tr><td class="label">Price:</td><td>$${coin.price.toFixed(2)}</td></tr>
        </table>
    </div>
    ` : ''}
    
    <div class="total">
        <table>
            <tr><td>Subtotal:</td><td>$${transaction.amount.toFixed(2)}</td></tr>
            <tr><td>Processing Fee:</td><td>$0.00</td></tr>
            <tr style="border-top: 1px solid #333; font-size: 20px;">
                <td><strong>Total Paid:</strong></td>
                <td><strong>$${transaction.amount.toFixed(2)} ${transaction.currency}</strong></td>
            </tr>
        </table>
    </div>
    
    <div class="footer">
        <p>Thank you for your purchase with CoinVision!</p>
        <p>For support, contact us at support@coinvision.com</p>
        <p>This is an official receipt for your transaction.</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Receipt Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-600">CoinVision</h2>
            <p className="text-gray-600">Premium Coin Marketplace</p>
            <h3 className="text-xl font-semibold mt-2">RECEIPT</h3>
          </div>

          {/* Receipt Information */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Receipt Number:</span>
                  <p className="font-mono">{receiptData.receiptNumber}</p>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <p>{receiptData.date}</p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p>{receiptData.time}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-green-600 font-medium capitalize">{transaction.status}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Transaction ID:</span>
                  <p className="font-mono text-xs break-all">{transaction.id}</p>
                </div>
                {transaction.transak_order_id && (
                  <div className="col-span-2">
                    <span className="font-medium">Transak Order ID:</span>
                    <p className="font-mono text-xs break-all">{transaction.transak_order_id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          {coin && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Item Purchased</h4>
                <div className="flex items-center gap-4">
                  {coin.image && (
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium">{coin.name}</h5>
                    <p className="text-sm text-gray-600 font-mono">{coin.id}</p>
                    <p className="text-lg font-bold text-green-600">
                      ${coin.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${transaction.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Paid:</span>
                  <span>${transaction.amount.toFixed(2)} {transaction.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadReceipt} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button onClick={printReceipt} variant="outline" className="flex items-center gap-2">
              <Print className="h-4 w-4" />
              Print Receipt
            </Button>
            
            <Button onClick={emailReceipt} variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Receipt
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Thank you for your purchase with CoinVision!</p>
            <p>For support, contact us at support@coinvision.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionReceiptModal;
