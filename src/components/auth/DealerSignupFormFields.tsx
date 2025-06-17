
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
  storeName: string;
  country: string;
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

// Country options with flags
const countryOptions = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮' }
];

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

      {/* Store Information Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Store Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              placeholder="Store Name"
              value={signupData.storeName}
              onChange={(e) => onSignupDataChange({ ...signupData, storeName: e.target.value })}
              className={errors.storeName ? 'border-red-300' : ''}
            />
            {errors.storeName && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={14} />
                <span>{errors.storeName}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Select 
              value={signupData.country} 
              onValueChange={(value) => onSignupDataChange({ ...signupData, country: value })}
            >
              <SelectTrigger className={errors.country ? 'border-red-300' : ''}>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={14} />
                <span>{errors.country}</span>
              </div>
            )}
          </div>
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
