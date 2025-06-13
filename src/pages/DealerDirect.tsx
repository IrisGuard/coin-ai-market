
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import Navbar from '@/components/Navbar';
import FullyConnectedDealerPanel from '@/components/dealer/FullyConnectedDealerPanel';
import { Loader2, Store } from 'lucide-react';

const DealerDirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();

  console.log('📄 DealerDirect - FULLY CONNECTED DEALER PANEL with Full AI Integration');

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="text-blue-600 font-medium">Loading dealer panel...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <Store className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the dealer panel.</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'dealer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <Store className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Dealer Access Required</h2>
          <p className="text-muted-foreground">
            You need dealer privileges to access this panel.
          </p>
          <p className="text-sm text-muted-foreground">
            Current role: {userRole || 'No role assigned'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FullyConnectedDealerPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DealerDirect;
