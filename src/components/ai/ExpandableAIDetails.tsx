import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Brain, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coin } from '@/types/coin';

interface ExpandableAIDetailsProps {
  coin: Coin;
  className?: string;
}

const ExpandableAIDetails: React.FC<ExpandableAIDetailsProps> = ({ coin, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show if there's AI data
  if (!coin.ai_confidence && !coin.ai_provider) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  };

  const aiConfidence = coin.ai_confidence || 0;
  const confidencePercentage = Math.round(aiConfidence * 100);

  return (
    <div className={`ai-analysis-section ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="w-full justify-between p-2 h-auto bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            AI Analysis: {confidencePercentage}%
          </span>
          <Badge variant="outline" className="text-xs bg-white">
            {coin.ai_provider || 'Claude'}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-blue-200">
              <CardContent className="p-4 space-y-4">
                {/* Confidence Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Confidence Level:</span>
                    <Badge className={`${getConfidenceColor(aiConfidence)} border`}>
                      {getConfidenceLevel(aiConfidence)} ({confidencePercentage}%)
                    </Badge>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        aiConfidence >= 0.8 ? 'bg-green-500' : 
                        aiConfidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${confidencePercentage}%` }}
                    />
                  </div>
                </div>

                <Separator />

                {/* AI Analysis Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Identification Details */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Identification
                    </h4>
                    <div className="pl-5 space-y-1 text-gray-600">
                      <div><span className="font-medium">Name:</span> {coin.name}</div>
                      <div><span className="font-medium">Year:</span> {coin.year}</div>
                      {coin.country && <div><span className="font-medium">Country:</span> {coin.country}</div>}
                      {coin.denomination && <div><span className="font-medium">Denomination:</span> {coin.denomination}</div>}
                    </div>
                  </div>

                  {/* Grading & Valuation */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 flex items-center gap-1">
                      <Info className="w-4 h-4 text-blue-600" />
                      Assessment
                    </h4>
                    <div className="pl-5 space-y-1 text-gray-600">
                      <div><span className="font-medium">Grade:</span> {coin.grade}</div>
                      <div><span className="font-medium">Rarity:</span> {coin.rarity}</div>
                      {coin.condition && <div><span className="font-medium">Condition:</span> {coin.condition}</div>}
                      <div><span className="font-medium">Value:</span> €{coin.price?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Technical Details (if available) */}
                {(coin.composition || coin.weight || coin.diameter) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Technical Specifications</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        {coin.composition && (
                          <div><span className="font-medium">Material:</span> {coin.composition}</div>
                        )}
                        {coin.weight && (
                          <div><span className="font-medium">Weight:</span> {coin.weight}g</div>
                        )}
                        {coin.diameter && (
                          <div><span className="font-medium">Diameter:</span> {coin.diameter}mm</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* AI Provider Info */}
                <Separator />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Analyzed by {coin.ai_provider || 'Claude AI'}</span>
                  </div>
                  {coin.created_at && (
                    <span>
                      {new Date(coin.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Confidence Guidelines */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Confidence Guide:</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>80%+ Excellent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>60-79% Good</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>40-59% Fair</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>&lt;40% Low</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableAIDetails;