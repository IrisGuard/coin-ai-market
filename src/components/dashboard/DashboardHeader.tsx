
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Coins, 
  Brain, 
  Smartphone,
  Plus,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0] || 'Collector'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your coin collection with AI-powered insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button asChild>
            <Link to="/upload">
              <Plus className="w-4 h-4 mr-2" />
              Add Coin
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </div>
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Analyses</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Market Trend</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-green-600">
                    Bullish
                  </Badge>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Coins</p>
                <p className="text-2xl font-bold text-indigo-600">23</p>
              </div>
              <Coins className="w-6 h-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
