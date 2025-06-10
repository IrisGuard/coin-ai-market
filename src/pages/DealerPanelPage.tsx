
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import SecurityValidationWrapper from '@/components/admin/SecurityValidationWrapper';
import DealerPanelDashboard from '@/components/admin/enhanced/DealerPanelDashboard';
import Navbar from '@/components/Navbar';

const DealerPanelPage = () => {
  usePageView();

  return (
    <SecurityValidationWrapper
      requireAdmin={false}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be logged in to access the dealer panel.</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                GlobalCoinsAI Dealer Panel
              </h1>
              <p className="text-gray-600">
                Professional coin dealer dashboard and management system
              </p>
            </div>
          </div>
          
          <DealerPanelDashboard />
        </div>
      </div>
    </SecurityValidationWrapper>
  );
};

export default DealerPanelPage;
