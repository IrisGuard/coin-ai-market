
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AuthHeader = () => {
  return (
    <CardHeader className="text-center space-y-2">
      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
        Καλώς ήρθατε στο CoinVision
      </CardTitle>
      <CardDescription className="text-electric-blue">
        Εγγραφείτε στην κοινότητα συλλεκτών και dealers νομισμάτων
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
