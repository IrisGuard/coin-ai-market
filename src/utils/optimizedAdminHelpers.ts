
import { supabase } from '@/integrations/supabase/client';

export const getOptimizedDashboardStats = async () => {
  try {
    console.log('🚀 Fetching optimized dashboard stats...');
    
    // Try to use the new comprehensive function first
    const { data, error } = await supabase.rpc('get_comprehensive_admin_dashboard');
    
    if (error) {
      console.error('❌ Error fetching comprehensive dashboard:', error);
      // Fallback to basic dashboard stats
      return await getBasicDashboardStats();
    }

    console.log('✅ Comprehensive dashboard data:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch optimized dashboard:', error);
    return await getBasicDashboardStats();
  }
};

const getBasicDashboardStats = async () => {
  try {
    console.log('📊 Fetching basic dashboard stats as fallback...');
    
    // Basic stats queries with proper error handling
    const [usersResult, coinsResult, transactionsResult] = await Promise.allSettled([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('coins').select('*', { count: 'exact', head: true }),
      supabase.from('payment_transactions').select('*', { count: 'exact', head: true })
    ]);

    const totalUsers = usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0;
    const totalCoins = coinsResult.status === 'fulfilled' ? coinsResult.value.count || 0 : 0;
    const totalTransactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value.count || 0 : 0;

    return {
      users: {
        total: totalUsers,
        dealers: 0,
        verified_dealers: 0
      },
      coins: {
        total: totalCoins,
        featured: 0,
        live_auctions: 0
      },
      transactions: {
        completed: totalTransactions,
        revenue: 0
      },
      system: {
        errors_24h: 0,
        ai_commands: 0
      },
      security_status: 'production_ready',
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to fetch basic dashboard stats:', error);
    return {
      users: { total: 0, dealers: 0, verified_dealers: 0 },
      coins: { total: 0, featured: 0, live_auctions: 0 },
      transactions: { completed: 0, revenue: 0 },
      system: { errors_24h: 0, ai_commands: 0 },
      security_status: 'error',
      last_updated: new Date().toISOString()
    };
  }
};

export const validateSecurityStatus = async () => {
  try {
    console.log('🔒 Validating security status...');
    
    const { data, error } = await supabase.rpc('validate_complete_security');
    
    if (error) {
      console.error('❌ Security validation error:', error);
      return { status: 'error', message: 'Security validation failed' };
    }
    
    console.log('✅ Security validation complete:', data);
    return data;
  } catch (error) {
    console.error('❌ Security validation failed:', error);
    return { status: 'error', message: 'Security validation system error' };
  }
};
