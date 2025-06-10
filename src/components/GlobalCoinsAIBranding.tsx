
import React from 'react';

interface GlobalCoinsAIBrandingProps {
  variant?: 'header' | 'footer' | 'inline';
  className?: string;
}

const GlobalCoinsAIBranding: React.FC<GlobalCoinsAIBrandingProps> = ({ 
  variant = 'inline', 
  className = '' 
}) => {
  const baseClasses = "font-bold text-blue-600";
  
  const variants = {
    header: "text-2xl md:text-3xl",
    footer: "text-lg",
    inline: "text-xl"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      CoinAI
    </span>
  );
};

export default GlobalCoinsAIBranding;
