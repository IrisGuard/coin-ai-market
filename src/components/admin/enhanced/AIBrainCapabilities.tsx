
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Brain, Zap, Shield, Database, Target, BarChart3 } from 'lucide-react';

interface Capability {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'development' | 'planned';
  commands?: string[];
  apiEndpoint?: string;
}

const capabilities: Capability[] = [
  // Core Platform Features
  { id: 1, name: "AI-Powered Coin Recognition", description: "Advanced AI system for identifying coins and errors", category: "core", status: "active", apiEndpoint: "/api/ai-recognition" },
  { id: 2, name: "Real-time Marketplace", description: "Live bidding and trading platform", category: "core", status: "active" },
  { id: 3, name: "Advanced Admin Panel", description: "Comprehensive management system with 12 tabs", category: "core", status: "active" },
  { id: 4, name: "User Authentication", description: "Secure login and profile management", category: "core", status: "active" },
  { id: 5, name: "Coin Upload & Management", description: "Image upload and coin data management", category: "core", status: "active" },
  { id: 6, name: "3D Coin Viewer", description: "Interactive 3D coin visualization", category: "core", status: "active" },
  { id: 7, name: "Auction System", description: "Automated auction with bidding mechanics", category: "core", status: "active" },
  { id: 8, name: "Transaction Management", description: "Complete transaction lifecycle handling", category: "core", status: "active" },
  { id: 9, name: "Notification System", description: "Real-time alerts and notifications", category: "core", status: "active" },
  { id: 10, name: "Favorites & Watchlists", description: "User preference management", category: "core", status: "active" },

  // AI Intelligence
  { id: 11, name: "AI Coin Recognition API", description: "Machine learning coin identification", category: "ai", status: "active", apiEndpoint: "/api/ai-recognition" },
  { id: 12, name: "Error Coin Detection", description: "Specialized error analysis system", category: "ai", status: "active" },
  { id: 13, name: "Market Price Prediction", description: "AI-driven price forecasting", category: "ai", status: "development" },
  { id: 14, name: "PCGS/NGC Integration", description: "Grading service data integration", category: "ai", status: "active" },
  { id: 15, name: "Multi-source Aggregation", description: "Data from multiple coin sources", category: "ai", status: "active" },
  { id: 16, name: "AI Training Management", description: "Model training and improvement", category: "ai", status: "active" },
  { id: 17, name: "Confidence Scoring", description: "Recognition accuracy metrics", category: "ai", status: "active" },
  { id: 18, name: "Auto-categorization", description: "Automatic coin classification", category: "ai", status: "active" },

  // Admin System
  { id: 19, name: "External Sources Management", description: "12 global auction house integrations", category: "admin", status: "active" },
  { id: 20, name: "Price Aggregation Engine", description: "Multi-source price compilation", category: "admin", status: "active" },
  { id: 21, name: "Error Coins Knowledge Base", description: "Comprehensive error coin database", category: "admin", status: "active" },
  { id: 22, name: "Error Market Data", description: "Error coin pricing and trends", category: "admin", status: "active" },
  { id: 23, name: "Data Sources Control", description: "External data source management", category: "admin", status: "active" },
  { id: 24, name: "Web Scraping System", description: "Automated data collection", category: "admin", status: "active" },
  { id: 25, name: "User Management", description: "User accounts and permissions", category: "admin", status: "active" },
  { id: 26, name: "Coin Authentication", description: "Verification and grading system", category: "admin", status: "active" },
  { id: 27, name: "Transaction Monitoring", description: "Financial transaction oversight", category: "admin", status: "active" },
  { id: 28, name: "System Analytics", description: "Platform performance metrics", category: "admin", status: "active" },
  { id: 29, name: "API Keys Management", description: "External service authentication", category: "admin", status: "active" },
  { id: 30, name: "Performance Metrics", description: "System performance tracking", category: "admin", status: "active" },

  // Error Expertise
  { id: 31, name: "Doubled Die Recognition", description: "Advanced DD error detection", category: "errors", status: "active" },
  { id: 32, name: "Off-Center Strike Detection", description: "Misaligned coin identification", category: "errors", status: "active" },
  { id: 33, name: "Clipped Planchet Analysis", description: "Planchet error recognition", category: "errors", status: "active" },
  { id: 34, name: "Machine vs True Doubling", description: "Error type classification", category: "errors", status: "active" },
  { id: 35, name: "Error Grading System", description: "Error severity assessment", category: "errors", status: "active" },
  { id: 36, name: "Market Premium Calculation", description: "Error coin value analysis", category: "errors", status: "active" },
  { id: 37, name: "Reference Integration", description: "Error coin reference sources", category: "errors", status: "active" },
  { id: 38, name: "Price History Tracking", description: "Historical error coin prices", category: "errors", status: "active" },

  // Data Intelligence
  { id: 39, name: "Geographic Source Mapping", description: "Global source location tracking", category: "data", status: "active" },
  { id: 40, name: "Bulk Source Import", description: "Mass data import capabilities", category: "data", status: "active" },
  { id: 41, name: "AI Source Discovery", description: "Automated source identification", category: "data", status: "active" },
  { id: 42, name: "Template Management", description: "Data template system", category: "data", status: "active" },
  { id: 43, name: "Performance Analytics", description: "Source performance tracking", category: "data", status: "active" },
  { id: 44, name: "Proxy Rotation System", description: "IP rotation for scraping", category: "data", status: "active" },
  { id: 45, name: "Success Rate Monitoring", description: "Operation success tracking", category: "data", status: "active" },
  { id: 46, name: "Response Time Analysis", description: "Performance optimization", category: "data", status: "active" },

  // Security
  { id: 47, name: "Row Level Security", description: "Database-level access control", category: "security", status: "active" },
  { id: 48, name: "Admin Role Management", description: "Hierarchical permission system", category: "security", status: "active" },
  { id: 49, name: "Error Logging System", description: "Comprehensive error tracking", category: "security", status: "active" },
  { id: 50, name: "Console Error Tracking", description: "Frontend error monitoring", category: "security", status: "active" },
  { id: 51, name: "Activity Monitoring", description: "User action tracking", category: "security", status: "active" },
  { id: 52, name: "API Rate Limiting", description: "Request throttling system", category: "security", status: "active" },
  { id: 53, name: "Data Encryption", description: "End-to-end data protection", category: "security", status: "active" },
  { id: 54, name: "Audit Trails", description: "Complete action logging", category: "security", status: "active" }
];

const categoryIcons = {
  core: Zap,
  ai: Brain,
  admin: Database,
  errors: Target,
  data: BarChart3,
  security: Shield
};

const categoryLabels = {
  core: "Core Platform",
  ai: "AI Intelligence",
  admin: "Admin System",
  errors: "Error Expertise",
  data: "Data Intelligence",
  security: "Security"
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  development: "bg-yellow-100 text-yellow-800",
  planned: "bg-blue-100 text-blue-800"
};

const AIBrainCapabilities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCapabilities = capabilities.filter(capability => {
    const matchesSearch = capability.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capability.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || capability.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedCapabilities = capabilities.reduce((acc, capability) => {
    if (!acc[capability.category]) {
      acc[capability.category] = [];
    }
    acc[capability.category].push(capability);
    return acc;
  }, {} as Record<string, Capability[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Brain Dashboard
          </h2>
          <p className="text-muted-foreground">
            Complete platform capabilities registry for AI systems
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {capabilities.length} Capabilities
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search capabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs by Category */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({capabilities.length})</TabsTrigger>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            const count = groupedCapabilities[key]?.length || 0;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{key.toUpperCase()}</span>
                ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCapabilities.map((capability) => {
              const Icon = categoryIcons[capability.category as keyof typeof categoryIcons];
              return (
                <Card key={capability.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          #{capability.id}
                        </Badge>
                      </div>
                      <Badge className={`text-xs ${statusColors[capability.status]}`}>
                        {capability.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-medium leading-tight">
                      {capability.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs mb-2">
                      {capability.description}
                    </CardDescription>
                    {capability.apiEndpoint && (
                      <Badge variant="secondary" className="text-xs">
                        API: {capability.apiEndpoint}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedCapabilities[categoryKey]?.map((capability) => {
                const Icon = categoryIcons[capability.category as keyof typeof categoryIcons];
                return (
                  <Card key={capability.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            #{capability.id}
                          </Badge>
                        </div>
                        <Badge className={`text-xs ${statusColors[capability.status]}`}>
                          {capability.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-medium leading-tight">
                        {capability.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs mb-2">
                        {capability.description}
                      </CardDescription>
                      {capability.apiEndpoint && (
                        <Badge variant="secondary" className="text-xs">
                          API: {capability.apiEndpoint}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const Icon = categoryIcons[key as keyof typeof categoryIcons];
          const count = groupedCapabilities[key]?.length || 0;
          const activeCount = groupedCapabilities[key]?.filter(c => c.status === 'active').length || 0;
          
          return (
            <Card key={key} className="text-center">
              <CardContent className="pt-4">
                <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs text-green-600">{activeCount} active</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AIBrainCapabilities;
