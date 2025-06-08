
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Back', 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`flex items-center gap-2 text-electric-blue hover:text-electric-purple hover:bg-electric-blue/10 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};

export default BackButton;
