
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';
import CoinIdentificationCard from './CoinIdentificationCard';
import CoinGradingCard from './CoinGradingCard';
import CoinValuationCard from './CoinValuationCard';
import CoinListingForm from './CoinListingForm';

interface AnalysisResult {
  success: boolean;
  confidence: number;
  identification: {
    name?: string;
    year?: number;
    country?: string;
    denomination?: string;
    mint?: string;
  };
  grading: {
    condition?: string;
    grade?: string;
    details?: string;
  };
  valuation: {
    current_value?: number;
    low_estimate?: number;
    high_estimate?: number;
    market_trend?: string;
  };
}

interface AnalysisResultsSectionProps {
  analysisResult: AnalysisResult | null;
  listingPrice: string;
  listingDescription: string;
  isListing: boolean;
  onPriceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onListForSale: () => void;
  onStartAuction: () => void;
}

const AnalysisResultsSection = ({
  analysisResult,
  listingPrice,
  listingDescription,
  isListing,
  onPriceChange,
  onDescriptionChange,
  onListForSale,
  onStartAuction
}: AnalysisResultsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {analysisResult ? (
        <div className="space-y-6">
          <Card className="glass-card border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700">
                <CheckCircle className="w-6 h-6" />
                Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CoinIdentificationCard 
                identification={analysisResult.identification}
                confidence={analysisResult.confidence}
              />
              
              <CoinGradingCard grading={analysisResult.grading} />
              
              <CoinValuationCard valuation={analysisResult.valuation} />

              <CoinListingForm
                listingPrice={listingPrice}
                listingDescription={listingDescription}
                isListing={isListing}
                onPriceChange={onPriceChange}
                onDescriptionChange={onDescriptionChange}
                onListForSale={onListForSale}
                onStartAuction={onStartAuction}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="glass-card border-2 border-gray-200">
          <CardContent className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready for Analysis
            </h3>
            <p className="text-gray-600">
              Upload a coin image to get started with AI-powered identification
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AnalysisResultsSection;
