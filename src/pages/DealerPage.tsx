
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import EnhancedDealerPanel from "@/components/dealer/EnhancedDealerPanel";

const DealerPage = () => {
  try {
    usePageView();
    
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <EnhancedDealerPanel />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-foreground">Page Error</h2>
          <p className="text-muted-foreground">
            Error loading enhanced dealer panel. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
};

export default DealerPage;
