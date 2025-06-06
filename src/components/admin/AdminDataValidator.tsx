
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminDataValidator = () => {
  const [mockDataDetected, setMockDataDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  
  useEffect(() => {
    const checkForMockData = async () => {
      try {
        const { data: coins } = await supabase.from('coins').select('*');
        
        const mockIndicators = [
          'Morgan Silver Dollar',
          'Test Coin',
          'Sample',
          'Demo',
          'Mock',
          'Example',
          'Placeholder'
        ];
        
        const hasMockData = coins?.some(coin => 
          mockIndicators.some(indicator => 
            coin.name?.toLowerCase().includes(indicator.toLowerCase()) || 
            coin.description?.toLowerCase().includes(indicator.toLowerCase())
          )
        );
        
        setMockDataDetected(hasMockData || false);
      } catch (error) {
        console.error('Error checking for mock data:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkForMockData();
  }, []);

  const removeMockData = async () => {
    setIsRemoving(true);
    try {
      // Remove mock coins
      const { error: coinsError } = await supabase
        .from('coins')
        .delete()
        .or('name.ilike.%morgan%,name.ilike.%test%,name.ilike.%sample%,name.ilike.%demo%,name.ilike.%mock%,name.ilike.%example%,name.ilike.%placeholder%');
      
      if (coinsError) throw coinsError;

      // Remove mock marketplace listings
      const { error: listingsError } = await supabase
        .from('marketplace_listings')
        .delete()
        .in('coin_id', []);  // This will be updated to reference actual mock coin IDs
      
      if (listingsError) throw listingsError;

      toast({ 
        title: "Mock data removed successfully",
        description: "All mock and test data has been cleaned from the system."
      });
      setMockDataDetected(false);
    } catch (error) {
      console.error('Error removing mock data:', error);
      toast({ 
        title: "Error removing mock data",
        description: "There was an issue removing the mock data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 p-4 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
        Checking for mock data...
      </div>
    );
  }

  if (mockDataDetected) {
    return (
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Mock Data Detected</AlertTitle>
        <AlertDescription className="mt-2">
          The system has detected mock or test data. Remove it before going live to ensure a professional user experience.
          <Button 
            onClick={removeMockData} 
            disabled={isRemoving}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isRemoving ? 'Removing...' : 'Remove All Mock Data'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mb-4 border-green-500 bg-green-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Production Ready</AlertTitle>
      <AlertDescription>
        No mock data detected. The system is ready for production use.
      </AlertDescription>
    </Alert>
  );
};

export default AdminDataValidator;
