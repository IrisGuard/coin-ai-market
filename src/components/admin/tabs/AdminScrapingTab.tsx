
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Database, Zap, TrendingUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminScrapingTab = () => {
  const [scrapingJobs, setScrapingJobs] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalSources: 0,
    activeSources: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScrapingData();
    fetchStats();
  }, []);

  const fetchScrapingData = async () => {
    try {
      const [jobsRes, sourcesRes] = await Promise.all([
        supabase.from('scraping_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('data_sources').select('*').order('created_at', { ascending: false })
      ]);

      setScrapingJobs(jobsRes.data || []);
      setDataSources(sourcesRes.data || []);
    } catch (error) {
      console.error('Error fetching scraping data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [jobsRes, sourcesRes] = await Promise.all([
        supabase.from('scraping_jobs').select('status'),
        supabase.from('data_sources').select('is_active')
      ]);

      const totalJobs = jobsRes.data?.length || 0;
      const activeJobs = jobsRes.data?.filter(j => j.status === 'active').length || 0;
      const totalSources = sourcesRes.data?.length || 0;
      const activeSources = sourcesRes.data?.filter(s => s.is_active).length || 0;

      setStats({
        totalJobs,
        activeJobs,
        totalSources,
        activeSources
      });
    } catch (error) {
      console.error('Error fetching scraping stats:', error);
    }
  };

  const filteredJobs = scrapingJobs.filter(job => 
    job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.target_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'paused': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      case 'completed': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scraping Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">All scraping jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSources}</div>
            <p className="text-xs text-muted-foreground">External data sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeSources}</div>
            <p className="text-xs text-muted-foreground">Currently enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Scraping Jobs Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Scraping Jobs Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchScrapingData}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{job.name}</span>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {job.target_url} • Created: {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  {job.last_run && (
                    <div className="text-sm text-gray-600">
                      Last run: {new Date(job.last_run).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Success Rate: {((job.success_rate || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            External Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{source.name}</span>
                    <Badge className={source.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                      {source.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {source.url} • Type: {source.type} • Priority: {source.priority}
                  </div>
                  {source.last_used && (
                    <div className="text-sm text-gray-600">
                      Last used: {new Date(source.last_used).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Rate: {source.rate_limit}/hour
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Success: {((source.success_rate || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminScrapingTab;
