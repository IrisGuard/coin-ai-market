
import React, { useState } from 'react';
import AddCustomSourceForm from './AddCustomSourceForm';
import CustomSourcesList from './CustomSourcesList';
import CustomSourcesStats from './CustomSourcesStats';

interface CustomSource {
  id: string;
  name: string;
  url: string;
  type: string;
  description: string;
  scraping_enabled: boolean;
  status: string;
  ai_integration: boolean;
  created_at: string;
}

const CustomSourceManager = () => {
  const [customSources, setCustomSources] = useState<CustomSource[]>([]);

  const handleSourceAdded = (source: CustomSource) => {
    setCustomSources([...customSources, source]);
  };

  const handleRemoveSource = (id: string) => {
    setCustomSources(customSources.filter(s => s.id !== id));
  };

  const handleTestSource = (url: string) => {
    // Test functionality handled by individual components
    console.log('Testing source:', url);
  };

  return (
    <div className="space-y-6">
      <AddCustomSourceForm onSourceAdded={handleSourceAdded} />
      <CustomSourcesList 
        sources={customSources}
        onRemoveSource={handleRemoveSource}
        onTestSource={handleTestSource}
      />
      <CustomSourcesStats sources={customSources} />
    </div>
  );
};

export default CustomSourceManager;
