
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Coins, Shield, Brain, TrendingUp, Users, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI Coin Recognition",
      description: "Advanced AI instantly identifies and grades your coins with professional accuracy."
    },
    {
      icon: Shield,
      title: "Authentication Verification",
      description: "Sophisticated error detection and authenticity verification for peace of mind."
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Real-time market data and pricing insights from multiple trusted sources."
    },
    {
      icon: Users,
      title: "Verified Dealers",
      description: "Connect with certified dealers and collectors in our trusted marketplace."
    }
  ];

  const stats = [
    { value: "10K+", label: "Coins Analyzed" },
    { value: "500+", label: "Verified Dealers" },
    { value: "98%", label: "AI Accuracy" },
    { value: "$2M+", label: "Total Value Traded" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <Coins className="w-16 h-16 text-blue-600 mr-4" />
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  CoinVault
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                The world's most advanced AI-powered coin authentication and marketplace platform. 
                Discover, authenticate, and trade rare coins with unprecedented precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                        Browse Marketplace
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/marketplace">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                      Enter Marketplace
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Revolutionary Coin Authentication Technology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powered by cutting-edge AI and backed by decades of numismatic expertise
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Revolutionize Your Coin Collection?
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Join thousands of collectors and dealers who trust CoinVault for their numismatic needs.
                  </p>
                  {!isAuthenticated ? (
                    <Link to="/auth">
                      <Button size="lg" variant="secondary" className="text-blue-600 px-8 py-4 text-lg">
                        Start Your Journey
                        <Star className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/marketplace">
                      <Button size="lg" variant="secondary" className="text-blue-600 px-8 py-4 text-lg">
                        Explore Marketplace
                        <Star className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
