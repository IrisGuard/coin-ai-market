
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Use left join to include all users even without roles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          stores(id, name, verified)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure all users have default values even without roles
      const usersWithDefaults = (data || []).map(user => ({
        ...user,
        user_roles: user.user_roles || [],
        stores: user.stores || [],
        verified_dealer: user.verified_dealer || false,
        role: user.role || 'user'
      }));
      
      return usersWithDefaults;
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-simple'] });
      toast({
        title: "Success",
        description: "User status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'moderator' | 'user' | 'dealer' | 'buyer' }) => {
      // Update user role in user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: role as 'admin' | 'moderator' | 'user' | 'dealer' | 'buyer'
        });
      
      if (roleError) throw roleError;

      // Also update profile role for consistency
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-simple'] });
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
