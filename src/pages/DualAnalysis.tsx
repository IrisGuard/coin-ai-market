
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DualImageUploader from '@/components/analysis/DualImageUploader';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import type { DualAnalysisResult } from '@/hooks/useDualImageAnalysis';

const DualAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<DualAnalysisResult | null>(null);

  const handleAnalysisComplete = (result: DualAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!analysisResult ? (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Complete Dual-Side Coin Analysis
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload both sides of your coin for comprehensive AI recognition, 
                global market discovery, error detection, and investment analysis
              </p>
            </div>
          ) : null}
          
          {!analysisResult ? (
            <DualImageUploader onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <AnalysisResults 
              results={analysisResult} 
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DualAnalysis;
