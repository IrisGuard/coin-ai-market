
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Globe, CheckCircle, XCircle } from 'lucide-react';
import { 
  useBulkImportSources, 
  useSourceCategories, 
  useGeographicRegions, 
  useSourceTemplates,
  getGlobalSourcesData 
} from '@/hooks/useEnhancedAdminSources';

const BulkSourceImporter = () => {
  const [importData, setImportData] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  
  const { data: categories } = useSourceCategories();
  const { data: regions } = useGeographicRegions();
  const { data: templates } = useSourceTemplates();
  const bulkImport = useBulkImportSources();

  const handleQuickImport = (preset: 'global' | 'auction_houses' | 'marketplaces') => {
    const globalSources = getGlobalSourcesData();
    let filteredSources = globalSources;

    if (preset === 'auction_houses') {
      filteredSources = globalSources.filter(s => s.source_type === 'auction');
    } else if (preset === 'marketplaces') {
      filteredSources = globalSources.filter(s => s.source_type === 'marketplace');
    }

    // Map to proper format with IDs
    const mappedSources = filteredSources.map(source => ({
      ...source,
      category_id: categories?.find(c => c.name === source.category_name)?.id,
      region_id: regions?.find(r => r.name === source.region_name)?.id,
      template_id: templates?.find(t => t.name === source.template_name)?.id,
      scraping_config: {
        selectors: {
          price: '.price, .current-bid, .estimate',
          title: '.title, h1, .coin-name',
          image: '.coin-image img, .main-image img',
          description: '.description, .details'
        },
        pagination: {
          type: 'numbered',
          max_pages: 50
        }
      }
    }));

    setImportData(JSON.stringify(mappedSources, null, 2));
  };

  const handleImport = async () => {
    try {
      const sources = JSON.parse(importData);
      setImportProgress(25);
      
      const result = await bulkImport.mutateAsync(sources);
      setImportProgress(100);
      setImportResults(result);
    } catch (error) {
      console.error('Import failed:', error);
      setImportProgress(0);
    }
  };

  const downloadTemplate = () => {
    const template = {
      source_name: "Example Auction House",
      source_type: "auction",
      base_url: "https://example.com",
      category_id: "uuid-here",
      region_id: "uuid-here", 
      template_id: "uuid-here",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 50,
      supported_currencies: ["USD"],
      market_focus: ["general"],
      scraping_config: {
        selectors: {
          price: ".price",
          title: ".title",
          image: ".image img"
        }
      }
    };

    const blob = new Blob([JSON.stringify([template], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'source_template.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Quick Import Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Quick Import Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickImport('global')}
            >
              <Globe className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Global Sources</div>
                <div className="text-xs text-muted-foreground">12 premium sources</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickImport('auction_houses')}
            >
              <FileText className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Auction Houses</div>
                <div className="text-xs text-muted-foreground">6 major auctions</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => handleQuickImport('marketplaces')}
            >
              <Upload className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Marketplaces</div>
                <div className="text-xs text-muted-foreground">3 top platforms</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Import */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Source Import</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Import Data (JSON)</label>
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your JSON data here or use a preset above..."
              className="min-h-[200px] font-mono text-xs"
            />
          </div>

          {importProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import Progress</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {importResults && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Import Complete</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Successfully imported:</span>
                  <Badge variant="outline" className="text-green-600">
                    {importResults[0]?.imported_count || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Failed imports:</span>
                  <Badge variant="outline" className="text-red-600">
                    {importResults[0]?.failed_count || 0}
                  </Badge>
                </div>
              </div>
              {importResults[0]?.errors && importResults[0].errors.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-red-600">Errors:</span>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    {importResults[0].errors.map((error: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!importData || bulkImport.isPending}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {bulkImport.isPending ? 'Importing...' : 'Import Sources'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkSourceImporter;
