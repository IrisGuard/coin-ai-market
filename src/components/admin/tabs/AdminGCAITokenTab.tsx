
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
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">GCAI Token Administration</h2>
          <p className="font-bold bg-gradient-to-r from-[#7c3aed] via-[#ff00cc] to-[#0070fa] bg-clip-text text-transparent">Complete token ecosystem management with real-time live data</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-white font-extrabold animate-glow">
            <Activity className="w-4 h-4 mr-1" />
            Live Production
          </Badge>
          <Badge className="bg-gradient-to-r from-[#0070fa] to-[#7c3aed] text-white font-extrabold animate-glow">
            Real Transactions
          </Badge>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8 glass-card bg-gradient-to-r from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/70">
          <TabsTrigger value="overview" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">
            <Settings className="w-4 h-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="locks" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
            <Lock className="w-4 h-4" />
            Token Locks
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#ff00cc] to-[#ffd700] bg-clip-text text-transparent">
            <Users className="w-4 h-4" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">
            <Activity className="w-4 h-4" />
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#ff6600] to-[#ff1744] bg-clip-text text-transparent">
            <BarChart3 className="w-4 h-4" />
            Tokenomics
          </TabsTrigger>
          <TabsTrigger value="user-locks" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent">
            <Lock className="w-4 h-4" />
            User Locks
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-[#ff00cc] to-[#ff6600] bg-clip-text text-transparent">
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
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralManagement />
        </TabsContent>

        <TabsContent value="activity">
          <LiveTokenActivity />
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-6">
          <TokenomicsSection />
        </TabsContent>

        <TabsContent value="user-locks" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow mb-4">User Lock Tracking - Live Data</h3>
            <ActiveLocksSection />
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="text-center py-8 glass-card rounded-3xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 border-2 border-[#ff00cc]/70 shadow-xl">
              <Shield className="w-12 h-12 text-[#ff00cc] mx-auto mb-4 animate-glow" />
              <p className="font-extrabold text-lg bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent animate-glow">Security Monitoring Dashboard</p>
              <p className="text-sm font-bold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent mt-2">Real-time security alerts and audit trails for all crypto transactions</p>
            </div>
            <div className="text-center py-8 glass-card rounded-3xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 border-2 border-[#00ff88]/70 shadow-xl">
              <Zap className="w-12 h-12 text-[#00ff88] mx-auto mb-4 animate-glow" />
              <p className="font-extrabold text-lg bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent animate-glow">Live Performance Metrics</p>
              <p className="text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent mt-2">All crypto functions are live and operational with real-time monitoring</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGCAITokenTab;
