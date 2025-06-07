
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardEnhanced from '@/components/dashboard/DashboardEnhanced';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <DashboardEnhanced />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
