
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coins, Users, Store, Database, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SampleDataSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [existingCoinsCount, setExistingCoinsCount] = useState<number>(0);

  React.useEffect(() => {
    const checkExistingCoins = async () => {
      try {
        const { count, error } = await supabase
          .from('coins')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setExistingCoinsCount(count || 0);
      } catch (error) {
        console.error('Error checking existing coins:', error);
      }
    };

    checkExistingCoins();
  }, []);

  const createProductionData = async () => {
    setIsCreating(true);
    try {
      // Only create if there are fewer than 5 coins in the database
      if (existingCoinsCount >= 5) {
        toast.error('Database already has sufficient coins. No sample data needed.');
        return;
      }

      // Create production-quality sample coins
      const productionCoins = [
        {
          name: '1921 Morgan Silver Dollar',
          year: 1921,
          country: 'United States',
          denomination: '1 Dollar',
          grade: 'MS-63',
          price: 85.00,
          rarity: 'common',
          composition: '90% Silver, 10% Copper',
          diameter: 38.1,
          weight: 26.73,
          mint: 'Philadelphia',
          description: 'Classic Morgan Dollar in excellent condition. Last year of regular production.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'american' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: '1964 Kennedy Half Dollar',
          year: 1964,
          country: 'United States',
          denomination: '50 Cents',
          grade: 'AU-58',
          price: 25.00,
          rarity: 'common',
          composition: '90% Silver, 10% Copper',
          diameter: 30.6,
          weight: 12.5,
          mint: 'Philadelphia',
          description: 'First year Kennedy Half Dollar in silver. Uncirculated condition.',
          image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: false,
          category: 'american' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: '1893-S Morgan Dollar',
          year: 1893,
          country: 'United States',
          denomination: '1 Dollar',
          grade: 'MS-65',
          price: 3500.00,
          rarity: 'rare',
          composition: '90% Silver, 10% Copper',
          diameter: 38.1,
          weight: 26.73,
          mint: 'San Francisco',
          description: 'Key date Morgan Dollar in superb gem condition.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'american' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      ];

      // Insert the production coins
      const { error: coinsError } = await supabase
        .from('coins')
        .insert(productionCoins);

      if (coinsError) {
        throw new Error(`Failed to create production data: ${coinsError.message}`);
      }

      setExistingCoinsCount(existingCoinsCount + productionCoins.length);
      toast.success(`Created ${productionCoins.length} production-quality coin listings.`);
    } catch (error: any) {
      console.error('Error creating production data:', error);
      toast.error(`Failed to create production data: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Production Data Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingCoinsCount >= 5 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Database already contains {existingCoinsCount} coins. The platform has sufficient data for production use.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <p className="text-gray-600">
              Create production-quality coin listings to populate the platform. Current coins: {existingCoinsCount}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Quality Coins</p>
              </div>
              <div className="text-center">
                <Store className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Real Categories</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Verified Data</p>
              </div>
              <div className="text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">Production Ready</p>
              </div>
            </div>

            <Button 
              onClick={createProductionData}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? 'Creating Production Data...' : 'Create Production-Quality Data'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SampleDataSetup;
