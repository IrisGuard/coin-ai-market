
import React from 'react';

interface MarketplacePanelHeaderProps {
  title: string;
  subtitle: string;
}

const MarketplacePanelHeader: React.FC<MarketplacePanelHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <p className="text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default MarketplacePanelHeader;
