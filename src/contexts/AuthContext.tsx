import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: { fullName: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  session: Session | null;
  signUp: (email: string, password: string, userData: { fullName: string; username: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  dealerSignup: (email: string, password: string, userData: { fullName: string; username: string }) => Promise<any>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔐 AuthProvider initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, {
          userId: session?.user?.id,
          userRole: session?.user?.user_metadata?.role,
          sessionValid: !!session
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle successful authentication
        if (event === 'SIGNED_IN' && session?.user) {
          const userRole = session.user.user_metadata?.role;
          console.log('✅ User signed in with role:', userRole);
          
          // Direct redirect for dealers after signup or login
          if (userRole === 'dealer') {
            console.log('📍 Redirecting dealer to /upload');
            setTimeout(() => {
              navigate('/upload');
            }, 100);
          } else if (window.location.pathname === '/auth') {
            // Only redirect buyers from auth page
            console.log('📍 Redirecting buyer to home');
            setTimeout(() => {
              navigate('/');
            }, 100);
          }
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setSession(null);
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          setLoading(false);
          return;
        }

        if (session) {
          console.log('✅ Found existing session:', {
            userId: session.user.id,
            userRole: session.user.user_metadata?.role
          });
          setSession(session);
          setUser(session.user);
        } else {
          console.log('ℹ️ No existing session found');
        }
      } catch (error) {
        console.error('❌ Failed to get session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    return () => {
      console.log('🔐 AuthProvider cleanup');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const dealerSignup = async (email: string, password: string, userData: { fullName: string; username: string }) => {
    console.log('🏪 Dealer signup initiated for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          name: userData.fullName,
          username: userData.username,
          role: 'dealer'
        }
      }
    });
    
    if (error) {
      console.error('❌ Dealer signup error:', error);
      return { data: null, error };
    }
    
    console.log('✅ Dealer signup successful:', {
      userId: data.user?.id,
      role: data.user?.user_metadata?.role
    });
    
    return { data, error: null };
  };

  const signUp = async (email: string, password: string, userData: { fullName: string; username: string }) => {
    console.log('📝 Attempting buyer signup for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          name: userData.fullName,
          username: userData.username,
          role: 'buyer'
        }
      }
    });
    
    if (error) {
      console.error('❌ Buyer signup error:', error);
      throw error;
    }
    
    console.log('✅ Buyer signup successful');
    return data;
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting signin for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Signin error:', error);
    } else {
      console.log('✅ Signin successful');
    }
    
    return { data, error };
  };

  // Legacy method aliases for backward compatibility
  const login = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) throw error;
  };

  const signup = async (email: string, password: string, userData: { fullName: string; username: string }) => {
    await signUp(email, password, userData);
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    
    // Clear ALL admin session data on logout
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminSessionTime');
    sessionStorage.removeItem('adminLastActivity');
    sessionStorage.removeItem('adminFingerprint');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
    
    console.log('✅ Logout successful');
    navigate('/');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    signUp,
    signIn,
    logout,
    resetPassword,
    updateProfile,
    dealerSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
