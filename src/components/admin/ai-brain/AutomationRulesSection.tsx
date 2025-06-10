
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Play, Pause } from 'lucide-react';

const AutomationRulesSection = () => {
  const queryClient = useQueryClient();

  // Get Automation Rules
  const { data: automationRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Toggle Automation Rule
  const toggleRule = useMutation({
    mutationFn: async ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Rule Updated",
        description: "Automation rule status has been updated.",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rulesLoading ? (
            <div className="text-center py-8">Loading automation rules...</div>
          ) : automationRules?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No automation rules found
            </div>
          ) : (
            automationRules?.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-muted-foreground">{rule.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{rule.rule_type}</Badge>
                    <Badge variant="outline">Executed: {rule.execution_count || 0}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRule.mutate({ ruleId: rule.id, isActive: rule.is_active })}
                    disabled={toggleRule.isPending}
                  >
                    {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {rule.is_active ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationRulesSection;
