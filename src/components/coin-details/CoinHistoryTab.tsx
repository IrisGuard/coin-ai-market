
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Zap } from 'lucide-react';

interface CoinHistoryTabProps {
  coin: {
    created_at: string;
    ai_confidence?: number;
  };
}

const CoinHistoryTab = ({ coin }: CoinHistoryTabProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold">Listed for sale</div>
              <div className="text-sm text-gray-600">
                {new Date(coin.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {coin.ai_confidence && (
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold">AI Verified</div>
                <div className="text-sm text-gray-600">
                  {(coin.ai_confidence * 100).toFixed(1)}% confidence
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinHistoryTab;
