
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle, Bot } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SystemInitializer = () => {
  const initializeSystemMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('initialize-scraping-jobs');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "System Initialized Successfully!",
        description: `Created ${data.scraping_jobs_created} scraping jobs and ${data.error_types_created} error types`,
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-blue-600" />
          System Initialization
          <Badge className="bg-green-100 text-green-800">Ready to Launch</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Initialize the complete system with 18+ active scraping jobs, error coin knowledge base, 
            and all required data for full operation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium">18+ Scraping Jobs</div>
              <div className="text-sm text-muted-foreground">eBay, Heritage, PCGS, NGC</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium">Error Knowledge Base</div>
              <div className="text-sm text-muted-foreground">5+ Error Types Defined</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Rocket className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium">Auto-Triggers</div>
              <div className="text-sm text-muted-foreground">Real-time Processing</div>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => initializeSystemMutation.mutate()}
            disabled={initializeSystemMutation.isPending}
          >
            {initializeSystemMutation.isPending ? (
              <>
                <Bot className="h-4 w-4 mr-2 animate-spin" />
                Initializing System...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Initialize Complete System
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInitializer;
