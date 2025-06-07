
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

const AdminFloatingButtons = () => {
  const { isAdmin, isAdminAuthenticated } = useAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin && isAdminAuthenticated) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Admin Panel Button */}
        <Button
          onClick={handleAdminClick}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-3 rounded-lg"
          size="sm"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Admin Panel</span>
        </Button>

        {/* User Marketplace Panel Button */}
        <Link to="/marketplace/panel">
          <Button
            className="bg-electric-blue hover:bg-electric-purple text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-3 rounded-lg"
            size="sm"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">User Marketplace Panel</span>
          </Button>
        </Link>
      </div>

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />

      {/* Admin Login Modal */}
      <AdminLoginForm 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </>
  );
};

export default AdminFloatingButtons;
