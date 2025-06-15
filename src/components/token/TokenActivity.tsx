
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTokenActivity } from '@/hooks/useTokenActivity';
import { Activity, ArrowUpRight, ArrowDownLeft, Lock, Users } from 'lucide-react';

export const TokenActivity = () => {
  const { data: activities, isLoading } = useTokenActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'lock':
        return <Lock className="w-4 h-4 text-blue-600" />;
      case 'referral':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'unlock':
        return <ArrowUpRight className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'lock':
        return 'bg-blue-100 text-blue-800';
      case 'referral':
        return 'bg-purple-100 text-purple-800';
      case 'unlock':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Token Activity</h3>
        <p className="text-gray-600">
          Track all your GCAI token transactions and activities.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activities || activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity yet</p>
              <p className="text-sm text-gray-500">
                Start by purchasing or locking some tokens!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold text-gray-900">
                        {activity.amount} GCAI
                      </p>
                    )}
                    <Badge className={getActivityColor(activity.activity_type)}>
                      {activity.activity_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
