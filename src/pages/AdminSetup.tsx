
import React from 'react';
import AdminSetupHelper from '@/components/admin/AdminSetupHelper';

const AdminSetup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coin-purple to-coin-skyblue flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CoinVision Admin Setup
          </h1>
          <p className="text-coin-tan text-lg">
            Set up the first administrator account for your CoinVision marketplace
          </p>
        </div>
        
        <AdminSetupHelper />
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-white hover:text-coin-tan transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
