
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = "Back", 
  className = "" 
}) => {
  return (
    <Link to={to}>
      <Button 
        variant="outline" 
        size="sm"
        className={`flex items-center gap-2 text-electric-blue hover:text-electric-purple ${className}`}
      >
        <ChevronLeft className="w-4 h-4" />
        {label}
      </Button>
    </Link>
  );
};

export default BackButton;
