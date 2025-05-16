
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Define auth context state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  session: Session | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        
        // Get current session and user
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', profileError);
          }
          
          // Combine auth data with profile data
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: profileData?.avatar_url || null,
            created_at: profileData?.created_at || session.user.created_at,
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial session check
    getSession();
    
    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session && event === 'SIGNED_IN') {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata.avatar_url || null,
          created_at: session.user.created_at,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "Welcome back to CoinAI!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            name, 
            email,
            created_at: new Date().toISOString()
          }]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CoinAI! Please check your email to confirm your account.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      
      // Update auth metadata if name is provided
      if (updates.name) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { name: updates.name }
        });
        
        if (metadataError) throw metadataError;
      }
      
      // Update profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Update local user state
      setUser({ ...user, ...updates });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        signup, 
        logout,
        isAuthenticated: !!user,
        updateProfile,
        session
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
