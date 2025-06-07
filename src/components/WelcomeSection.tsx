
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Upload, Eye, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Eye,
      title: 'AI Recognition',
      description: 'Upload photos and get instant coin identification'
    },
    {
      icon: TrendingUp,
      title: 'Market Prices',
      description: 'Real-time pricing from multiple sources'
    },
    {
      icon: Coins,
      title: 'Marketplace',
      description: 'Buy and sell coins with verified dealers'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Welcome to CoinVision
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The future of coin collecting and trading. Use AI to identify coins, track market prices, 
          and connect with verified dealers worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {user ? (
            <>
              <Button 
                onClick={() => navigate('/upload')}
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Coin
              </Button>
              <Button 
                onClick={() => navigate('/?demo=true')}
                variant="outline" 
                size="lg"
                className="px-8 py-3"
              >
                <Coins className="w-5 h-5 mr-2" />
                View Demo Content
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                Get Started Free
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline" 
                size="lg"
                className="px-8 py-3"
              >
                Sign In
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-100 hover:border-purple-200 transition-colors">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {user && (
          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Ready to explore?
            </h3>
            <p className="text-blue-600 mb-4">
              Access the admin panel to create demo content and test all features.
            </p>
            <div className="text-sm text-blue-500">
              Look for the "Admin Panel" button in the top navigation bar.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeSection;
