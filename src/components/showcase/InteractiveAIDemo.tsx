
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const InteractiveAIDemo = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Our AI Demo</h2>
          <p className="text-xl text-gray-600">Experience the power of AI coin identification</p>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Interactive AI Demonstration</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-12">
            <div className="bg-gray-200 rounded-lg p-12 mb-8">
              <div className="text-6xl mb-4">🪙</div>
              <p className="text-gray-600">Upload a coin image to see AI identification in action</p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" />
              Start Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InteractiveAIDemo;
