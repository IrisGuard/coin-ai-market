
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

// Define auth context state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // This is a placeholder until Supabase is integrated
        // We'll check localStorage for now
        const storedUser = localStorage.getItem('coinai-user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // This is a placeholder until Supabase is integrated
      // We'll simulate a login for now
      if (email && password) {
        // Simulate successful login with mock user
        const mockUser: User = {
          id: '123456',
          email,
          name: email.split('@')[0],
          created_at: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('coinai-user', JSON.stringify(mockUser));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to CoinAI!",
        });
        
        navigate('/');
      } else {
        throw new Error('Invalid credentials');
      }
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
      
      // This is a placeholder until Supabase is integrated
      // We'll simulate a signup for now
      if (email && password && name) {
        // Simulate successful signup with mock user
        const mockUser: User = {
          id: '123456',
          email,
          name,
          created_at: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('coinai-user', JSON.stringify(mockUser));
        
        toast({
          title: "Registration Successful",
          description: "Welcome to CoinAI! Your account has been created.",
        });
        
        navigate('/');
      } else {
        throw new Error('Please provide all required fields');
      }
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
      
      // This is a placeholder until Supabase is integrated
      // We'll clear localStorage for now
      localStorage.removeItem('coinai-user');
      setUser(null);
      
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

  // Provide auth context
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        signup, 
        logout,
        isAuthenticated: !!user 
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
