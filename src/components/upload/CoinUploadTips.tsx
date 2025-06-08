
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const CoinUploadTips = () => {
  const tips = [
    'Use good lighting - natural light works best',
    'Take photos of both sides of the coin',
    'Ensure the entire coin is visible in the frame',
    'Use a plain background for better contrast',
    'Keep the camera steady to avoid blurry images'
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Photography Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CoinUploadTips;
