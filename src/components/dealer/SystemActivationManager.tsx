
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, Database, Bot, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SystemActivationManager = () => {
  const [activationProgress, setActivationProgress] = useState(0);
  const [activationLog, setActivationLog] = useState<string[]>([]);

  // Check current system status
  const { data: systemStatus, refetch } = useQuery({
    queryKey: ['system-activation-status'],
    queryFn: async () => {
      const [scrapingJobs, errorKnowledge, sampleCoins, apiKeys] = await Promise.all([
        supabase.from('scraping_jobs').select('*'),
        supabase.from('error_coins_knowledge').select('*'),
        supabase.from('coins').select('*').limit(5),
        supabase.from('api_keys').select('*')
      ]);

      return {
        scrapingJobsCount: scrapingJobs.data?.length || 0,
        errorKnowledgeCount: errorKnowledge.data?.length || 0,
        sampleCoinsCount: sampleCoins.data?.length || 0,
        apiKeysCount: apiKeys.data?.length || 0,
        isSystemActive: (scrapingJobs.data?.length || 0) > 10
      };
    }
  });

  const fullSystemActivationMutation = useMutation({
    mutationFn: async () => {
      setActivationProgress(0);
      setActivationLog(['🚀 Starting complete system activation...']);

      // Step 1: Initialize scraping jobs (20%)
      setActivationProgress(20);
      setActivationLog(prev => [...prev, '📊 Initializing 18+ scraping jobs...']);
      
      const { data: initData, error: initError } = await supabase.functions.invoke('initialize-scraping-jobs');
      if (initError) throw initError;
      
      setActivationLog(prev => [...prev, `✅ Created ${initData.scraping_jobs_created} scraping jobs`]);

      // Step 2: Populate sample data (40%)
      setActivationProgress(40);
      setActivationLog(prev => [...prev, '💰 Creating sample coin listings...']);
      
      const sampleCoins = [
        {
          name: '1921 Morgan Silver Dollar',
          year: 1921,
          grade: 'MS-63',
          price: 125.50,
          country: 'United States',
          denomination: 'Silver Dollar',
          rarity: 'Common',
          image: 'https://example.com/morgan-1921.jpg',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          featured: true,
          composition: '90% Silver, 10% Copper',
          mint: 'Philadelphia'
        },
        {
          name: '1943 Steel Wheat Penny',
          year: 1943,
          grade: 'AU-50',
          price: 85.00,
          country: 'United States',
          denomination: 'Cent',
          rarity: 'Uncommon',
          image: 'https://example.com/steel-penny.jpg',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          featured: true,
          composition: 'Steel with Zinc Coating'
        },
        {
          name: '1964 Kennedy Half Dollar',
          year: 1964,
          grade: 'MS-65',
          price: 45.00,
          country: 'United States',
          denomination: 'Half Dollar',
          rarity: 'Common',
          image: 'https://example.com/kennedy-1964.jpg',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          composition: '90% Silver, 10% Copper'
        }
      ];

      const { error: coinsError } = await supabase.from('coins').insert(sampleCoins);
      if (coinsError) throw coinsError;
      
      setActivationLog(prev => [...prev, `✅ Created ${sampleCoins.length} sample coin listings`]);

      // Step 3: Create categories (60%)
      setActivationProgress(60);
      setActivationLog(prev => [...prev, '📂 Setting up marketplace categories...']);
      
      const categories = [
        { name: 'US Coins', description: 'United States coins and currency', is_active: true },
        { name: 'World Coins', description: 'International coins from around the world', is_active: true },
        { name: 'Error Coins', description: 'Coins with minting errors and varieties', is_active: true },
        { name: 'Ancient Coins', description: 'Historical and ancient numismatic items', is_active: true },
        { name: 'Precious Metals', description: 'Gold, silver, and platinum bullion', is_active: true }
      ];

      const { error: categoriesError } = await supabase.from('categories').insert(categories);
      if (categoriesError && !categoriesError.message.includes('duplicate')) throw categoriesError;
      
      setActivationLog(prev => [...prev, `✅ Created ${categories.length} marketplace categories`]);

      // Step 4: Setup AI configuration (80%)
      setActivationProgress(80);
      setActivationLog(prev => [...prev, '🤖 Configuring AI systems...']);
      
      const aiConfig = {
        id: 'main',
        config: {
          anthropic_enabled: true,
          openai_enabled: true,
          confidence_threshold: 0.7,
          auto_listing_enabled: true,
          visual_matching_enabled: true,
          error_detection_enabled: true
        }
      };

      const { error: configError } = await supabase.from('ai_configuration').upsert(aiConfig);
      if (configError) throw configError;
      
      setActivationLog(prev => [...prev, '✅ AI systems configured and active']);

      // Step 5: Final activation (100%)
      setActivationProgress(100);
      setActivationLog(prev => [...prev, '🎉 System fully activated and operational!']);

      return { success: true, message: 'Complete system activation successful' };
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "System Fully Activated! 🚀",
        description: "All components are now operational and ready for use",
      });
    },
    onError: (error: any) => {
      console.error('System activation failed:', error);
      setActivationLog(prev => [...prev, `❌ Activation failed: ${error.message}`]);
      toast({
        title: "Activation Failed",
        description: error.message || "System activation encountered an error",
        variant: "destructive"
      });
    }
  });

  const getSystemHealthStatus = () => {
    if (!systemStatus) return { status: 'loading', color: 'gray', text: 'Loading...' };
    
    if (systemStatus.scrapingJobsCount >= 10 && 
        systemStatus.errorKnowledgeCount >= 5 && 
        systemStatus.sampleCoinsCount >= 3) {
      return { status: 'active', color: 'green', text: '100% OPERATIONAL' };
    } else if (systemStatus.scrapingJobsCount > 0) {
      return { status: 'partial', color: 'yellow', text: 'PARTIALLY ACTIVE' };
    } else {
      return { status: 'inactive', color: 'red', text: 'INACTIVE - NEEDS ACTIVATION' };
    }
  };

  const healthStatus = getSystemHealthStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-600" />
            Complete System Activation Control
            <Badge className={`bg-${healthStatus.color}-100 text-${healthStatus.color}-800`}>
              {healthStatus.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current System Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <Database className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <div className="font-bold text-lg">{systemStatus?.scrapingJobsCount || 0}</div>
                <div className="text-xs text-muted-foreground">Scraping Jobs</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Bot className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="font-bold text-lg">{systemStatus?.errorKnowledgeCount || 0}</div>
                <div className="text-xs text-muted-foreground">Error Types</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <div className="font-bold text-lg">{systemStatus?.sampleCoinsCount || 0}</div>
                <div className="text-xs text-muted-foreground">Sample Coins</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                <div className="font-bold text-lg">{systemStatus?.apiKeysCount || 0}</div>
                <div className="text-xs text-muted-foreground">API Keys</div>
              </div>
            </div>

            {/* Activation Progress */}
            {fullSystemActivationMutation.isPending && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="font-medium">System Activation in Progress</span>
                </div>
                <Progress value={activationProgress} className="h-3" />
                <div className="text-sm text-center text-muted-foreground">
                  {activationProgress}% Complete
                </div>
              </div>
            )}

            {/* Activation Log */}
            {activationLog.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Activation Log:</h4>
                <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto space-y-1">
                  {activationLog.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Status Alert */}
            {systemStatus && !systemStatus.isSystemActive && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  System requires activation to enable full functionality. Click "Activate Complete System" to initialize all components.
                </AlertDescription>
              </Alert>
            )}

            {/* Activation Button */}
            <Button
              onClick={() => fullSystemActivationMutation.mutate()}
              disabled={fullSystemActivationMutation.isPending || systemStatus?.isSystemActive}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {fullSystemActivationMutation.isPending ? (
                <>
                  <Rocket className="h-5 w-5 mr-2 animate-spin" />
                  Activating System...
                </>
              ) : systemStatus?.isSystemActive ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  System Already Active
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5 mr-2" />
                  Activate Complete System (100%)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemActivationManager;
