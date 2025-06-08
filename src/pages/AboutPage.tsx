
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Zap, Users } from 'lucide-react';

const AboutPage = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent mb-4">
            About CoinVision
          </h1>
          <p className="text-xl text-gray-600">
            Revolutionary AI-powered coin identification and marketplace platform
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-electric-purple" />
                AI-Powered Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our advanced AI technology can identify coins with incredible accuracy, 
                providing detailed information about rarity, condition, and market value.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-electric-green" />
                Secure Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Trade with confidence in our secure marketplace featuring verified dealers, 
                escrow protection, and comprehensive buyer/seller protection policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-electric-orange" />
                Real-Time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Stay ahead of market trends with real-time pricing data, historical analysis, 
                and predictive insights powered by machine learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-electric-blue" />
                Community Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join a vibrant community of collectors, dealers, and enthusiasts sharing 
                knowledge and building the future of numismatics together.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <div className="text-3xl font-bold text-electric-blue">500K+</div>
              <div className="text-sm text-gray-600">Coins Identified</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-electric-green">98.5%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-electric-purple">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-electric-orange">$2M+</div>
              <div className="text-sm text-gray-600">Trading Volume</div>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Trusted by collectors worldwide
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
