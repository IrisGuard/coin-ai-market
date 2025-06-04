
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Define session type
export interface Session {
  user: User;
  access_token: string;
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real auth check when backend is connected
      const storedUser = localStorage.getItem('user_session');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession({ user: userData, access_token: 'temp_token' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call when backend is connected
      // For now, simulate login for development
      const mockUser: User = {
        id: 'temp_user_id',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setSession({
        user: mockUser,
        access_token: 'temp_token'
      });
      
      localStorage.setItem('user_session', JSON.stringify(mockUser));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call when backend is connected
      const mockUser: User = {
        id: 'temp_user_id',
        email,
        name,
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setSession({
        user: mockUser,
        access_token: 'temp_token'
      });
      
      localStorage.setItem('user_session', JSON.stringify(mockUser));
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CoinVision AI!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call when backend is connected
      setUser(null);
      setSession(null);
      localStorage.removeItem('user_session');
      
      toast({
        title: "Logout Successful",
        description: "Come back soon!",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      
      // TODO: Replace with real API call when backend is connected
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
