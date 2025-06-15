
import React from 'react';
import { useTokenActivity } from '@/hooks/useTokenActivity';
import { Loader2, ShoppingCart, Lock, Unlock, Gift, Users } from 'lucide-react';
import { format } from 'date-fns';

const activityIcons: { [key: string]: React.ReactNode } = {
  purchase: <ShoppingCart className="w-4 h-4 text-[#00ff88]" />,
  stake: <Lock className="w-4 h-4 text-[#0070fa]" />,
  reward: <Gift className="w-4 h-4 text-[#ffd700]" />,
  unstake: <Unlock className="w-4 h-4 text-[#ff00cc]" />,
  referral: <Users className="w-4 h-4 text-[#ff6600]" />,
};

export const ActivityTable = () => {
  const { data: activities, isLoading } = useTokenActivity();

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70 shadow-xl p-8 animate-fade-in">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[#00d4ff] w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70 shadow-xl p-6 animate-fade-in">
      <h3 className="font-extrabold text-xl mb-6 bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">Your Platform Activity</h3>
      {activities && activities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs font-extrabold uppercase bg-gradient-to-r from-[#00d4ff]/20 to-[#00ff88]/20 rounded-xl">
              <tr>
                <th className="px-4 py-3 text-left font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">Type</th>
                <th className="px-4 py-3 text-left font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">Description</th>
                <th className="px-4 py-3 text-right font-extrabold bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">Amount</th>
                <th className="px-4 py-3 text-right font-extrabold bg-gradient-to-r from-[#ff00cc] to-[#ffd700] bg-clip-text text-transparent">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b border-[#00d4ff]/20 hover:bg-gradient-to-r hover:from-[#00d4ff]/10 hover:to-[#00ff88]/10 transition-all">
                  <td className="px-4 py-3 flex items-center capitalize">
                    <div className="flex items-center gap-2">
                      {activityIcons[activity.activity_type] || <ShoppingCart className="w-4 h-4 text-[#00d4ff]" />}
                      <span className="font-bold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">{activity.activity_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">{activity.description}</td>
                  <td className="px-4 py-3 font-extrabold text-right bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">
                    {activity.amount ? `${Number(activity.amount).toLocaleString()} GCAI` : '-'}
                  </td>
                  <td className="px-4 py-3 font-bold text-right bg-gradient-to-r from-[#ff00cc] to-[#ffd700] bg-clip-text text-transparent">
                    {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm font-bold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent mb-4">No recent activity found.</p>
          <p className="text-xs font-semibold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">Start using GCAI tokens to see your activity history here!</p>
        </div>
      )}
    </div>
  );
};
