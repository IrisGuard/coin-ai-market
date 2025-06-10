
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminDataValidator = () => {
  const [testDataDetected, setTestDataDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [testDataCount, setTestDataCount] = useState(0);
  
  useEffect(() => {
    const checkForTestData = async () => {
      try {
        // Check for test/demo data patterns in coins
        const { data: coins, error } = await supabase
          .from('coins')
          .select('id, name, description')
          .or('name.ilike.%test%,name.ilike.%demo%,name.ilike.%sample%,name.ilike.%example%,description.ilike.%test%,description.ilike.%demo%');
        
        if (error) {
          console.error('Error checking for test data:', error);
          setIsChecking(false);
          return;
        }
        
        const hasTestData = coins && coins.length > 0;
        setTestDataDetected(hasTestData);
        setTestDataCount(coins?.length || 0);
      } catch (error) {
        console.error('Error checking for test data:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkForTestData();
  }, []);

  const removeTestData = async () => {
    setIsRemoving(true);
    try {
      // Remove test coins
      const { error: coinsError } = await supabase
        .from('coins')
        .delete()
        .or('name.ilike.%test%,name.ilike.%demo%,name.ilike.%sample%,name.ilike.%example%');
      
      if (coinsError) throw coinsError;

      // Remove related bids for deleted coins
      const { error: bidsError } = await supabase
        .from('bids')
        .delete()
        .in('coin_id', []); // Will be handled by foreign key cascade
      
      if (bidsError && !bidsError.message.includes('foreign key')) {
        console.warn('Error removing test bids:', bidsError);
      }

      toast({ 
        title: "Test data removed successfully",
        description: `Removed ${testDataCount} test items from the system.`
      });
      setTestDataDetected(false);
      setTestDataCount(0);
    } catch (error) {
      console.error('Error removing test data:', error);
      toast({ 
        title: "Error removing test data",
        description: "There was an issue removing the test data. Please try again.",
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
        Checking for test data...
      </div>
    );
  }

  if (testDataDetected) {
    return (
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Test Data Detected ({testDataCount} items)</AlertTitle>
        <AlertDescription className="mt-2">
          The system has detected test or demo data. Remove it before going live to ensure a professional user experience.
          <Button 
            onClick={removeTestData} 
            disabled={isRemoving}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isRemoving ? 'Removing...' : `Remove ${testDataCount} Test Items`}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mb-4 border-green-500 bg-green-50">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Production Ready</AlertTitle>
      <AlertDescription>
        No test data detected. The system is ready for production use.
      </AlertDescription>
    </Alert>
  );
};

export default AdminDataValidator;
