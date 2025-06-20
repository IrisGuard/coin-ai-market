
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { emergencyActivation } from '@/services/emergencyActivationService';
import { toast } from 'sonner';

interface LiveMarketplaceData {
  coins: any[];
  totalCoins: number;
  activeSources: number;
  aiProcessingActive: boolean;
  isLoading: boolean;
  systemStatus: string;
  refreshData: () => void;
  performEmergencyActivation: () => void;
}

const LiveMarketplaceContext = createContext<LiveMarketplaceData | null>(null);

export const useLiveMarketplace = () => {
  const context = useContext(LiveMarketplaceContext);
  if (!context) {
    throw new Error('useLiveMarketplace must be used within LiveMarketplaceDataProvider');
  }
  return context;
};

const LiveMarketplaceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<any[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [activeSources, setActiveSources] = useState(0);
  const [aiProcessingActive, setAiProcessingActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');
  const [isLoading, setIsLoading] = useState(true);

  const performEmergencyActivation = async () => {
    try {
      console.log('🚨 EXECUTING EMERGENCY PLATFORM ACTIVATION');
      setIsLoading(true);
      
      await emergencyActivation.executeFullPlatformActivation();
      
      // Immediate data refresh after activation
      await fetchLiveData();
      
      toast.success('🚀 EMERGENCY ACTIVATION COMPLETE - Platform 100% Operational!');
      
    } catch (error) {
      console.error('Emergency activation failed:', error);
      toast.error('Emergency activation encountered issues - retrying...');
      setTimeout(() => performEmergencyActivation(), 2000);
    }
  };

  const fetchLiveData = async () => {
    try {
      console.log('📊 FETCHING LIVE MARKETPLACE DATA');
      
      // Get live coins from all verified sources
      const { data: liveCoins, error: coinsError } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(
            id,
            name,
            reputation,
            verified_dealer
          )
        `)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(2000); // Show up to 2000 live coins

      if (coinsError) {
        console.error('Error fetching live coins:', coinsError);
      } else {
        setCoins(liveCoins || []);
        setTotalCoins(liveCoins?.length || 0);
      }

      // Get activation status
      const status = await emergencyActivation.getActivationStatus();
      setActiveSources(status.activeSources);
      setAiProcessingActive(status.activeAICommands > 0);
      setSystemStatus(status.systemStatus);

      console.log(`📈 LIVE DATA: ${liveCoins?.length || 0} coins, ${status.activeSources} sources, Status: ${status.systemStatus}`);
      
    } catch (error) {
      console.error('Error fetching live marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchLiveData();
  };

  useEffect(() => {
    console.log('🚀 INITIALIZING LIVE PRODUCTION MARKETPLACE');
    
    // Perform emergency activation on component mount
    performEmergencyActivation();

    // Set up real-time subscription for live updates
    const coinsSubscription = supabase
      .channel('live-coins-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'coins'
      }, () => {
        fetchLiveData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(coinsSubscription);
    };
  }, []);

  const value: LiveMarketplaceData = {
    coins,
    totalCoins,
    activeSources,
    aiProcessingActive,
    systemStatus,
    isLoading,
    refreshData,
    performEmergencyActivation
  };

  return (
    <LiveMarketplaceContext.Provider value={value}>
      {children}
    </LiveMarketplaceContext.Provider>
  );
};

export default LiveMarketplaceDataProvider;
