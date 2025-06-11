
import React from 'react';
import { Shield, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanelHeader = () => {
  console.log('🏷️ AdminPanelHeader rendering...');
  
  try {
    const { user } = useAuth();
    console.log('✅ AdminPanelHeader: got user data', { userEmail: user?.email });

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">
                Comprehensive system administration and management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Logged in as: {user?.email || 'Unknown'}</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('💥 Error in AdminPanelHeader:', error);
    
    // Fallback header
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminPanelHeader;
