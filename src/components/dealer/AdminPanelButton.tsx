
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/contexts/AdminStoreContext';

const AdminPanelButton = () => {
  const navigate = useNavigate();
  const { isAdminUser } = useAdminStore();

  // Only show for admin users
  if (!isAdminUser) {
    return null;
  }

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  return (
    <Button
      onClick={handleGoToAdmin}
      className="fixed top-6 right-6 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-2 z-50 transform hover:scale-105"
    >
      <Shield className="w-5 h-5" />
      <Brain className="w-5 h-5" />
      <span className="font-bold">Go to Admin Panel</span>
    </Button>
  );
};

export default AdminPanelButton;
