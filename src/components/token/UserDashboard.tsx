
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
      <div className="w-full flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <section className="flex w-full justify-center py-12 px-2 bg-slate-50 border-t border-b">
      <div className="max-w-6xl w-full">
        <div className="section-title mb-6 text-3xl font-extrabold text-brand-primary tracking-tight text-center">
          MY DASHBOARD
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <BalanceCard />
            <ReferralsCard />
          </div>
          <div className="lg:col-span-2">
            <LocksCard />
          </div>
        </div>
        <div className="mt-6">
            <ActivityTable />
        </div>
      </div>
    </section>
  );
};
