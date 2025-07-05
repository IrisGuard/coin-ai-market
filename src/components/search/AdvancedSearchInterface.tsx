'use client';

import React from 'react';
import EnhancedSearchBar from './EnhancedSearchBar';

interface AdvancedSearchInterfaceProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showVoiceSearch?: boolean;
  showImageSearch?: boolean;
  showAISearch?: boolean;
}

const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({
  onSearch,
  placeholder = "Search coins with AI-powered suggestions...",
  showVoiceSearch = true,
  showImageSearch = true,
  showAISearch = true
}) => {
  return (
    <EnhancedSearchBar
      placeholder={placeholder}
      onSearch={onSearch}
      showVoiceSearch={showVoiceSearch}
      showAISearch={showAISearch}
    />
  );
};

export default AdvancedSearchInterface;