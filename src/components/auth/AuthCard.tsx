
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';

const AuthCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Σφάλμα",
        description: "Οι κωδικοί δεν ταιριάζουν",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Σφάλμα", 
        description: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            phone: signupData.phone
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Επιτυχής Εγγραφή!",
        description: "Ελέγξτε το email σας για επιβεβαίωση του λογαριασμού.",
      });
      
      // Clear form
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Αποτυχία Εγγραφής",
        description: error.message || 'Παρουσιάστηκε σφάλμα κατά την εγγραφή',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border border-electric-blue/20">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Καλώς ήρθατε στο CoinVision
          </CardTitle>
          <CardDescription className="text-electric-blue">
            Εγγραφείτε στην κοινότητα συλλεκτών και dealers νομισμάτων
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Σύνδεση</TabsTrigger>
              <TabsTrigger value="register">Εγγραφή</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm isLogin={true} setIsLogin={setIsLogin} />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ή συνεχίστε με</span>
                </div>
              </div>
              <SocialLogin />
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Πλήρες Όνομα
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Εισάγετε το πλήρες όνομά σας"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Τηλέφωνο (προαιρετικό)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+30 210 1234567"
                    value={signupData.phone}
                    onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Κωδικός
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Τουλάχιστον 6 χαρακτήρες"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Επιβεβαίωση Κωδικού
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Επαναλάβετε τον κωδικό"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-electric-blue hover:bg-electric-blue/90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Εγγραφή...
                    </>
                  ) : (
                    'Εγγραφή'
                  )}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ή εγγραφή με</span>
                </div>
              </div>
              <SocialLogin />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
