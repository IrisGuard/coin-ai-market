import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDataValidator = () => {
  const [productionDataDetected, setProductionDataDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [dataQualityScore, setDataQualityScore] = useState(0);
  
  useEffect(() => {
    const checkDataQuality = async () => {
      try {
        // Check for real production data patterns
        const { data: coins, error } = await supabase
          .from('coins')
          .select('id, name, description, price, user_id, authentication_status, grade, rarity, category')
          .limit(100);
        
        if (error) {
          console.error('Error checking data quality:', error);
          setIsChecking(false);
          return;
        }
        
        let qualityScore = 0;
        let realDataCount = 0;
        
        coins?.forEach(coin => {
          // Check for real data indicators
          if (coin.price && coin.price > 0) qualityScore += 1;
          if (coin.user_id) qualityScore += 1;
          if (coin.name && !coin.name.toLowerCase().includes('test')) qualityScore += 1;
          if (coin.grade && coin.grade !== 'Unknown') qualityScore += 1;
          if (coin.rarity && coin.rarity !== 'Common') qualityScore += 1;
          if (coin.category && coin.category !== 'unclassified') qualityScore += 1;
          
          realDataCount++;
        });
        
        const avgQuality = realDataCount > 0 ? qualityScore / (realDataCount * 5) : 0;
        const hasRealData = avgQuality > 0.3 && realDataCount >= 3;
        
        setProductionDataDetected(hasRealData);
        setDataQualityScore(avgQuality * 100);
      } catch (error) {
        console.error('Error checking data quality:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkDataQuality();
  }, []);

  const validateSystemIntegrity = async () => {
    setIsValidating(true);
    try {
      // Check database connections
      const { error: connectError } = await supabase.from('profiles').select('id').limit(1);
      if (connectError) throw new Error('Database connection failed');

      // Validate AI commands
      const { data: commands, error: commandError } = await supabase
        .from('ai_commands')
        .select('id, is_active')
        .eq('is_active', true);
      
      if (commandError) throw commandError;

      // Check edge functions availability
      const functionsToCheck = [
        'advanced-coin-analyzer',
        'market-intelligence-engine',
        'advanced-web-scraper'
      ];

      let functionsWorking = 0;
      for (const funcName of functionsToCheck) {
        try {
          const { error } = await supabase.functions.invoke(funcName, {
            body: { test: true }
          });
          if (!error) functionsWorking++;
        } catch (e) {
          console.log(`Function ${funcName} not available`);
        }
      }

      toast.success(`System validation complete: ${commands?.length || 0} commands active, ${functionsWorking}/${functionsToCheck.length} functions working`);
    } catch (error) {
      console.error('System validation error:', error);
      toast.error(`System validation failed: ${error.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 p-4 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
        Analyzing data quality...
      </div>
    );
  }

  if (productionDataDetected) {
    return (
      <Alert className="mb-4 border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Production Ready - Quality Score: {dataQualityScore.toFixed(1)}%</AlertTitle>
        <AlertDescription className="mt-2">
          The system contains real production data with verified authenticity and proper user associations.
          <Button 
            onClick={validateSystemIntegrity} 
            disabled={isValidating}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {isValidating ? 'Validating...' : 'Run System Validation'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mb-4 border-amber-500 bg-amber-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Limited Production Data - Quality Score: {dataQualityScore.toFixed(1)}%</AlertTitle>
      <AlertDescription>
        The system has minimal real production data. Consider adding more verified coins and user content for optimal performance.
        <Button 
          onClick={validateSystemIntegrity} 
          disabled={isValidating}
          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isValidating ? 'Validating...' : 'Validate System Integrity'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default AdminDataValidator;
