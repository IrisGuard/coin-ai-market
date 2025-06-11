
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useDataSourcesManagement } from '@/hooks/admin/useDataSourcesManagement';
import DataSourcesStatsCards from './data-sources/DataSourcesStatsCards';
import DataSourcesTable from './data-sources/DataSourcesTable';
import ExternalSourcesTable from './data-sources/ExternalSourcesTable';
import ScrapingJobsTable from './data-sources/ScrapingJobsTable';

const AdminDataSourcesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    dataSources,
    externalSources,
    scrapingJobs,
    sourceStats,
    sourcesLoading,
    updateDataSourceMutation
  } = useDataSourcesManagement();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <DataSourcesStatsCards 
        sourceStats={sourceStats}
        dataSources={dataSources}
      />

      {/* Tabs for different sections */}
      <Tabs defaultValue="data-sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="external-sources">External Sources</TabsTrigger>
          <TabsTrigger value="scraping-jobs">Scraping Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="data-sources" className="space-y-4">
          <DataSourcesTable
            dataSources={dataSources}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sourcesLoading={sourcesLoading}
            updateDataSourceMutation={updateDataSourceMutation}
          />
        </TabsContent>

        <TabsContent value="external-sources" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search external sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <ExternalSourcesTable
            externalSources={externalSources}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="scraping-jobs" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search scraping jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <ScrapingJobsTable
            scrapingJobs={scrapingJobs}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataSourcesTab;
