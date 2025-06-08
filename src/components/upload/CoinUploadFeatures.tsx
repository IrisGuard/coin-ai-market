
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Brain, DollarSign, Shield } from 'lucide-react';

const CoinUploadFeatures = () => {
  const features = [
    { icon: Camera, title: 'Photo Upload', description: 'Take clear photos for identification' },
    { icon: Brain, title: 'AI Recognition', description: 'Instant coin identification and grading' },
    { icon: DollarSign, title: 'Valuation', description: 'Real-time market value estimates' },
    { icon: Shield, title: 'Authentication', description: 'Advanced authenticity verification' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {features.map((feature, index) => (
        <Card key={feature.title} className="text-center">
          <CardContent className="p-6">
            <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoinUploadFeatures;
