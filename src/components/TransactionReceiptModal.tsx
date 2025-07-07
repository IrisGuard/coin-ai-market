import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer, X } from 'lucide-react';

interface TransactionDetails {
  id: string;
  amount: number;
  coin_name: string;
  coin_image: string;
  seller_name: string;
  transaction_date: string;
  payment_method: string;
  status: string;
}

interface TransactionReceiptModalProps {
  transaction: TransactionDetails;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionReceiptModal = ({ transaction, isOpen, onClose }: TransactionReceiptModalProps) => {
  const downloadReceipt = () => {
    const receiptContent = `
      COINAI MARKETPLACE RECEIPT
      ========================
      
      Transaction ID: ${transaction.id}
      Date: ${new Date(transaction.transaction_date).toLocaleDateString()}
      
      ITEM DETAILS:
      ${transaction.coin_name}
      Sold by: ${transaction.seller_name}
      
      PAYMENT DETAILS:
      Amount: $${transaction.amount.toFixed(2)}
      Payment Method: ${transaction.payment_method}
      Status: ${transaction.status}
      
      Thank you for your purchase!
      
      CoinAI Marketplace
      support@coinai.com
    `;

    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .receipt-container { max-width: 600px; margin: 0 auto; }
              .item-details { margin: 20px 0; }
              .payment-details { margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; }
              .divider { border-top: 1px solid #ccc; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="header">
                <h1>CoinAI Marketplace</h1>
                <h2>Transaction Receipt</h2>
              </div>
              
              <div class="divider"></div>
              
              <div class="transaction-info">
                <p><strong>Transaction ID:</strong> ${transaction.id}</p>
                <p><strong>Date:</strong> ${new Date(transaction.transaction_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${transaction.status}</p>
              </div>
              
              <div class="divider"></div>
              
              <div class="item-details">
                <h3>Item Details</h3>
                <p><strong>Item:</strong> ${transaction.coin_name}</p>
                <p><strong>Seller:</strong> ${transaction.seller_name}</p>
              </div>
              
              <div class="divider"></div>
              
              <div class="payment-details">
                <h3>Payment Details</h3>
                <p><strong>Amount Paid:</strong> $${transaction.amount.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> ${transaction.payment_method}</p>
              </div>
              
              <div class="divider"></div>
              
              <div class="footer">
                <p>Thank you for your purchase!</p>
                <p>CoinAI Marketplace | support@coinai.com</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Transaction Receipt
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold">CoinAI Marketplace</h2>
              <p className="text-gray-600">Official Transaction Receipt</p>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="capitalize">{transaction.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p>{transaction.payment_method}</p>
              </div>
            </div>

            {/* Item Details */}
            <div className="border-t border-b py-4 mb-6">
              <h3 className="font-semibold mb-3">Item Details</h3>
              <div className="flex items-center space-x-4">
                <img 
                  src={transaction.coin_image || '/placeholder.svg'} 
                  alt={transaction.coin_name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{transaction.coin_name}</p>
                  <p className="text-gray-600">Sold by {transaction.seller_name}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Total Amount Paid</span>
                  <span className="text-xl font-bold">${transaction.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm">
              <p>Thank you for your purchase!</p>
              <p>CoinAI Marketplace | support@coinai.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={downloadReceipt}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={printReceipt}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionReceiptModal;