
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coins, Users, Store, Database } from 'lucide-react';

const SampleDataSetup = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createSampleCoins = async () => {
    setIsCreating(true);
    try {
      // Sample coins using correct enum values from Supabase
      const sampleCoins = [
        // Ancient Coins
        {
          name: 'Roman Denarius - Emperor Trajan',
          year: 117,
          country: 'Roman Empire',
          denomination: 'Denarius',
          grade: 'VF-20',
          price: 450.00,
          rarity: 'rare',
          composition: 'Silver',
          diameter: 18.0,
          weight: 3.4,
          mint: 'Rome',
          description: 'Ancient Roman silver denarius featuring Emperor Trajan. Excellent historical significance.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'ancient' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: 'Greek Tetradrachm - Athens',
          year: 440,
          country: 'Ancient Greece',
          denomination: 'Tetradrachm',
          grade: 'F-15',
          price: 850.00,
          rarity: 'rare',
          composition: 'Silver',
          diameter: 24.0,
          weight: 17.2,
          mint: 'Athens',
          description: 'Classical Athenian owl tetradrachm, symbol of wisdom and prosperity.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: false,
          category: 'ancient' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        
        // Modern Coins (1900+)
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
          category: 'modern' as const,
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
          description: 'First year Kennedy Half Dollar in silver. Nice uncirculated condition.',
          image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: false,
          category: 'modern' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // Error Coins
        {
          name: '1955 Double Die Lincoln Cent',
          year: 1955,
          country: 'United States',
          denomination: '1 Cent',
          grade: 'AU-50',
          price: 1200.00,
          rarity: 'extremely_rare',
          composition: '95% Copper, 5% Tin and Zinc',
          diameter: 19.05,
          weight: 3.11,
          mint: 'Philadelphia',
          description: 'Famous doubled die error coin. Clear doubling visible on date and lettering.',
          image: 'https://images.unsplash.com/photo-1635976681340-1e0d33fb93b1?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'error_coin' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // American Coins
        {
          name: '1893-S Morgan Dollar PCGS MS65',
          year: 1893,
          country: 'United States',
          denomination: '1 Dollar',
          grade: 'MS-65',
          pcgs_grade: 'MS-65',
          price: 3500.00,
          rarity: 'rare',
          composition: '90% Silver, 10% Copper',
          diameter: 38.1,
          weight: 26.73,
          mint: 'San Francisco',
          description: 'Key date Morgan Dollar in superb gem condition, PCGS certified.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'american' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // European Coins
        {
          name: '1936 UK Crown - Edward VIII',
          year: 1936,
          country: 'United Kingdom',
          denomination: 'Crown',
          grade: 'EF-45',
          price: 2500.00,
          rarity: 'rare',
          composition: 'Silver',
          diameter: 38.61,
          weight: 28.28,
          mint: 'Royal Mint',
          description: 'Extremely rare Edward VIII crown, never officially released.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'european' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // Asian Coins
        {
          name: '1912 China Republic Dollar',
          year: 1912,
          country: 'China',
          denomination: '1 Dollar',
          grade: 'VF-25',
          price: 350.00,
          rarity: 'rare',
          composition: 'Silver',
          diameter: 39.0,
          weight: 26.9,
          mint: 'Various',
          description: 'Early Republic of China silver dollar with Yuan Shikai.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'asian' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // Gold Coins
        {
          name: '1986 American Gold Eagle 1oz',
          year: 1986,
          country: 'United States',
          denomination: '$50',
          grade: 'MS-69',
          price: 2100.00,
          rarity: 'common',
          composition: '91.67% Gold, 5.33% Copper, 3% Silver',
          diameter: 32.7,
          weight: 33.93,
          mint: 'US Mint',
          description: 'First year American Gold Eagle in near perfect condition.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'gold' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        },

        // Silver Coins
        {
          name: '1916 Walking Liberty Half Dollar',
          year: 1916,
          country: 'United States',
          denomination: '50 Cents',
          grade: 'VF-20',
          price: 85.00,
          rarity: 'common',
          composition: '90% Silver, 10% Copper',
          diameter: 30.6,
          weight: 12.5,
          mint: 'Philadelphia',
          description: 'First year of the beautiful Walking Liberty design.',
          image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: false,
          category: 'silver' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      ];

      // Insert the sample coins
      const { error: coinsError } = await supabase
        .from('coins')
        .insert(sampleCoins);

      if (coinsError) {
        throw new Error(`Failed to create sample coins: ${coinsError.message}`);
      }

      // Create auction coins
      const auctionCoins = [
        {
          name: '1892-S Morgan Dollar - AUCTION',
          year: 1892,
          country: 'United States',
          denomination: '1 Dollar',
          grade: 'VF-30',
          price: 125.00,
          starting_bid: 125.00,
          reserve_price: 200.00,
          rarity: 'rare',
          composition: '90% Silver, 10% Copper',
          is_auction: true,
          auction_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Key date Morgan Dollar in auction format.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'american' as const,
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      ];

      const { error: auctionError } = await supabase
        .from('coins')
        .insert(auctionCoins);

      if (auctionError) {
        console.warn('Failed to create auction coins:', auctionError);
      }

      toast.success('Sample data created successfully! All categories now have coins.');
    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast.error(`Failed to create sample data: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Sample Data Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Create sample coins for all categories to test the platform functionality.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">10+ Sample Coins</p>
          </div>
          <div className="text-center">
            <Store className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">All Categories</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Auctions</p>
          </div>
          <div className="text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium">Market Data</p>
          </div>
        </div>

        <Button 
          onClick={createSampleCoins}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Sample Data...' : 'Create Sample Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataSetup;
