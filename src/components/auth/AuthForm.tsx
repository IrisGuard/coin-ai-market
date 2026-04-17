import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins } from 'lucide-react';
import LoginTab from './LoginTab';
import SignupTab from './SignupTab';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Card className="w-full glass-panel-strong border-border shadow-elevated">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-primary shadow-glow">
            <Coins className="w-6 h-6 text-primary-foreground" />
          </span>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome to <span className="text-gradient-primary">NovaCoin</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Premium AI marketplace for collectors
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Join as buyer</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <LoginTab />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <SignupTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
