
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
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
  );
};

export default SignupForm;
