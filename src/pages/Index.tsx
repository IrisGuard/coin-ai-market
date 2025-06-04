
import { motion } from "framer-motion";
import { Camera, Zap, TrendingUp, Shield, Users, Globe, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Instant AI Recognition",
      description: "Take a photo and get instant identification, grading, and valuation in seconds",
      color: "from-electric-blue to-brand-primary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "PCGS & NGC Verified",
      description: "Direct integration with professional grading services for accurate data",
      color: "from-electric-emerald to-electric-teal"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Live Market Data",
      description: "Real-time pricing and market trends from global coin exchanges",
      color: "from-brand-accent to-electric-pink"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Instant Listing",
      description: "From photo to marketplace listing in under 30 seconds",
      color: "from-coin-gold to-electric-orange"
    }
  ];

  const stats = [
    { label: "Coins Identified", value: "2.5M+", icon: <Camera className="w-6 h-6" /> },
    { label: "Active Dealers", value: "15,000+", icon: <Users className="w-6 h-6" /> },
    { label: "Countries", value: "50+", icon: <Globe className="w-6 h-6" /> },
    { label: "Accuracy Rate", value: "99.2%", icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-8">
              <Zap className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
              <span className="text-sm font-semibold text-brand-primary">World's First AI-Powered Coin Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-electric-blue to-brand-accent">
                CoinVision AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Snap a photo of any coin and instantly get professional identification, grading, and market valuation. 
              List on our global marketplace in seconds with AI-verified authenticity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => navigate('/upload')}
                className="brand-button text-lg px-8 py-4 h-auto"
              >
                <Camera className="w-6 h-6 mr-3" />
                Start Recognition
              </Button>
              <Button 
                onClick={() => navigate('/marketplace')}
                variant="outline"
                className="brand-button-outline text-lg px-8 py-4 h-auto"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                Browse Marketplace
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                className="stats-card text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/10 to-electric-blue/10 border border-white/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="text-brand-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From photo to marketplace listing in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Snap a Photo",
                description: "Take clear photos of both sides of your coin using your phone camera",
                icon: <Camera className="w-12 h-12" />
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our AI instantly identifies the coin, determines grade, and provides market valuation",
                icon: <Zap className="w-12 h-12" />
              },
              {
                step: "03",
                title: "List & Sell",
                description: "Approve the details and list your coin on our global marketplace instantly",
                icon: <TrendingUp className="w-12 h-12" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="feature-card text-center relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-electric-blue flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  {step.step}
                </div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-electric-blue/10 flex items-center justify-center mb-6 mx-auto">
                  <div className="text-brand-primary">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools powered by cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="feature-card text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary via-electric-blue to-brand-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto container-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of collectors and dealers using AI-powered coin recognition and trading
            </p>
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-white text-brand-primary hover:bg-white/90 text-lg px-8 py-4 h-auto font-semibold shadow-xl"
            >
              <Camera className="w-6 h-6 mr-3" />
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
