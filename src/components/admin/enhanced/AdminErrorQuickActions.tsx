
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  RefreshCw, 
  Download,
  BookOpen,
  DollarSign,
  Brain,
  Database
} from 'lucide-react';

interface AdminErrorQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const AdminErrorQuickActions = ({ onTabChange }: AdminErrorQuickActionsProps) => {
  const quickActions = [
    {
      title: 'Add Knowledge Entry',
      description: 'Create new error coin knowledge entry',
      icon: Plus,
      action: () => onTabChange('knowledge'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Import Market Data',
      description: 'Bulk import market pricing data',
      icon: Upload,
      action: () => onTabChange('market'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Refresh AI Training',
      description: 'Update AI model with latest data',
      icon: Brain,
      action: () => console.log('Refresh AI training'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Export Database',
      description: 'Download complete knowledge base',
      icon: Download,
      action: () => console.log('Export database'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all"
              onClick={action.action}
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminErrorQuickActions;
