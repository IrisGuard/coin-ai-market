
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore, useCreateStore } from '@/hooks/useAuthStore';
import { Loader2 } from 'lucide-react';

const AuthSuccessHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: store, isLoading: storeLoading } = useUserStore();
  const createStore = useCreateStore();

  useEffect(() => {
    if (!user) return;

    // If user has no store, create one
    if (!storeLoading && !store && !createStore.isPending) {
      createStore.mutate();
    }

    // If user has a store, redirect to dashboard
    if (store && !createStore.isPending) {
      navigate('/dashboard');
    }
  }, [user, store, storeLoading, createStore, navigate]);

  if (storeLoading || createStore.isPending) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-electric-blue" />
          <span className="text-electric-blue">Setting up your store...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSuccessHandler;
