
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Camera, Search, BarChart3 } from 'lucide-react';

const AICapabilitiesShowcase = () => {
  const capabilities = [
    {
      icon: Camera,
      title: 'Image Recognition',
      description: 'Advanced computer vision for instant coin identification'
    },
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Continuously improving accuracy through deep learning'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Natural language processing for intuitive coin discovery'
    },
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'AI-powered market trends and valuation predictions'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Capabilities</h2>
          <p className="text-xl text-gray-600">Discover how our AI transforms coin collecting</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((capability, index) => (
            <Card key={capability.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <capability.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{capability.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AICapabilitiesShowcase;
