
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useDealerUpgrade = (onClose: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user?.id) {
      console.error('❌ No user found for upgrade');
      return;
    }

    console.log('🔄 Starting dealer upgrade for user:', user.id);
    setIsLoading(true);
    
    try {
      // Update user role in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'dealer' })
        .eq('id', user.id);

      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        throw profileError;
      }

      // Update user role in user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'dealer'
        });

      if (roleError) {
        console.error('❌ Role update error:', roleError);
        throw roleError;
      }

      // Create store for the new dealer
      const storeName = `${user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}'s Store`;
      
      const { error: storeError } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: storeName,
          description: 'Welcome to my coin store!',
          is_active: true,
          verified: false
        });

      if (storeError) {
        console.error('❌ Store creation error:', storeError);
        throw storeError;
      }

      console.log('✅ Dealer upgrade successful');
      
      toast({
        title: "Welcome to CoinAI Dealers!",
        description: "Your account has been upgraded. Redirecting to your dealer panel...",
      });
      
      onClose();
      
      // Navigate to dealer panel
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Dealer upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: error.message || 'Failed to upgrade your account',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleUpgrade
  };
};
