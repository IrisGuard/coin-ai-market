
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'refund' | 'withdrawal' | 'deposit';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  coin_id?: string;
  description: string;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  fees?: number;
  from_address?: string;
  to_address?: string;
  user_id: string;
  coins?: {
    name: string;
    image?: string;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  successRate: number;
  pendingCount: number;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalVolume: 0,
    totalFees: 0,
    successRate: 0,
    pendingCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (filters?: {
    type?: string;
    status?: string;
    dateRange?: string;
    sortBy?: string;
  }) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select(`
          *,
          coins (
            name,
            image
          )
        `)
        .eq('user_id', user.id);

      // Apply filters
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply date range
      if (filters?.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.dateRange) {
          case '24h':
            startDate.setDate(now.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'date_desc':
          query = query.order('created_at', { ascending: false });
          break;
        case 'date_asc':
          query = query.order('created_at', { ascending: true });
          break;
        case 'amount_desc':
          query = query.order('amount', { ascending: false });
          break;
        case 'amount_asc':
          query = query.order('amount', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('type, status, amount, fees')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalTransactions = data?.length || 0;
      const totalVolume = data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const totalFees = data?.reduce((sum, t) => sum + (Number(t.fees) || 0), 0) || 0;
      const completedCount = data?.filter(t => t.status === 'completed').length || 0;
      const successRate = totalTransactions > 0 ? (completedCount / totalTransactions) * 100 : 0;
      const pendingCount = data?.filter(t => t.status === 'pending').length || 0;

      setStats({
        totalTransactions,
        totalVolume,
        totalFees,
        successRate,
        pendingCount
      });
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchTransactionStats();
    }
  }, [user]);

  return {
    transactions,
    stats,
    loading,
    fetchTransactions,
    fetchTransactionStats,
    refetch: () => {
      fetchTransactions();
      fetchTransactionStats();
    }
  };
};
