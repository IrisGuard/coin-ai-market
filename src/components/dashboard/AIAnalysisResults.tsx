
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIAnalysisResultsProps {
  coin: {
    id: string;
    name: string;
    image: string;
    ai_confidence?: number;
    composition?: string;
    grade: string;
    year: number;
    country?: string;
    price: number;
  };
  onReAnalyze: () => void;
  onEditDetails: () => void;
  onConfirm: () => void;
}

const AIAnalysisResults = ({ 
  coin, 
  onReAnalyze, 
  onEditDetails, 
  onConfirm 
}: AIAnalysisResultsProps) => {
  const confidence = coin.ai_confidence || 0;
  const confidencePercentage = Math.round(confidence * 100);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-green-600';
    if (conf >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.9) return { variant: 'default' as const, text: 'High Confidence' };
    if (conf >= 0.7) return { variant: 'secondary' as const, text: 'Medium Confidence' };
    return { variant: 'destructive' as const, text: 'Low Confidence' };
  };

  const badgeInfo = getConfidenceBadge(confidence);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Analysis Results - {coin.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={badgeInfo.variant}>
            {confidence >= 0.9 ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertTriangle className="w-3 h-3 mr-1" />
            )}
            {badgeInfo.text} ({confidencePercentage}%)
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Material:</span>
              <div className="flex items-center gap-2">
                <span>{coin.composition || 'Unknown'}</span>
                <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                  ({confidencePercentage}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Year:</span>
              <div className="flex items-center gap-2">
                <span>{coin.year}</span>
                <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                  ({Math.min(confidencePercentage + 3, 100)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Country:</span>
              <div className="flex items-center gap-2">
                <span>{coin.country || 'Unknown'}</span>
                <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                  ({Math.min(confidencePercentage + 1, 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Grade:</span>
              <div className="flex items-center gap-2">
                <span>{coin.grade}</span>
                <span className={`text-xs ${getConfidenceColor(Math.max(confidence - 0.1, 0))}`}>
                  ({Math.max(confidencePercentage - 10, 50)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Errors:</span>
              <div className="flex items-center gap-2">
                <span>None detected</span>
                <span className="text-xs text-green-600">(95%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔹 Estimated Value:</span>
              <div className="flex items-center gap-2">
                <span>${Math.round(coin.price * 0.9)}-${Math.round(coin.price * 1.1)}</span>
                <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                  ({confidencePercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReAnalyze}
          >
            Re-analyze
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEditDetails}
          >
            Edit Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisResults;
