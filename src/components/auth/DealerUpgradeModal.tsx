
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, ArrowUp, CheckCircle, Loader2 } from 'lucide-react';
import { useDealerUpgrade } from '@/hooks/auth/useDealerUpgrade';
import { useAuth } from '@/contexts/AuthContext';

interface DealerUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerUpgradeModal = ({ isOpen, onClose }: DealerUpgradeModalProps) => {
  const { isLoading, handleUpgrade } = useDealerUpgrade(onClose);
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-emerald bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Store className="w-6 h-6 text-electric-green" />
              Upgrade to Dealer
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Transform your account into a dealer account
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-green/10 to-electric-emerald/10 rounded-full mx-auto mb-4">
                <ArrowUp className="w-8 h-8 text-electric-green" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to start selling?
              </h3>
              
              <p className="text-gray-600 text-sm mb-6">
                Hello {user?.user_metadata?.full_name || user?.email}! 
                Upgrade your account to start selling coins in our marketplace.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-electric-green flex-shrink-0" />
                <span>Create your own coin store</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-electric-green flex-shrink-0" />
                <span>List unlimited coins for sale</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-electric-green flex-shrink-0" />
                <span>Access advanced AI tools</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-electric-green flex-shrink-0" />
                <span>Join our verified dealer network</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Maybe Later
              </Button>
              
              <Button
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-electric-green to-electric-emerald hover:from-electric-emerald hover:to-electric-cyan"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DealerUpgradeModal;
