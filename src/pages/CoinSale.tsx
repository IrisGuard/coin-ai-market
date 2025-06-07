
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, DollarSign, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CoinSale = () => {
  usePageView();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartSelling = () => {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI-Powered Recognition",
      description: "Upload photos and get instant AI identification with 99% accuracy"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Market Valuation",
      description: "Get real-time market values based on current auction and sales data"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Authentication Services",
      description: "Verify authenticity with advanced imaging and expert analysis"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Listing",
      description: "List your coins in minutes with our streamlined process"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Upload Photos",
      description: "Take clear photos of your coin's front and back"
    },
    {
      step: "2", 
      title: "AI Analysis",
      description: "Our AI identifies and grades your coin automatically"
    },
    {
      step: "3",
      title: "Set Price",
      description: "Set your price or start an auction based on market data"
    },
    {
      step: "4",
      title: "Start Selling",
      description: "Your coin is live and ready for buyers worldwide"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-purple-600">Sell Your </span>
              <span className="text-blue-600">Coins</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Turn your coin collection into cash with our AI-powered marketplace. 
              Get accurate valuations, reach global buyers, and sell with confidence.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Button
                onClick={handleStartSelling}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg hover:from-purple-700 hover:to-blue-700"
              >
                <Upload className="w-6 h-6 mr-2" />
                Start Selling Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-green-600">Why Choose </span>
              <span className="text-purple-600">CoinVision?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets expert numismatic knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-blue-600">How It </span>
              <span className="text-green-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to start selling your coins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of collectors who trust CoinVision to sell their coins
            </p>
            <Button
              onClick={handleStartSelling}
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg hover:bg-gray-100"
            >
              <Star className="w-6 h-6 mr-2" />
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoinSale;
