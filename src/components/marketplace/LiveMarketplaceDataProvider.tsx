
import React, { createContext, useContext, useState, useEffect } from 'react';
import { emergencyActivation } from '@/services/emergencyActivationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveMarketplaceContextType {
  coins: any[];
  totalCoins: number;
  activeSources: number;
  aiProcessingActive: boolean;
  systemStatus: string;
  isLoading: boolean;
  refreshData: () => void;
  performEmergencyActivation: () => void;
}

const LiveMarketplaceContext = createContext<LiveMarketplaceContextType | undefined>(undefined);

export const LiveMarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<any[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [activeSources, setActiveSources] = useState(0);
  const [aiProcessingActive, setAiProcessingActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ACTIVATING');
  const [isLoading, setIsLoading] = useState(true);

  const loadMarketplaceData = async () => {
    try {
      // Get activation status
      const status = await emergencyActivation.getActivationStatus();
      setActiveSources(status.activeSources);
      setTotalCoins(status.totalCoins);
      setSystemStatus(status.systemStatus);
      setAiProcessingActive(status.activeAICommands > 0);

      // Load coins for display
      const { data: coinsData } = await supabase
        .from('coins')
        .select('*')
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(100);

      setCoins(coinsData || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      setIsLoading(false);
    }
  };

  const performEmergencyActivation = async () => {
    try {
      setIsLoading(true);
      toast.info('🚨 Emergency Full Platform Activation Initiated...');
      
      await emergencyActivation.executeFullPlatformActivation();
      
      // Wait for activation to complete then reload data
      setTimeout(async () => {
        await loadMarketplaceData();
        toast.success('🚀 Platform Fully Activated - All Systems Operational');
      }, 3000);
    } catch (error) {
      console.error('Emergency activation failed:', error);
      toast.error('Activation failed, but systems may still be operational');
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadMarketplaceData();
  };

  useEffect(() => {
    loadMarketplaceData();
    
    // Auto-trigger emergency activation if system needs it
    const checkAndActivate = async () => {
      const status = await emergencyActivation.getActivationStatus();
      if (status.totalCoins < 50 || status.activeSources < 10) {
        console.log('🚨 Auto-triggering emergency activation for low data count');
        setTimeout(performEmergencyActivation, 2000);
      }
    };
    
    checkAndActivate();
  }, []);

  const value = {
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

export const useLiveMarketplace = () => {
  const context = useContext(LiveMarketplaceContext);
  if (context === undefined) {
    throw new Error('useLiveMarketplace must be used within a LiveMarketplaceProvider');
  }
  return context;
};
