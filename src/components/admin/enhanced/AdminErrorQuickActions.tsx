
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, DollarSign, Brain } from 'lucide-react';

interface AdminErrorQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const AdminErrorQuickActions = ({ onTabChange }: AdminErrorQuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange('knowledge')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Knowledge Base
          </CardTitle>
          <CardDescription>
            Manage technical identification guides and error classifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            View Knowledge Entries →
          </Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange('market')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Market Intelligence
          </CardTitle>
          <CardDescription>
            Track pricing trends and market values for error coins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            View Market Data →
          </Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Training
          </CardTitle>
          <CardDescription>
            Monitor and improve AI recognition accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Training Dashboard →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorQuickActions;
