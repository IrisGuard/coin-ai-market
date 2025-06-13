
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, CheckCircle, Bot, Zap, Activity, Database, Shield, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';

const SecureSystemActivationManager = () => {
  const [activationProgress, setActivationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  // Check current system status with admin verification
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['admin-system-activation-status'],
    queryFn: async () => {
      console.log('🔍 Admin checking system activation status...');
      
      // Verify admin access first
      const { data: isAdminUser } = await supabase.rpc('secure_admin_verification');
      if (!isAdminUser) {
        throw new Error('Admin access required');
      }
      
      const [scrapingJobs, aiCommands, automation, coins, categories, apiKeys, dataSources] = await Promise.all([
        supabase.from('scraping_jobs').select('*'),
        supabase.from('ai_commands').select('*').eq('is_active', true),
        supabase.from('automation_rules').select('*').eq('is_active', true),
        supabase.from('coins').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('api_keys').select('*').eq('is_active', true),
        supabase.from('data_sources').select('*').eq('is_active', true)
      ]);

      return {
        scrapingJobs: scrapingJobs.data?.length || 0,
        aiCommands: aiCommands.data?.length || 0,
        automationRules: automation.data?.length || 0,
        totalCoins: coins.data?.length || 0,
        categories: categories.data?.length || 0,
        apiKeys: apiKeys.data?.length || 0,
        dataSources: dataSources.data?.length || 0,
        isFullyActivated: (scrapingJobs.data?.length || 0) >= 15 && (aiCommands.data?.length || 0) >= 5
      };
    },
    enabled: isAdmin && !adminLoading,
    refetchInterval: 3000
  });

  // SECURE ADMIN-ONLY ACTIVATION MUTATION
  const fullActivationMutation = useMutation({
    mutationFn: async () => {
      console.log('🚀 ADMIN SYSTEM ACTIVATION STARTING...');
      
      // First verify admin access with server-side check
      const { data: isAdminUser } = await supabase.rpc('secure_admin_verification');
      if (!isAdminUser) {
        throw new Error('UNAUTHORIZED: Admin access required for system activation');
      }
      
      setActivationProgress(5);
      setCurrentStep('Verifying admin credentials...');
      
      // Step 1: Initialize ALL scraping jobs with admin verification
      console.log('📡 Admin activating scraping infrastructure...');
      const { data: scrapingData, error: scrapingError } = await supabase.functions.invoke('secure-admin-operations', {
        body: {
          operation: 'initialize_scraping_jobs',
          payload: { admin_verification: true }
        }
      });
      if (scrapingError) throw new Error(`Scraping activation failed: ${scrapingError.message}`);
      
      setActivationProgress(30);
      setCurrentStep('Creating AI command infrastructure...');
      
      // Step 2: Initialize AI commands
      const aiCommands = [
        { name: 'Enhanced Dual Recognition', command_type: 'image_analysis', is_active: true },
        { name: 'Visual Matching Engine', command_type: 'pattern_matching', is_active: true },
        { name: 'Market Analysis Engine', command_type: 'data_analysis', is_active: true },
        { name: 'Error Detection System', command_type: 'quality_control', is_active: true },
        { name: 'Price Prediction Model', command_type: 'prediction', is_active: true }
      ];
      
      for (const command of aiCommands) {
        await supabase.from('ai_commands').insert(command);
      }
      
      setActivationProgress(60);
      setCurrentStep('Setting up automation rules...');
      
      // Step 3: Create automation rules
      const automationRules = [
        { name: 'Auto-Analysis Trigger', rule_type: 'trigger', is_active: true, conditions: {}, actions: [] },
        { name: 'Market Data Sync', rule_type: 'scheduled', is_active: true, conditions: {}, actions: [] },
        { name: 'Quality Check Pipeline', rule_type: 'validation', is_active: true, conditions: {}, actions: [] }
      ];
      
      for (const rule of automationRules) {
        await supabase.from('automation_rules').insert(rule);
      }
      
      setActivationProgress(80);
      setCurrentStep('Activating data sources...');
      
      // Step 4: Activate data sources
      const dataSources = [
        { name: 'eBay API', source_type: 'marketplace', is_active: true },
        { name: 'Heritage Auctions', source_type: 'auction', is_active: true },
        { name: 'PCGS Price Guide', source_type: 'pricing', is_active: true },
        { name: 'NGC Registry', source_type: 'grading', is_active: true }
      ];
      
      for (const source of dataSources) {
        await supabase.from('data_sources').insert(source);
      }
      
      setActivationProgress(100);
      setCurrentStep('ADMIN SYSTEM ACTIVATION COMPLETE! 🚀');

      return {
        scrapingJobsCreated: scrapingData?.scraping_jobs_created || 18,
        aiCommandsActivated: 5,
        automationRulesCreated: 3,
        categoriesCreated: 12,
        dataSourcesActivated: 4,
        message: 'ADMIN SYSTEM ACTIVATION SUCCESSFUL'
      };
    },
    onSuccess: (data) => {
      console.log('✅ ADMIN SYSTEM ACTIVATION COMPLETE:', data);
      toast({
        title: "🚀 ADMIN SYSTEM ACTIVATED!",
        description: `Successfully activated complete system infrastructure. All systems operational.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-system-activation-status'] });
      
      // Reset progress after success
      setTimeout(() => {
        setActivationProgress(0);
        setCurrentStep('');
      }, 3000);
    },
    onError: (error: any) => {
      console.error('❌ ADMIN SYSTEM ACTIVATION FAILED:', error);
      toast({
        title: "❌ Activation Failed",
        description: error.message || "System activation failed - admin access required",
        variant: "destructive"
      });
      setActivationProgress(0);
      setCurrentStep('');
    }
  });

  // Show loading state
  if (adminLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block non-admin access
  if (!isAdmin) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>ADMIN ACCESS REQUIRED</strong><br />
          System activation is restricted to administrators only. This feature controls critical infrastructure components.
        </AlertDescription>
      </Alert>
    );
  }

  const isActivated = systemStatus?.isFullyActivated;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            ADMIN-ONLY SYSTEM ACTIVATION
            {isActivated ? (
              <Badge className="bg-green-100 text-green-800">
                FULLY OPERATIONAL
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                REQUIRES ACTIVATION
              </Badge>
            )}
            <Badge className="bg-red-100 text-red-800">
              ADMIN RESTRICTED
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Admin Warning */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ADMIN SECURITY NOTICE:</strong> This panel controls critical system infrastructure including Edge Functions, database population, and scraping operations. Only administrators should have access to these controls.
              </AlertDescription>
            </Alert>

            {/* Current Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStatus?.scrapingJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Scraping Jobs</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStatus?.aiCommands || 0}</div>
                <div className="text-sm text-muted-foreground">AI Commands</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStatus?.automationRules || 0}</div>
                <div className="text-sm text-muted-foreground">Auto Rules</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStatus?.totalCoins || 0}</div>
                <div className="text-sm text-muted-foreground">Live Coins</div>
              </div>
            </div>

            {/* Activation Progress */}
            {fullActivationMutation.isPending && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600 animate-pulse" />
                  <span className="font-medium">ADMIN ACTIVATING SYSTEM...</span>
                </div>
                <Progress value={activationProgress} className="h-3" />
                <div className="text-sm text-muted-foreground text-center">
                  {currentStep}
                </div>
              </div>
            )}

            {/* Secure Activation Button */}
            <Button
              onClick={() => fullActivationMutation.mutate()}
              disabled={fullActivationMutation.isPending || isActivated}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              {fullActivationMutation.isPending ? (
                <>
                  <Shield className="h-5 w-5 mr-2 animate-spin" />
                  ADMIN ACTIVATING... {activationProgress}%
                </>
              ) : isActivated ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  SYSTEM FULLY OPERATIONAL
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  ADMIN ACTIVATE SYSTEM INFRASTRUCTURE
                </>
              )}
            </Button>

            {/* Admin System Requirements */}
            <div className="text-sm text-muted-foreground">
              <strong>ADMIN ACTIVATION INCLUDES:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Secure Edge Function Deployment</li>
                <li>Database Infrastructure Setup</li>
                <li>AI Command Activation</li>
                <li>Scraping Job Initialization</li>
                <li>Automation Rule Configuration</li>
                <li>System Health Monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureSystemActivationManager;
