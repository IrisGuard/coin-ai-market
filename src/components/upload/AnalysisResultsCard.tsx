
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface AnalysisResultsCardProps {
  analysisResults: any[];
}

const AnalysisResultsCard = ({ analysisResults }: AnalysisResultsCardProps) => {
  if (analysisResults.length === 0) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          AI Analysis Complete
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisResults.map((result, index) => (
            <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-emerald-600 text-white">
                  Photo {index + 1}
                </Badge>
                <span className="text-sm text-emerald-600 font-semibold">
                  {((result.confidence || 0) * 100).toFixed(1)}% confidence
                </span>
              </div>
              <h4 className="font-semibold text-gray-800">{result.identification?.name || 'Unknown'}</h4>
              <p className="text-sm text-gray-600">
                {result.identification?.year || 'Unknown'} • {result.identification?.country || 'Unknown'}
              </p>
              <div className="mt-2 text-lg font-bold text-emerald-600">
                ${result.valuation?.current_value || 0}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
