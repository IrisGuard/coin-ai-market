
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface LoadingStateProps {
  children?: never;
}

interface ErrorStateProps {
  children?: never;
}

export const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="pt-20 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading coin details...</p>
      </div>
    </div>
  </div>
);

export const ErrorState = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="pt-20 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-gray-600">Coin not found</p>
      </div>
    </div>
  </div>
);

export const InvalidIdState = () => <Navigate to="/marketplace" replace />;
