
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
      // Create anonymous sample coins that don't require user authentication
      const sampleCoins = [
        {
          name: '1921 Morgan Silver Dollar',
          year: 1921,
          country: 'United States',
          denomination: '1 Dollar',
          grade: 'MS-63',
          price: 85.00,
          rarity: 'Common',
          composition: '90% Silver, 10% Copper',
          diameter: 38.1,
          weight: 26.73,
          mint: 'Philadelphia',
          description: 'Classic Morgan Dollar in excellent condition. Last year of regular production.',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'modern',
          user_id: '00000000-0000-0000-0000-000000000000' // Placeholder user ID
        },
        {
          name: '1909-S VDB Lincoln Cent',
          year: 1909,
          country: 'United States',
          denomination: '1 Cent',
          grade: 'VF-30',
          price: 750.00,
          rarity: 'rare',
          composition: '95% Copper, 5% Tin and Zinc',
          diameter: 19.05,
          weight: 3.11,
          mint: 'San Francisco',
          description: 'Key date Lincoln cent with designer initials. Highly sought after by collectors.',
          image: 'https://images.unsplash.com/photo-1635976681340-1e0d33fb93b1?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: true,
          category: 'modern',
          user_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: '1964 Kennedy Half Dollar',
          year: 1964,
          country: 'United States',
          denomination: '50 Cents',
          grade: 'AU-58',
          price: 25.00,
          rarity: 'Common',
          composition: '90% Silver, 10% Copper',
          diameter: 30.6,
          weight: 12.5,
          mint: 'Philadelphia',
          description: 'First year Kennedy Half Dollar in silver. Nice uncirculated condition.',
          image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
          authentication_status: 'verified',
          featured: false,
          category: 'modern',
          user_id: '00000000-0000-0000-0000-000000000000'
        },
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
          category: 'ancient',
          user_id: '00000000-0000-0000-0000-000000000000'
        },
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
          category: 'error_coin',
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

      // Create AI recognition cache entries
      const cacheEntries = [
        {
          image_hash: 'hash_morgan_1921',
          recognition_results: {
            name: "1921 Morgan Silver Dollar",
            year: 1921,
            grade: "MS-63",
            composition: "90% Silver",
            estimated_value: 85,
            country: "United States",
            mint: "Philadelphia",
            rarity: "Common",
            authentication_confidence: 0.92
          },
          confidence_score: 0.92,
          processing_time_ms: 2400,
          sources_consulted: ['numista', 'pcgs', 'heritage']
        },
        {
          image_hash: 'hash_lincoln_1909svdb',
          recognition_results: {
            name: "1909-S VDB Lincoln Cent",
            year: 1909,
            grade: "VF-30",
            composition: "95% Copper",
            estimated_value: 750,
            country: "United States",
            mint: "San Francisco",
            rarity: "Key Date",
            authentication_confidence: 0.88
          },
          confidence_score: 0.88,
          processing_time_ms: 3200,
          sources_consulted: ['pcgs', 'ngc', 'heritage']
        }
      ];

      const { error: cacheError } = await supabase
        .from('ai_recognition_cache')
        .insert(cacheEntries);

      if (cacheError) {
        console.warn('Failed to create AI cache entries:', cacheError);
      }

      // Create marketplace stats
      const { error: statsError } = await supabase
        .from('marketplace_stats')
        .insert({
          listed_coins: 5,
          active_auctions: 2,
          registered_users: 0,
          weekly_transactions: 3,
          total_volume: 2505.00
        });

      if (statsError) {
        console.warn('Failed to create marketplace stats:', statsError);
      }

      // Create error coins knowledge
      const errorCoinsKnowledge = [
        {
          error_name: 'Doubled Die Obverse',
          error_type: 'Die Error',
          error_category: 'Production Error',
          description: 'Doubling occurs when the die is impressed multiple times with slight misalignment',
          severity_level: 8,
          rarity_score: 9,
          identification_techniques: ['Look for doubled lettering', 'Check date area', 'Examine under magnification'],
          common_mistakes: ['Confusing with machine doubling', 'Missing slight doubling varieties'],
          ai_detection_markers: {
            text_doubling: true,
            date_emphasis: true,
            letter_separation: true
          }
        },
        {
          error_name: 'Off-Center Strike',
          error_type: 'Strike Error',
          error_category: 'Minting Error',
          description: 'Coin struck when planchet was not properly centered in the collar',
          severity_level: 6,
          rarity_score: 7,
          identification_techniques: ['Measure percentage off-center', 'Check for complete date visibility', 'Look for collar marks'],
          common_mistakes: ['Confusing with clipped planchets', 'Overstating off-center percentage'],
          ai_detection_markers: {
            border_analysis: true,
            date_visibility: true,
            collar_marks: false
          }
        }
      ];

      const { error: knowledgeError } = await supabase
        .from('error_coins_knowledge')
        .insert(errorCoinsKnowledge);

      if (knowledgeError) {
        console.warn('Failed to create error coins knowledge:', knowledgeError);
      }

      toast.success('Sample data created successfully! The platform now has working data.');
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
          Create sample coins and data to make the platform functional for testing.
          This will populate the database with realistic coin data.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">5 Sample Coins</p>
          </div>
          <div className="text-center">
            <Store className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">AI Cache Data</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Market Stats</p>
          </div>
          <div className="text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium">Error Knowledge</p>
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
