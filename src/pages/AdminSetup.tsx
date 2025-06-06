
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Lock, Mail, AlertCircle, CheckCircle, Loader2, Crown, Settings, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createFirstAdmin, checkAdminStatus } from '@/utils/adminUtils';
import AdminSetupHelper from '@/components/admin/AdminSetupHelper';

const AdminSetup: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(true);
  const [hasAdminUser, setHasAdminUser] = useState<boolean | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [setupForm, setSetupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    secretKey: ''
  });

  // Check admin status and existing admin users
  useEffect(() => {
    const checkStatus = async () => {
      setCheckingAdminStatus(true);
      try {
        // Check if any admin exists
        const { data: adminRoles, error: adminError } = await supabase
          .from('admin_roles')
          .select('id')
          .limit(1);

        if (adminError) throw adminError;
        const adminExists = adminRoles && adminRoles.length > 0;
        setHasAdminUser(adminExists);

        // Check if current user is admin
        if (user) {
          const isAdmin = await checkAdminStatus();
          setIsCurrentUserAdmin(isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setHasAdminUser(false);
        setIsCurrentUserAdmin(false);
      } finally {
        setCheckingAdminStatus(false);
      }
    };

    checkStatus();
  }, [user]);

  const validateForm = () => {
    if (!setupForm.email || !setupForm.password || !setupForm.fullName) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setupForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (setupForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (setupForm.password !== setupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!hasAdminUser && setupForm.secretKey !== 'COINVISION_ADMIN_2024') {
      toast.error('Invalid admin setup key');
      return false;
    }

    return true;
  };

  const handleAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create admin user account through Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: setupForm.email,
        password: setupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: setupForm.fullName,
            name: setupForm.fullName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Use the admin utils to create the first admin
        const result = await createFirstAdmin(setupForm.email);
        
        if (result.success) {
          toast.success('Admin account created successfully!');
          
          // Clear form
          setSetupForm({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            secretKey: ''
          });
          
          // Refresh admin status
          setHasAdminUser(true);
          
          // Show success message and redirect after a delay
          setTimeout(() => {
            if (isAuthenticated) {
              navigate('/admin');
            } else {
              toast.success('Please sign in with your admin credentials');
              navigate('/auth');
            }
          }, 2000);
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error: any) {
      console.error('Admin setup error:', error);
      
      if (error.message?.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else if (error.message?.includes('not found')) {
        toast.error('Please create the user account first, then try again');
      } else {
        toast.error(`Failed to create admin account: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToAdmin = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const result = await createFirstAdmin(user.email);
      
      if (result.success) {
        toast.success('Successfully upgraded to admin!');
        setIsCurrentUserAdmin(true);
        navigate('/admin');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Admin upgrade error:', error);
      toast.error(`Failed to upgrade to admin: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking admin status
  if (checkingAdminStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary via-electric-blue to-brand-accent flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Checking admin status...</p>
        </div>
      </div>
    );
  }

  // If admin exists and user is admin, redirect to admin panel
  if (hasAdminUser && isAuthenticated && isCurrentUserAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-electric-blue to-brand-accent relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 180],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/20 to-brand-accent/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [180, 90, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-electric-emerald/30 to-electric-pink/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-serif font-bold text-white mb-2"
            >
              CoinVision Admin Setup
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/80 text-lg"
            >
              {hasAdminUser 
                ? 'Admin panel access for existing administrators'
                : 'Set up the first administrator account for your CoinVision marketplace'
              }
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <Shield className="w-6 h-6 text-brand-primary" />
                  {hasAdminUser ? 'Admin Access' : 'Create Admin Account'}
                </CardTitle>
                {!hasAdminUser && (
                  <div className="flex items-center gap-2 p-3 bg-electric-orange/10 rounded-lg border border-electric-orange/20">
                    <AlertCircle className="w-5 h-5 text-electric-orange" />
                    <span className="text-sm text-electric-orange font-medium">
                      First-time setup required
                    </span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                {hasAdminUser ? (
                  <div className="space-y-6 text-center">
                    <div className="p-6 bg-electric-emerald/10 rounded-2xl border border-electric-emerald/20">
                      <CheckCircle className="w-12 h-12 text-electric-emerald mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Admin System Ready
                      </h3>
                      <p className="text-gray-600">
                        Admin account is already configured. 
                        {isAuthenticated && isCurrentUserAdmin 
                          ? ' You can access the admin panel.'
                          : ' Please sign in with admin credentials.'
                        }
                      </p>
                    </div>

                    <div className="flex gap-4">
                      {isAuthenticated && isCurrentUserAdmin ? (
                        <Button 
                          onClick={() => navigate('/admin')}
                          className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                          size="lg"
                        >
                          <Settings className="w-5 h-5 mr-2" />
                          Access Admin Panel
                        </Button>
                      ) : isAuthenticated && !isCurrentUserAdmin ? (
                        <Button 
                          onClick={upgradeToAdmin}
                          disabled={isLoading}
                          className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                          size="lg"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <Crown className="w-5 h-5 mr-2" />
                          )}
                          Request Admin Access
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                          size="lg"
                        >
                          <User className="w-5 h-5 mr-2" />
                          Sign In as Admin
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        Back to Home
                      </Button>
                    </div>

                    <AdminSetupHelper />
                  </div>
                ) : (
                  <form onSubmit={handleAdminSetup} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-gray-700 font-medium">
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-brand-primary" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Administrator Name"
                            value={setupForm.fullName}
                            onChange={(e) => setSetupForm({ ...setupForm, fullName: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-brand-primary" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={setupForm.email}
                            onChange={(e) => setSetupForm({ ...setupForm, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                          Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-brand-primary" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 8 characters"
                            value={setupForm.password}
                            onChange={(e) => setSetupForm({ ...setupForm, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-brand-primary hover:text-brand-primary/80"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-brand-primary" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repeat password"
                            value={setupForm.confirmPassword}
                            onChange={(e) => setSetupForm({ ...setupForm, confirmPassword: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-brand-primary hover:text-brand-primary/80"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secretKey" className="text-gray-700 font-medium">
                        Admin Secret Key *
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-brand-primary" />
                        <Input
                          id="secretKey"
                          type="password"
                          placeholder="Enter the admin setup key"
                          value={setupForm.secretKey}
                          onChange={(e) => setSetupForm({ ...setupForm, secretKey: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Use: COINVISION_ADMIN_2024
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Admin...
                          </>
                        ) : (
                          <>
                            <Crown className="w-5 h-5 mr-2" />
                            Create Admin Account
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white"
            >
              ← Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSetup;
