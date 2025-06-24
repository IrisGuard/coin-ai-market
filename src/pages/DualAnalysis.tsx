import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DualAnalysis = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dealer page for coin analysis
    navigate('/dealer');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting to Coin Analysis...
        </h1>
        <p className="text-gray-600">
          Please use the dealer panel for comprehensive coin analysis.
        </p>
      </div>
    </div>
  );
};

export default DualAnalysis;
