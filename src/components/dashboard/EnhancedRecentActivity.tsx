
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Heart, 
  Eye, 
  Clock, 
  DollarSign, 
  ShoppingCart 
} from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'favorite' | 'watchlist';
  coin_name: string;
  coin_image?: string;
  amount?: number;
  price?: number;
  created_at: string;
}

interface EnhancedRecentActivityProps {
  activities: RecentActivity[];
  loading?: boolean;
}

const EnhancedRecentActivity: React.FC<EnhancedRecentActivityProps> = ({ 
  activities, 
  loading = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="h-4 w-4" />;
      case 'sale': return <DollarSign className="h-4 w-4" />;
      case 'bid': return <Clock className="h-4 w-4" />;
      case 'favorite': return <Heart className="h-4 w-4" />;
      case 'watchlist': return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'sale': return 'text-blue-600 bg-blue-100';
      case 'bid': return 'text-yellow-600 bg-yellow-100';
      case 'favorite': return 'text-red-600 bg-red-100';
      case 'watchlist': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Purchase';
      case 'sale': return 'Sale';
      case 'bid': return 'Bid Placed';
      case 'favorite': return 'Added to Favorites';
      case 'watchlist': return 'Added to Watchlist';
      default: return 'Activity';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-500">Start trading to see activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{activity.coin_name}</p>
                    <Badge variant="outline" className="text-xs">
                      {getActivityLabel(activity.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(activity.created_at)}</p>
                </div>
                {(activity.price || activity.amount) && (
                  <p className="font-semibold text-gray-900">
                    {formatPrice(activity.price || activity.amount || 0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRecentActivity;
