
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { BalanceCard } from './dashboard/BalanceCard';
import { LocksCard } from './dashboard/LocksCard';
import { ReferralsCard } from './dashboard/ReferralsCard';
import { ActivityTable } from './dashboard/ActivityTable';
import { Loader2 } from 'lucide-react';

export const UserDashboard = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20 bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#ff00cc]/10">
        <Loader2 className="animate-spin text-[#00d4ff] w-12 h-12" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <section className="flex w-full justify-center py-12 px-4 bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#ff00cc]/10 border-t-2 border-b-2 border-[#00d4ff]/30">
      <div className="max-w-6xl w-full">
        <div className="section-title mb-8 text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#ff00cc] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center animate-glow drop-shadow">
          MY DASHBOARD
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-8 lg:col-span-1">
            <BalanceCard />
            <ReferralsCard />
          </div>
          <div className="lg:col-span-2">
            <LocksCard />
          </div>
        </div>
        <div className="mt-8">
            <ActivityTable />
        </div>
      </div>
    </section>
  );
};
