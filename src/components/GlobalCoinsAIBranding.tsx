
import React from 'react';

interface GlobalCoinsAIBrandingProps {
  variant?: 'header' | 'footer' | 'inline';
  className?: string;
}

const GlobalCoinsAIBranding: React.FC<GlobalCoinsAIBrandingProps> = ({ 
  variant = 'inline', 
  className = '' 
}) => {
  const baseClasses = "font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent";
  
  const variants = {
    header: "text-2xl md:text-3xl",
    footer: "text-lg",
    inline: "text-xl"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      GlobalCoinsAI
    </span>
  );
};

export default GlobalCoinsAIBranding;
