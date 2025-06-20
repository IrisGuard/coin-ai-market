
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';

const DirectDealerButton = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();

  // Only show for authenticated users with dealer or admin role
  const shouldShowButton = user && !authLoading && !roleLoading && (userRole === 'dealer' || userRole === 'admin');

  // Hide the button if user is not authenticated or doesn't have proper role
  if (authLoading || roleLoading || !shouldShowButton) {
    return null;
  }

  const handleClick = () => {
    // Navigate to dealer panel, not admin panel
    navigate('/dealer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-3 z-50 transform hover:scale-105"
    >
      <div className="flex items-center gap-2">
        <Store className="w-6 h-6" />
        <Upload className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-bold text-lg">DEALER PANEL</span>
        <span className="text-sm opacity-90">Upload Coins</span>
      </div>
    </button>
  );
};

export default DirectDealerButton;
