
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface TestResultsProps {
  results: {
    success: boolean;
    error?: string;
    data_points?: number;
    ai_extractable?: boolean;
    coin_data_found?: boolean;
    response_time?: number;
  };
}

const TestResults = ({ results }: TestResultsProps) => {
  return (
    <Card className={`mt-4 ${results.success ? 'border-green-200' : 'border-red-200'}`}>
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          {results.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          Test Results:
        </h4>
        {results.error ? (
          <div className="text-red-600 text-sm">{results.error}</div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>✅ Connection:</span>
              <span className="text-green-600">Success</span>
            </div>
            <div className="flex justify-between">
              <span>📊 Data Found:</span>
              <span>{results.data_points || 0} στοιχεία</span>
            </div>
            <div className="flex justify-between">
              <span>🤖 AI Extraction:</span>
              <span className={results.ai_extractable ? 'text-green-600' : 'text-yellow-600'}>
                {results.ai_extractable ? 'Άριστο' : 'Περιορισμένο'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>🪙 Coin Data:</span>
              <span className={results.coin_data_found ? 'text-green-600' : 'text-gray-600'}>
                {results.coin_data_found ? 'Ανιχνεύθηκε' : 'Όχι'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>⚡ Response Time:</span>
              <span>{results.response_time}ms</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResults;
