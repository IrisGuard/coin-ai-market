
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Print, X } from 'lucide-react';

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
  const handleDownloadPDF = () => {
    // Create a printable version of the receipt
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Receipt - ${transaction.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ddd; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .receipt-title { font-size: 20px; margin-bottom: 5px; }
          .receipt-id { color: #666; font-size: 14px; }
          .content { max-width: 600px; margin: 0 auto; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #2563eb; }
          .item-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; float: left; margin-right: 15px; }
          .item-info h3 { margin: 0 0 5px 0; font-size: 18px; }
          .item-info p { margin: 0; color: #666; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .detail-item { }
          .detail-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
          .detail-value { font-size: 16px; font-weight: 500; }
          .total-section { background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; }
          .total-amount { font-size: 28px; font-weight: bold; color: #059669; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .clearfix::after { content: ""; display: table; clear: both; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <div class="logo">CoinAI Marketplace</div>
            <div class="receipt-title">Transaction Receipt</div>
            <div class="receipt-id">Receipt #${transaction.id}</div>
          </div>

          <div class="section">
            <div class="section-title">Purchase Details</div>
            <div class="item-details clearfix">
              <img src="${transaction.coin_image}" alt="${transaction.coin_name}" class="item-image" />
              <div class="item-info">
                <h3>${transaction.coin_name}</h3>
                <p>Sold by ${transaction.seller_name}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Transaction Information</div>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Transaction ID</div>
                <div class="detail-value">${transaction.id}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Date</div>
                <div class="detail-value">${new Date(transaction.transaction_date).toLocaleDateString()}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Payment Method</div>
                <div class="detail-value">${transaction.payment_method}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${transaction.status}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="total-section">
              <div style="margin-bottom: 10px; color: #666;">Total Amount</div>
              <div class="total-amount">$${transaction.amount.toFixed(2)}</div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at support@coinai.com</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    
    // Trigger download
    setTimeout(() => {
      receiptWindow.print();
      receiptWindow.close();
    }, 250);
  };

  const handlePrintReceipt = () => {
    handleDownloadPDF();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Transaction Receipt
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Receipt Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">CoinAI Marketplace</h2>
            <p className="text-lg font-semibold">Transaction Receipt</p>
            <p className="text-sm text-gray-600">Receipt #{transaction.id}</p>
          </div>

          {/* Purchase Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Purchase Details</h3>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={transaction.coin_image} 
                alt={transaction.coin_name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h4 className="text-xl font-semibold">{transaction.coin_name}</h4>
                <p className="text-gray-600">Sold by {transaction.seller_name}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Transaction Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-gray-900 font-mono text-sm">{transaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p className="text-gray-900">{transaction.payment_method}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900 capitalize">{transaction.status}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">
              ${transaction.amount.toFixed(2)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button 
              variant="outline"
              onClick={handlePrintReceipt}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Print className="h-4 w-4" />
              Print Receipt
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at support@coinai.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionReceiptModal;
