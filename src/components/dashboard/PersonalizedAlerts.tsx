
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Clock, 
  DollarSign,
  Eye,
  Settings
} from 'lucide-react';

interface PersonalizedAlertsProps {
  portfolioItems: any[];
  isAnalyzing: boolean;
}

const PersonalizedAlerts: React.FC<PersonalizedAlertsProps> = ({ 
  portfolioItems, 
  isAnalyzing 
}) => {
  const alerts = [
    {
      id: 1,
      type: "price_alert",
      priority: "high",
      title: "1909-S VDB Penny Alert",
      message: "Price increased 8% in the last week - consider selling",
      timestamp: "2 hours ago",
      action: "View Market Data",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "green"
    },
    {
      id: 2,
      type: "opportunity",
      priority: "medium",
      title: "Similar Coin Available",
      message: "1921 Morgan Dollar MS-64 listed below market value",
      timestamp: "5 hours ago",
      action: "View Listing",
      icon: <Target className="w-4 h-4" />,
      color: "blue"
    },
    {
      id: 3,
      type: "portfolio",
      priority: "low",
      title: "Diversification Suggestion",
      message: "Consider adding ancient coins to reduce risk",
      timestamp: "1 day ago",
      action: "See Recommendations",
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "yellow"
    },
    {
      id: 4,
      type: "market",
      priority: "medium",
      title: "Market Trend Alert",
      message: "Silver prices expected to rise 5% this quarter",
      timestamp: "2 days ago",
      action: "Read Analysis",
      icon: <DollarSign className="w-4 h-4" />,
      color: "purple"
    },
    {
      id: 5,
      type: "auction",
      priority: "high",
      title: "Auction Ending Soon",
      message: "1916-D Mercury Dime auction ends in 2 hours",
      timestamp: "30 minutes ago",
      action: "Place Bid",
      icon: <Clock className="w-4 h-4" />,
      color: "red"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAlertColor = (color: string) => {
    const colors = {
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      purple: 'text-purple-600 bg-purple-50',
      red: 'text-red-600 bg-red-50'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const alertSettings = {
    price_changes: true,
    new_opportunities: true,
    portfolio_insights: true,
    market_trends: true,
    auction_updates: true
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Personalized Alerts
            {isAnalyzing && (
              <Badge variant="secondary" className="ml-2 animate-pulse">
                Updating...
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </CardTitle>
        <CardDescription>
          Stay informed with AI-powered alerts tailored to your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${getAlertColor(alert.color)}`}>
                    {alert.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(alert.priority)}`}
                >
                  {alert.priority.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">{alert.message}</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  {alert.action}
                </Button>
                <Button size="sm" variant="ghost" className="text-xs text-gray-500">
                  Dismiss
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alert Settings Preview */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Alert Preferences
          </h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(alertSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="capitalize">{key.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedAlerts;
