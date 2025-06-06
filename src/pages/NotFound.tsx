
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass, TrendingUp, Camera, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [popularPages, setPopularPages] = useState([]);

  useEffect(() => {
    // Log 404 error for analytics
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    
    // Track 404 in database for analytics
    const track404Error = async () => {
      try {
        await supabase.from('analytics_events').insert({
          event_type: '404_error',
          page_url: location.pathname,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error tracking 404:', error);
      }
    };

    track404Error();

    // Fetch popular pages for suggestions
    const fetchPopularPages = async () => {
      try {
        const { data } = await supabase
          .from('page_views')
          .select('page_path, view_count')
          .order('view_count', { ascending: false })
          .limit(5);
        
        if (data) setPopularPages(data);
      } catch (error) {
        console.error('Error fetching popular pages:', error);
      }
    };

    fetchPopularPages();
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const suggestedRoutes = [
    { path: '/', label: 'Home', icon: Home, description: 'Main dashboard and features' },
    { path: '/marketplace', label: 'Marketplace', icon: TrendingUp, description: 'Browse and buy coins' },
    { path: '/upload', label: 'Upload Coin', icon: Camera, description: 'AI coin identification' },
    { path: '/auth', label: 'Login/Register', icon: Shield, description: 'Access your account' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* 404 Hero */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-8xl font-bold text-brand-primary mb-4">404</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🔍 Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              The page <Badge variant="outline" className="mx-1">{location.pathname}</Badge> doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search for Coins Instead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search coins, years, countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggested Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid gap-4 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🧭 Suggested Pages
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {suggestedRoutes.map((route, index) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <Link to={route.path} className="flex items-center gap-3">
                        <route.icon className="w-5 h-5 text-brand-primary" />
                        <div className="text-left">
                          <div className="font-semibold">{route.label}</div>
                          <div className="text-sm text-gray-600">{route.description}</div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Popular Pages */}
          {popularPages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📈 Popular Pages
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {popularPages.map((page, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-brand-primary hover:text-white transition-colors"
                    onClick={() => navigate(page.page_path)}
                  >
                    {page.page_path} ({page.view_count} views)
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            <Button
              onClick={() => navigate('/marketplace')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore Marketplace
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
