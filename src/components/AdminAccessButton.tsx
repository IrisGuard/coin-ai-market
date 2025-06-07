
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Settings } from 'lucide-react';
import AdminPanel from './admin/AdminPanel';
import { useAuth } from '@/contexts/AuthContext';

const AdminAccessButton = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user } = useAuth();

  // For demo purposes, allow any authenticated user to access admin
  // In production, this should check proper admin roles
  const canAccess = !!user;

  if (!canAccess) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowAdminPanel(true)}
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
      >
        <Shield className="w-4 h-4" />
        Admin Panel
      </Button>

      <Button
        onClick={() => setShowAdminPanel(true)}
        variant="outline"
        size="sm"
        className="md:hidden"
      >
        <Settings className="w-4 h-4" />
      </Button>

      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </>
  );
};

export default AdminAccessButton;
