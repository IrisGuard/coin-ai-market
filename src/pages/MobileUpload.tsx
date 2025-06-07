
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MobileOptimizedUpload from '@/components/mobile/MobileOptimizedUpload';
import { Smartphone } from 'lucide-react';

const MobileUpload = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Mobile Upload</h1>
              <p className="text-sm text-gray-600">AI-powered coin recognition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Interface */}
      <div className="container mx-auto px-4 py-6">
        <MobileOptimizedUpload />
      </div>
    </div>
  );
};

export default MobileUpload;
