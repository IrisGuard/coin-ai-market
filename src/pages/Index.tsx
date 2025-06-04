
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Zap, TrendingUp, Shield, Globe, Award, Users, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Index = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI Recognition',
      description: 'Upload a photo and get instant identification with 95%+ accuracy',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get complete coin analysis including grade, value, and rarity in seconds',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Live Marketplace',
      description: 'List your coins immediately after recognition or bid on premium collections',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verified Grading',
      description: 'Professional grading standards with PCGS and NGC integration',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Coins Recognized', icon: <Camera className="w-6 h-6" /> },
    { number: '95%', label: 'Accuracy Rate', icon: <Award className="w-6 h-6" /> },
    { number: '12K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { number: '$2.5M+', label: 'Total Sales', icon: <BarChart3 className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-purple-200 mb-8">
              <Sparkles className="w-5 h-5 mr-3 text-purple-600 animate-pulse" />
              <span className="text-sm font-semibold text-purple-600">AI-Powered Coin Recognition</span>
            </div>
            
            <h1 className="section-title mb-8">
              Identify Any Coin
              <br />
              <span className="gradient-text">In Seconds</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Upload a photo of your coin and get instant AI-powered identification, professional grading, 
              current market value, and list it for sale immediately. The future of coin collecting is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/upload">
                <Button className="coinvision-button text-lg px-12 py-6">
                  <Camera className="w-6 h-6 mr-3" />
                  Start Recognition
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="coinvision-button-outline text-lg px-12 py-6">
                  Browse Marketplace
                </Button>
              </Link>
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
                className="stats-card text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 text-white mx-auto">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              How CoinVision AI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional coin recognition and marketplace listing in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                className="feature-card text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-white shadow-xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Three Steps to Success
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From photo to marketplace listing in under 30 seconds
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Upload Photo',
                description: 'Take a clear photo of your coin using your phone or camera',
                icon: <Camera className="w-8 h-8" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI instantly identifies the coin, grade, rarity, and market value',
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: '03',
                title: 'List & Sell',
                description: 'Automatically list on marketplace or start auction with one click',
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + (index * 0.2) }}
                className="text-center text-white"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 mx-auto">
                  {step.icon}
                </div>
                <div className="text-6xl font-bold text-white/30 mb-4">{step.step}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/80 text-lg leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 rounded-3xl border-2 border-purple-200"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-8">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Ready to Transform Your Collection?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of collectors who are already using CoinVision AI to identify, 
              value, and sell their coins with professional accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button className="coinvision-button text-lg px-12 py-6">
                  <Camera className="w-6 h-6 mr-3" />
                  Start Free Recognition
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="coinvision-button-outline text-lg px-12 py-6">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="coinvision-footer">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-serif font-bold text-white">
                  CoinVision AI
                </span>
              </div>
              <p className="text-white/80 leading-relaxed">
                The world's most advanced AI-powered coin recognition and marketplace platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-white/80">
                <li><Link to="/upload" className="hover:text-white transition-colors">AI Recognition</Link></li>
                <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grading Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Price History</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              © 2024 CoinVision AI. All rights reserved. | Powered by advanced AI recognition technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
