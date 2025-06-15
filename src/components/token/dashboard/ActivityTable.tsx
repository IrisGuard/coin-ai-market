
import React from 'react';
import { useTokenActivity } from '@/hooks/useTokenActivity';
import { Loader2, ArrowRightLeft, ArrowUp, ArrowDown, Gift, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

const activityIcons: { [key: string]: React.ReactNode } = {
  purchase: <ShoppingCart className="w-4 h-4 text-green-500" />,
  stake: <Lock className="w-4 h-4 text-blue-500" />,
  reward: <Gift className="w-4 h-4 text-yellow-500" />,
  unstake: <Unlock className="w-4 h-4 text-purple-500" />,
  referral: <Users className="w-4 h-4 text-orange-500" />,
};

import { Lock, Unlock, Users } from 'lucide-react';

export const ActivityTable = () => {
  const { data: activities, isLoading } = useTokenActivity();

  if (isLoading) {
    return <div className="section-box flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="section-box col-span-1 md:col-span-2">
      <h3 className="font-bold text-[18px] mb-4">Recent Activity</h3>
      {activities && activities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b">
                  <td className="px-4 py-3 flex items-center capitalize">
                    {activityIcons[activity.activity_type] || <ArrowRightLeft className="w-4 h-4 text-gray-400" />}
                    <span className="ml-2">{activity.activity_type}</span>
                  </td>
                  <td className="px-4 py-3">{activity.description}</td>
                  <td className="px-4 py-3 font-medium text-right">{activity.amount ? `${Number(activity.amount).toLocaleString()} GCAI` : '-'}</td>
                  <td className="px-4 py-3 text-text-secondary text-right">{format(new Date(activity.created_at), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-text-secondary text-center py-8">No recent activity.</p>
      )}
    </div>
  );
};
