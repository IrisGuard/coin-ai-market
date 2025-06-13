
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, Shield, Database, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DatabaseTablesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Comprehensive list of all 84 tables organized by category
  const allTables = [
    // User Management (8 tables)
    { name: 'profiles', category: 'users', records: '1,234', status: 'active', rls: true },
    { name: 'user_roles', category: 'users', records: '1,234', status: 'active', rls: true },
    { name: 'favorites', category: 'users', records: '3,456', status: 'active', rls: true },
    { name: 'notifications', category: 'users', records: '8,901', status: 'active', rls: true },
    { name: 'messages', category: 'users', records: '2,345', status: 'active', rls: true },
    { name: 'user_analytics', category: 'users', records: '15,678', status: 'active', rls: true },
    { name: 'user_preferences', category: 'users', records: '1,234', status: 'active', rls: true },
    { name: 'user_sessions', category: 'users', records: '5,432', status: 'active', rls: true },

    // Coins & Items (12 tables)
    { name: 'coins', category: 'coins', records: '45,678', status: 'active', rls: true },
    { name: 'coin_evaluations', category: 'coins', records: '12,345', status: 'active', rls: true },
    { name: 'coin_price_history', category: 'coins', records: '123,456', status: 'active', rls: true },
    { name: 'coin_analysis_logs', category: 'coins', records: '34,567', status: 'active', rls: true },
    { name: 'coin_data_cache', category: 'coins', records: '67,890', status: 'active', rls: true },
    { name: 'categories', category: 'coins', records: '45', status: 'active', rls: true },
    { name: 'dual_image_analysis', category: 'coins', records: '8,901', status: 'active', rls: true },
    { name: 'aggregated_coin_prices', category: 'coins', records: '23,456', status: 'active', rls: true },
    { name: 'coin_certifications', category: 'coins', records: '15,678', status: 'active', rls: true },
    { name: 'coin_varieties', category: 'coins', records: '5,432', status: 'active', rls: true },
    { name: 'coin_mintages', category: 'coins', records: '12,345', status: 'active', rls: true },
    { name: 'coin_specifications', category: 'coins', records: '8,765', status: 'active', rls: true },

    // Marketplace (9 tables)
    { name: 'marketplace_listings', category: 'marketplace', records: '5,678', status: 'active', rls: true },
    { name: 'marketplace_stats', category: 'marketplace', records: '1,234', status: 'active', rls: true },
    { name: 'marketplace_tenants', category: 'marketplace', records: '23', status: 'active', rls: true },
    { name: 'auction_bids', category: 'marketplace', records: '12,345', status: 'active', rls: true },
    { name: 'bids', category: 'marketplace', records: '23,456', status: 'active', rls: true },
    { name: 'stores', category: 'marketplace', records: '234', status: 'active', rls: true },
    { name: 'store_ratings', category: 'marketplace', records: '1,234', status: 'active', rls: true },
    { name: 'listing_views', category: 'marketplace', records: '45,678', status: 'active', rls: true },
    { name: 'marketplace_transactions', category: 'marketplace', records: '8,901', status: 'active', rls: true },

    // AI System (14 tables)
    { name: 'ai_commands', category: 'ai', records: '100', status: 'active', rls: true },
    { name: 'ai_command_executions', category: 'ai', records: '12,345', status: 'active', rls: true },
    { name: 'ai_command_execution_logs', category: 'ai', records: '34,567', status: 'active', rls: true },
    { name: 'ai_command_categories', category: 'ai', records: '15', status: 'active', rls: true },
    { name: 'ai_command_workflows', category: 'ai', records: '45', status: 'active', rls: true },
    { name: 'ai_configuration', category: 'ai', records: '1', status: 'active', rls: true },
    { name: 'ai_error_detection_logs', category: 'ai', records: '2,345', status: 'active', rls: true },
    { name: 'ai_performance_analytics', category: 'ai', records: '8,901', status: 'active', rls: true },
    { name: 'ai_performance_metrics', category: 'ai', records: '15,678', status: 'active', rls: true },
    { name: 'ai_predictions', category: 'ai', records: '5,432', status: 'active', rls: true },
    { name: 'ai_recognition_cache', category: 'ai', records: '23,456', status: 'active', rls: true },
    { name: 'ai_search_filters', category: 'ai', records: '67', status: 'active', rls: true },
    { name: 'ai_training_data', category: 'ai', records: '12,345', status: 'active', rls: true },
    { name: 'automation_rules', category: 'ai', records: '89', status: 'active', rls: true },

    // Analytics (7 tables)
    { name: 'analytics_events', category: 'analytics', records: '234,567', status: 'active', rls: true },
    { name: 'page_views', category: 'analytics', records: '123,456', status: 'active', rls: true },
    { name: 'market_analytics', category: 'analytics', records: '45,678', status: 'active', rls: true },
    { name: 'market_analysis_results', category: 'analytics', records: '8,901', status: 'active', rls: true },
    { name: 'search_analytics', category: 'analytics', records: '67,890', status: 'active', rls: true },
    { name: 'performance_metrics', category: 'analytics', records: '12,345', status: 'active', rls: true },
    { name: 'system_metrics', category: 'analytics', records: '34,567', status: 'active', rls: true },

    // Data Sources (11 tables)
    { name: 'data_sources', category: 'data', records: '45', status: 'active', rls: true },
    { name: 'api_keys', category: 'data', records: '23', status: 'active', rls: true },
    { name: 'api_key_categories', category: 'data', records: '12', status: 'active', rls: true },
    { name: 'api_key_rotations', category: 'data', records: '67', status: 'active', rls: true },
    { name: 'external_price_sources', category: 'data', records: '34', status: 'active', rls: true },
    { name: 'data_quality_reports', category: 'data', records: '1,234', status: 'active', rls: true },
    { name: 'source_templates', category: 'data', records: '56', status: 'active', rls: true },
    { name: 'scraping_jobs', category: 'data', records: '234', status: 'active', rls: true },
    { name: 'scraping_schedules', category: 'data', records: '89', status: 'active', rls: true },
    { name: 'url_cache', category: 'data', records: '12,345', status: 'active', rls: true },
    { name: 'proxy_configurations', category: 'data', records: '23', status: 'active', rls: true },

    // Security (6 tables)
    { name: 'admin_activity_logs', category: 'security', records: '5,678', status: 'active', rls: true },
    { name: 'admin_roles', category: 'security', records: '12', status: 'active', rls: true },
    { name: 'security_incidents', category: 'security', records: '23', status: 'active', rls: true },
    { name: 'security_logs', category: 'security', records: '8,901', status: 'active', rls: true },
    { name: 'access_logs', category: 'security', records: '45,678', status: 'active', rls: true },
    { name: 'audit_trails', category: 'security', records: '12,345', status: 'active', rls: true },

    // Payments (4 tables)
    { name: 'payment_transactions', category: 'payments', records: '8,901', status: 'active', rls: true },
    { name: 'payment_methods', category: 'payments', records: '1,234', status: 'active', rls: true },
    { name: 'subscription_plans', category: 'payments', records: '12', status: 'active', rls: true },
    { name: 'invoices', category: 'payments', records: '5,678', status: 'active', rls: true },

    // Error Management (8 tables)
    { name: 'error_logs', category: 'errors', records: '12,345', status: 'active', rls: true },
    { name: 'console_errors', category: 'errors', records: '23,456', status: 'active', rls: true },
    { name: 'error_coins_knowledge', category: 'errors', records: '1,234', status: 'active', rls: true },
    { name: 'error_coins_market_data', category: 'errors', records: '5,678', status: 'active', rls: true },
    { name: 'error_pattern_matches', category: 'errors', records: '890', status: 'active', rls: true },
    { name: 'error_reference_sources', category: 'errors', records: '45', status: 'active', rls: true },
    { name: 'system_alerts', category: 'errors', records: '678', status: 'active', rls: true },
    { name: 'health_checks', category: 'errors', records: '12,345', status: 'active', rls: true },

    // Geographic (5 tables)
    { name: 'geographic_regions', category: 'geographic', records: '195', status: 'active', rls: true },
    { name: 'countries', category: 'geographic', records: '195', status: 'active', rls: true },
    { name: 'currencies', category: 'geographic', records: '168', status: 'active', rls: true },
    { name: 'time_zones', category: 'geographic', records: '400', status: 'active', rls: true },
    { name: 'regional_settings', category: 'geographic', records: '195', status: 'active', rls: true },

    // System Operations (4 tables)
    { name: 'bulk_operations', category: 'system', records: '234', status: 'active', rls: true },
    { name: 'command_queue', category: 'system', records: '1,234', status: 'active', rls: true },
    { name: 'scheduled_tasks', category: 'system', records: '67', status: 'active', rls: true },
    { name: 'system_configuration', category: 'system', records: '1', status: 'active', rls: true }
  ];

  const filteredTables = allTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      users: 'bg-blue-100 text-blue-800',
      coins: 'bg-yellow-100 text-yellow-800',
      marketplace: 'bg-purple-100 text-purple-800',
      ai: 'bg-indigo-100 text-indigo-800',
      analytics: 'bg-cyan-100 text-cyan-800',
      data: 'bg-orange-100 text-orange-800',
      security: 'bg-red-100 text-red-800',
      payments: 'bg-emerald-100 text-emerald-800',
      errors: 'bg-rose-100 text-rose-800',
      geographic: 'bg-teal-100 text-teal-800',
      system: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tables</p>
                <p className="text-2xl font-bold">{allTables.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RLS Enabled</p>
                <p className="text-2xl font-bold">{allTables.filter(t => t.rls).length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">11</p>
              </div>
              <Table className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{allTables.filter(t => t.status === 'active').length}</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Tables List */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tables ({filteredTables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Table className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{table.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className={getCategoryColor(table.category)}>
                        {table.category}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(table.status)}>
                        {table.status}
                      </Badge>
                      {table.rls && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          RLS
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {table.records} records
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default DatabaseTablesManagement;
