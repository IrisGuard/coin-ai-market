
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Zap, TrendingUp, Shield, Globe, Award, Users, BarChart3, Sparkles, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI-Powered Recognition',
      description: 'Upload any coin photo and get instant identification with 99%+ accuracy using advanced computer vision',
      gradient: 'from-brand-primary to-brand-secondary'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Results',
      description: 'Complete coin analysis including grade, value, rarity, and market data in under 2 seconds',
      gradient: 'from-brand-secondary to-electric-purple'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Global Marketplace',
      description: 'List your authenticated coins instantly or browse thousands of verified collections worldwide',
      gradient: 'from-electric-purple to-brand-accent'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Professional Grading',
      description: 'Industry-standard grading with PCGS and NGC integration for complete authenticity verification',
      gradient: 'from-brand-accent to-electric-pink'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Coins Identified', icon: <Camera className="w-6 h-6" />, color: 'text-brand-primary' },
    { number: '99.7%', label: 'Accuracy Rate', icon: <Award className="w-6 h-6" />, color: 'text-coin-gold' },
    { number: '50K+', label: 'Active Collectors', icon: <Users className="w-6 h-6" />, color: 'text-brand-secondary' },
    { number: '$15M+', label: 'Marketplace Volume', icon: <BarChart3 className="w-6 h-6" />, color: 'text-brand-accent' }
  ];

  const benefits = [
    'Instant AI-powered coin identification',
    'Professional grade assessment',
    'Real-time market value estimation',
    'Global marketplace access',
    'Authentication & verification',
    'Price history & trends'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      <Navbar />
      
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Hero Section */}
      <section id="main-content" className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5"></div>
        
        <div className="max-w-7xl mx-auto container-padding hero-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-8">
              <Sparkles className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
              <span className="text-sm font-semibold text-brand-primary">Welcome to CoinVision AI</span>
              <Star className="w-4 h-4 ml-3 text-coin-gold" />
            </div>
            
            <h1 className="text-hero mb-8 text-brand-dark">
              Identify Any Coin
              <br />
              <span className="brand-gradient-text">In Seconds</span>
            </h1>
            
            <p className="text-body-large text-brand-medium max-w-4xl mx-auto mb-12">
              Upload a photo of your coin and get instant AI-powered identification, professional grading, 
              current market value, and access to the world's largest numismatic marketplace. 
              The future of coin collecting starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/upload">
                <Button className="coinvision-button focus-ring group">
                  <Camera className="w-6 h-6 group-hover:animate-pulse" />
                  Start Free Recognition
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button className="coinvision-button-outline focus-ring">
                  <Globe className="w-5 h-5" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center gap-3 text-left"
                >
                  <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                  <span className="text-body text-brand-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                className="stats-card hover-lift focus-ring"
                tabIndex={0}
                role="region"
                aria-label={`${stat.number} ${stat.label}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-4 text-white mx-auto ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                <div className="text-body-small text-brand-medium font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-section brand-gradient-text mb-6">
              How CoinVision AI Works
            </h2>
            <p className="text-body-large text-brand-medium max-w-3xl mx-auto">
              Professional-grade coin recognition and marketplace access in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                className="feature-card text-center group focus-ring"
                tabIndex={0}
                role="article"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-white shadow-xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-subsection text-brand-dark mb-4">{feature.title}</h3>
                <p className="text-body text-brand-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative section-spacing brand-gradient text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-section text-white mb-6">
              Three Steps to Success
            </h2>
            <p className="text-body-large text-white/90 max-w-3xl mx-auto">
              From photo to marketplace listing in under 30 seconds
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Upload Photo',
                description: 'Take a clear photo of your coin using your phone camera or upload from gallery',
                icon: <Camera className="w-8 h-8" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our advanced AI instantly identifies the coin, determines grade, rarity, and current market value',
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: '03',
                title: 'List & Sell',
                description: 'Automatically list on our global marketplace or start an auction with verified authentication',
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + (index * 0.2) }}
                className="text-center text-white focus-ring rounded-2xl p-6"
                tabIndex={0}
                role="article"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 mx-auto">
                  {step.icon}
                </div>
                <div className="text-6xl font-bold text-white/30 mb-4">{step.step}</div>
                <h3 className="text-subsection mb-4">{step.title}</h3>
                <p className="text-body text-white/90 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-spacing bg-gradient-to-br from-brand-light to-white">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 rounded-3xl border-2 border-brand-primary/20"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center mx-auto mb-8">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-section brand-gradient-text mb-6">
              Ready to Transform Your Collection?
            </h2>
            <p className="text-body-large text-brand-medium mb-8 max-w-2xl mx-auto">
              Join over 50,000 collectors worldwide who are already using CoinVision AI to identify, 
              authenticate, value, and trade their coins with professional-grade accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button className="coinvision-button focus-ring">
                  <Camera className="w-6 h-6" />
                  Start Free Recognition
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="coinvision-button-outline focus-ring">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="coinvision-footer" role="contentinfo">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-coin-gold to-coin-platinum flex items-center justify-center">
                  <Camera className="w-8 h-8 text-brand-dark" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">
                  CoinVision AI
                </span>
              </div>
              <p className="text-white/80 leading-relaxed">
                The world's most advanced AI-powered coin recognition and marketplace platform for collectors worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-white/80">
                <li><Link to="/upload" className="hover:text-white transition-colors focus-ring">AI Recognition</Link></li>
                <li><Link to="/marketplace" className="hover:text-white transition-colors focus-ring">Marketplace</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors focus-ring">Sign Up Free</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors focus-ring">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Grading Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Price History</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors focus-ring">About CoinVision AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus-ring">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              © 2024 CoinVision AI. All rights reserved. | Powered by advanced computer vision and machine learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
