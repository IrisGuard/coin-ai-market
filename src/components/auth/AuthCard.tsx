
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import SocialLogin from './SocialLogin';
import AuthHeader from './AuthHeader';
import AuthDivider from './AuthDivider';

const AuthCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border border-electric-blue/20">
        <AuthHeader />
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Σύνδεση</TabsTrigger>
              <TabsTrigger value="register">Εγγραφή</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm isLogin={true} setIsLogin={setIsLogin} />
              <AuthDivider text="Ή συνεχίστε με" />
              <SocialLogin />
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
              <AuthDivider text="Ή εγγραφή με" />
              <SocialLogin />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
