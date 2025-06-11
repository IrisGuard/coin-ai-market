
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputFieldProps {
  id: string;
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword = () => {}
}) => (
  <div className="space-y-1">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={16} className={`${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      <Input
        id={id}
        type={type}
        className={`pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-3'} ${
          error ? 'border-red-300 bg-red-50' : ''
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          onClick={onTogglePassword}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default InputField;
