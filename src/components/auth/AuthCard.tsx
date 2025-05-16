
import { useState } from 'react';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-coin-blue">
            {isLogin ? 'Login to Your Account' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Sign in to access your collection and bids'
              : 'Join the global community of coin collectors'
            }
          </p>
        </div>
        
        <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />
        <SocialLogin />
      </div>
    </div>
  );
};

export default AuthCard;
