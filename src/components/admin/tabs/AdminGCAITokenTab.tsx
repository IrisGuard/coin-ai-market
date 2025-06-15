
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, TrendingUp, Lock, Users, Settings, Activity, 
  BarChart3, Shield, DollarSign, Zap 
} from 'lucide-react';
import { TokenManagementOverview } from '../token/TokenManagementOverview';
import { TokenManagementDashboard } from '../token/TokenManagementDashboard';
import { TokenLocksManagement } from '../token/TokenLocksManagement';
import { ReferralManagement } from '../token/ReferralManagement';
import { LiveTokenActivity } from '../token/LiveTokenActivity';
import { ActiveLocksSection } from '@/components/token/ActiveLocksSection';
import { ReferralSection } from '@/components/token/ReferralSection';
import { TokenomicsSection } from '@/components/token/TokenomicsSection';

const AdminGCAITokenTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GCAI Token Administration</h2>
          <p className="text-gray-600">Complete token ecosystem management with real-time data</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Activity className="w-4 h-4 mr-1" />
            Live Production
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Real Transactions
          </Badge>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="locks" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Token Locks
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Tokenomics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TokenManagementOverview />
        </TabsContent>

        <TabsContent value="management">
          <TokenManagementDashboard />
        </TabsContent>

        <TabsContent value="locks" className="space-y-6">
          <TokenLocksManagement />
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">User Lock Tracking</h3>
            <ActiveLocksSection />
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralManagement />
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">User Referral Interface</h3>
            <ReferralSection />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <LiveTokenActivity />
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-6">
          <TokenomicsSection />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Security monitoring dashboard</p>
              <p className="text-sm text-gray-500">Real-time security alerts and audit trails</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGCAITokenTab;
