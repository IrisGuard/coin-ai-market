
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CoinUploadTips = () => {
  const tips = [
    'Use natural daylight or bright LED lighting',
    'Keep camera steady and focused on details',
    'Include obverse, reverse, and edge views',
    'Avoid shadows, glare, and reflections'
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
          Photography Tips for Best Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, index) => (
            <div key={tip} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span className="text-gray-700 font-medium">{tip}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinUploadTips;
