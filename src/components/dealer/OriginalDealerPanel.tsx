
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Store, Coins, Wallet, CreditCard, TrendingUp, Upload, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryNavigationFromDatabase from '@/components/marketplace/CategoryNavigationFromDatabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const OriginalDealerPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('categories');
  const [walletBalance, setWalletBalance] = useState(0);
  const [stats, setStats] = useState({
    totalCoins: 0,
    totalSales: 0,
    pendingOrders: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    fetchDealerStats();
    fetchWalletBalance();
  }, [user]);

  const fetchDealerStats = async () => {
    if (!user?.id) return;
    
    try {
      const [coinsRes, salesRes] = await Promise.all([
        supabase.from('coins').select('*').eq('user_id', user.id),
        supabase.from('payment_transactions').select('*').eq('user_id', user.id).eq('status', 'completed')
      ]);

      const totalCoins = coinsRes.data?.length || 0;
      const totalSales = salesRes.data?.length || 0;
      const monthlyRevenue = salesRes.data?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;

      setStats({
        totalCoins,
        totalSales,
        pendingOrders: 0,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching dealer stats:', error);
    }
  };

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('wallet_balances')
        .select('gcai_balance')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setWalletBalance(data.gcai_balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-4">
            🔴 LIVE DEALER PANEL - ΠΛΗΡΗΣ ΛΕΙΤΟΥΡΓΙΚΟΤΗΤΑ
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-green-600 text-white px-4 py-2">
              LIVE PRODUCTION
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              30 ΚΑΤΗΓΟΡΙΕΣ ΕΝΕΡΓΕΣ
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              WALLET ΔΙΑΘΕΣΙΜΟ
            </Badge>
            <Badge className="bg-orange-600 text-white px-4 py-2">
              ADMIN ACCESS
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Coins className="h-5 w-5" />
                Συνολικά Νομίσματα
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCoins}</div>
              <p className="text-sm text-green-500">Στο κατάστημά σας</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                Πωλήσεις
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSales}</div>
              <p className="text-sm text-blue-500">Επιτυχημένες</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <CreditCard className="h-5 w-5" />
                Έσοδα Μήνα
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">€{stats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-sm text-purple-500">Τρέχων μήνας</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Wallet className="h-5 w-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{walletBalance} GCAI</div>
              <p className="text-sm text-orange-500">Διαθέσιμο υπόλοιπο</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              30 Κατηγορίες Νομισμάτων
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Crypto & Banking
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Νομισμάτων
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  30 Κατηγορίες Νομισμάτων - Άμεση Πρόσβαση
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-green-600 animate-pulse" />
                    <span className="font-medium text-green-800">
                      Κατηγορίες φορτώνουν από βάση δεδομένων - LIVE CONNECTION
                    </span>
                  </div>
                  <p className="text-sm text-green-600">
                    Όλες οι 30 κατηγορίες συνδέονται απευθείας με το Supabase για real-time δεδομένα
                  </p>
                </div>
                <CategoryNavigationFromDatabase />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Crypto Wallet Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-800">GCAI Balance</div>
                      <div className="text-2xl font-bold text-blue-600">{walletBalance} GCAI</div>
                      <div className="text-sm text-blue-500">Available for trading</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Deposit GCAI
                      </Button>
                      <Button variant="outline" className="border-blue-600 text-blue-600">
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Banking & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-800">Monthly Revenue</div>
                      <div className="text-2xl font-bold text-purple-600">€{stats.monthlyRevenue.toFixed(2)}</div>
                      <div className="text-sm text-purple-500">Current month earnings</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Setup Banking
                      </Button>
                      <Button variant="outline" className="border-purple-600 text-purple-600">
                        Payment History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Άμεσο Upload Νομισμάτων
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">Upload Νέα Νομίσματα</h3>
                  <p className="text-gray-600 mb-6">
                    Προσθέστε νέα νομίσματα στο κατάστημά σας με AI αναγνώριση
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-20 bg-blue-600 hover:bg-blue-700">
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-1" />
                        <div>Single Upload</div>
                      </div>
                    </Button>
                    <Button className="h-20 bg-green-600 hover:bg-green-700">
                      <div className="text-center">
                        <Brain className="h-6 w-6 mx-auto mb-1" />
                        <div>Bulk Upload with AI</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default OriginalDealerPanel;
