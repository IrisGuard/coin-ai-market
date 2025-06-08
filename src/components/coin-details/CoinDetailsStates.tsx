
import React from 'react';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="pt-20 flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="text-gray-600">Loading coin details...</span>
      </div>
    </div>
  </div>
);

export const ErrorState = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="pt-20 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Coin Not Found</h2>
        <p className="text-gray-600">The coin you're looking for doesn't exist.</p>
      </div>
    </div>
  </div>
);

export const InvalidIdState = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="pt-20 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Coin ID</h2>
        <p className="text-gray-600">Please provide a valid coin ID.</p>
      </div>
    </div>
  </div>
);
