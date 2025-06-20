
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Bitcoin, CreditCard, TrendingUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminWalletTab = () => {
  const [wallets, setWallets] = useState([]);
  const [tokenActivity, setTokenActivity] = useState([]);
  const [stats, setStats] = useState({
    totalWallets: 0,
    totalBalance: 0,
    activeWallets: 0,
    tokenTransactions: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWallets();
    fetchTokenActivity();
    fetchStats();
  }, []);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_balances')
        .select(`
          *,
          profiles!wallet_balances_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const fetchTokenActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('token_activity')
        .select(`
          *,
          profiles!token_activity_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTokenActivity(data || []);
    } catch (error) {
      console.error('Error fetching token activity:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [walletsRes, tokensRes] = await Promise.all([
        supabase.from('wallet_balances').select('balance'),
        supabase.from('token_activity').select('id')
      ]);

      const totalWallets = walletsRes.data?.length || 0;
      const totalBalance = walletsRes.data?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;
      const activeWallets = walletsRes.data?.filter(w => w.balance > 0).length || 0;
      const tokenTransactions = tokensRes.data?.length || 0;

      setStats({
        totalWallets,
        totalBalance,
        activeWallets,
        tokenTransactions
      });
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
    }
  };

  const filteredWallets = wallets.filter(wallet => 
    wallet.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.wallet_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Wallet Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWallets}</div>
            <p className="text-xs text-muted-foreground">All registered wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Combined wallet value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeWallets}</div>
            <p className="text-xs text-muted-foreground">Wallets with balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tokenTransactions}</div>
            <p className="text-xs text-muted-foreground">Total token activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wallets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchWallets}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{wallet.profiles?.email || 'Unknown User'}</span>
                    <Badge>{wallet.wallet_type || 'Standard'}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(wallet.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${wallet.balance}</div>
                  <div className="text-sm text-muted-foreground">{wallet.currency || 'USD'}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5" />
            Recent Token Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tokenActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{activity.profiles?.email || 'Unknown User'}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.activity_type} • {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{activity.amount} Tokens</div>
                  <Badge className={
                    activity.activity_type === 'earned' ? 'bg-green-600' :
                    activity.activity_type === 'spent' ? 'bg-red-600' :
                    'bg-blue-600'
                  }>
                    {activity.activity_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWalletTab;
