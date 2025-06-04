
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { MockAuthAPI, MockSession, MockUser } from '@/lib/mockApi';

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
  session: MockSession | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock auth check
  useEffect(() => {
    console.log('Auth: Using mock authentication - waiting for new Supabase connection');
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock successful login
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setSession({
        user: mockUser,
        access_token: 'mock-token'
      });
      
      toast({
        title: "Mock Login Successful",
        description: "Using temporary authentication",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Mock Login",
        description: "Temporary authentication system",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Mock successful signup
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name,
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      
      toast({
        title: "Mock Registration Successful",
        description: "Using temporary authentication",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Mock Registration",
        description: "Temporary authentication system",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Mock Logout Successful",
        description: "Logged out from temporary auth",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Mock Logout",
        description: "Temporary authentication system",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock update profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      
      // Update local user state
      setUser({ ...user, ...updates });
      
      toast({
        title: "Mock Profile Updated",
        description: "Using temporary profile system",
      });
    } catch (error) {
      toast({
        title: "Mock Update Failed",
        description: "Temporary profile system",
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
