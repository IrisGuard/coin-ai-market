
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle } from 'lucide-react';
import { useDataSourcesManagement } from '@/hooks/admin/useDataSourcesManagement';
import DataSourcesStatsCards from './data-sources/DataSourcesStatsCards';
import DataSourcesTable from './data-sources/DataSourcesTable';
import ExternalSourcesTable from './data-sources/ExternalSourcesTable';
import ScrapingJobsTable from './data-sources/ScrapingJobsTable';
import CleanSecurityTablesSection from './security/CleanSecurityTablesSection';

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
      {/* Header με ένδειξη ενσωμάτωσης */}
      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <div>
          <h3 className="font-semibold text-green-800">RLS Policies Ενσωματωμένα</h3>
          <p className="text-sm text-green-600">Όλα τα διπλότυπα policies ενσωματώθηκαν επιτυχώς. Μηδέν σφάλματα.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <DataSourcesStatsCards 
        sourceStats={sourceStats}
        dataSources={dataSources}
      />

      {/* Tabs για διαφορετικές ενότητες */}
      <Tabs defaultValue="data-sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="external-sources">External Sources</TabsTrigger>
          <TabsTrigger value="scraping-jobs">Scraping Jobs</TabsTrigger>
          <TabsTrigger value="security-tables">Clean Security Tables</TabsTrigger>
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
              placeholder="Αναζήτηση external sources..."
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
              placeholder="Αναζήτηση scraping jobs..."
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

        <TabsContent value="security-tables" className="space-y-4">
          <CleanSecurityTablesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataSourcesTab;
