
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
}

interface DealerSignupFormFieldsProps {
  signupData: SignupData;
  onSignupDataChange: (data: SignupData) => void;
  errors: Record<string, string>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const DealerSignupFormFields: React.FC<DealerSignupFormFieldsProps> = ({
  signupData,
  onSignupDataChange,
  errors,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  isLoading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Full Name"
            value={signupData.fullName}
            onChange={(e) => onSignupDataChange({ ...signupData, fullName: e.target.value })}
            className={errors.fullName ? 'border-red-300' : ''}
          />
          {errors.fullName && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <Input
            placeholder="Username"
            value={signupData.username}
            onChange={(e) => onSignupDataChange({ ...signupData, username: e.target.value })}
            className={errors.username ? 'border-red-300' : ''}
          />
          {errors.username && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{errors.username}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <Input
          type="email"
          placeholder="your@email.com"
          value={signupData.email}
          onChange={(e) => onSignupDataChange({ ...signupData, email: e.target.value })}
          className={errors.email ? 'border-red-300' : ''}
        />
        {errors.email && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle size={14} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={signupData.password}
            onChange={(e) => onSignupDataChange({ ...signupData, password: e.target.value })}
            className={errors.password ? 'border-red-300 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle size={14} />
            <span>{errors.password}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={signupData.confirmPassword}
            onChange={(e) => onSignupDataChange({ ...signupData, confirmPassword: e.target.value })}
            className={errors.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={onToggleConfirmPassword}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle size={14} />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-electric-green to-electric-emerald hover:from-electric-emerald hover:to-electric-cyan"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Store...
          </>
        ) : (
          'Open My Store'
        )}
      </Button>
    </form>
  );
};

export default DealerSignupFormFields;
