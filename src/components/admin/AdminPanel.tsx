
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Database, BarChart3 } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  // This component should only be used within the admin page
  if (!isOpen) return null;

  const adminActions = [
    { icon: Users, title: 'User Management', description: 'Manage users and permissions' },
    { icon: Database, title: 'Database Admin', description: 'Database operations and maintenance' },
    { icon: BarChart3, title: 'Analytics', description: 'View platform analytics and reports' },
    { icon: Settings, title: 'System Settings', description: 'Configure system settings' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {adminActions.map((action) => (
        <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <action.icon className="w-5 h-5" />
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{action.description}</p>
            <Button variant="outline" size="sm">
              Access
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminPanel;
