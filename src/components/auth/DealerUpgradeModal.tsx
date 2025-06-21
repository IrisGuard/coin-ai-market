import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import DealerSubscriptionUpgrade from '@/components/dealer/DealerSubscriptionUpgrade';

interface DealerUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerUpgradeModal = ({ isOpen, onClose }: DealerUpgradeModalProps) => {
  if (!isOpen) return null;

  const handleUpgradeSuccess = () => {
    // After successful payment, close modal and user will be redirected to admin panel
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-emerald bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Store className="w-6 h-6 text-electric-green" />
              Choose Your Dealer Plan
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Select a plan to start selling coins in our marketplace
            </p>
          </CardHeader>
          
          <CardContent>
            <DealerSubscriptionUpgrade onUpgradeSuccess={handleUpgradeSuccess} />
            
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DealerUpgradeModal;
