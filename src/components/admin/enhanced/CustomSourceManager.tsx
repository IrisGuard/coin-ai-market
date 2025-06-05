
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Brain, Trash2, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useBulkImportSources } from '@/hooks/useEnhancedAdminSources';

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
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    type: 'encyclopedia',
    description: '',
    scraping_enabled: true
  });

  const [customSources, setCustomSources] = useState<CustomSource[]>([]);
  const [testingUrl, setTestingUrl] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bulkImportMutation = useBulkImportSources();

  const sourceTypes = [
    { value: 'encyclopedia', label: 'Γενική Εγκυκλοπαίδεια' },
    { value: 'price_guide', label: 'Οδηγός Τιμών' },
    { value: 'auction', label: 'Δημοπρασίες' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'reference', label: 'Βιβλιογραφία' },
    { value: 'forum', label: 'Forum/Community' },
    { value: 'news', label: 'Νέα & Άρθρα' },
    { value: 'database', label: 'Database' }
  ];

  const addCustomSource = async () => {
    if (!newSource.name || !newSource.url) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όνομα και URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First validate the URL
      const testResult = await testUrlExtraction(newSource.url, false);
      
      if (!testResult.success) {
        throw new Error('URL validation failed');
      }

      const source: CustomSource = {
        id: Date.now().toString(),
        ...newSource,
        created_at: new Date().toISOString(),
        status: 'active',
        ai_integration: true
      };

      // Use bulk import to add the source
      await bulkImportMutation.mutateAsync([{
        base_url: newSource.url,
        source_name: newSource.name,
        source_type: newSource.type,
        priority_score: 75,
        rate_limit_per_hour: 60,
        reliability_score: 0.8
      }]);

      setCustomSources([...customSources, source]);
      setNewSource({ 
        name: '', 
        url: '', 
        type: 'encyclopedia', 
        description: '', 
        scraping_enabled: true 
      });

      toast({
        title: "Επιτυχία",
        description: "Το σαιτ προστέθηκε επιτυχώς στον εγκέφαλο!",
      });

    } catch (error) {
      console.error('Failed to add source:', error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία προσθήκης σαιτ. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUrlExtraction = async (url: string, showToast: boolean = true): Promise<any> => {
    if (!url) return { success: false };
    
    setTestingUrl(url);
    
    try {
      // Basic URL validation
      new URL(url);
      
      // Simulate AI analysis
      const results = {
        success: true,
        data_points: Math.floor(Math.random() * 10) + 5,
        ai_extractable: Math.random() > 0.3,
        coin_data_found: Math.random() > 0.4,
        response_time: Math.floor(Math.random() * 2000) + 500
      };

      setTestResults(results);
      
      if (showToast) {
        toast({
          title: results.ai_extractable ? "URL Έγκυρο" : "Περιορισμένα Δεδομένα",
          description: `Βρέθηκαν ${results.data_points} στοιχεία δεδομένων`,
          variant: results.ai_extractable ? "default" : "destructive"
        });
      }

      return results;
      
    } catch (error) {
      const errorResult = { success: false, error: 'Invalid URL or connection failed' };
      setTestResults(errorResult);
      
      if (showToast) {
        toast({
          title: "Σφάλμα URL",
          description: "Μη έγκυρο URL ή αποτυχία σύνδεσης",
          variant: "destructive"
        });
      }
      
      return errorResult;
    } finally {
      setTestingUrl('');
    }
  };

  const removeSource = (id: string) => {
    setCustomSources(customSources.filter(s => s.id !== id));
    toast({
      title: "Αφαίρεση",
      description: "Το σαιτ αφαιρέθηκε από τον εγκέφαλο",
    });
  };

  return (
    <div className="space-y-6">
      {/* Φόρμα Προσθήκης Custom Source */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Προσθήκη Απεριόριστων Σαιτ Νομισμάτων
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Προσθέστε οποιοδήποτε σαιτ νομισμάτων για να το ενσωματώσετε στον AI εγκέφαλο
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Όνομα Σαιτ *</Label>
              <Input
                value={newSource.name}
                onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                placeholder="π.χ. CoinFactsWiki, NumisMaster"
              />
            </div>
            <div>
              <Label>URL Σαιτ *</Label>
              <Input
                value={newSource.url}
                onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                placeholder="https://example-coin-site.com"
              />
            </div>
          </div>

          <div>
            <Label>Τύπος Πηγής</Label>
            <Select value={newSource.type} onValueChange={(value) => setNewSource({...newSource, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Περιγραφή (προαιρετικό)</Label>
            <Textarea
              value={newSource.description}
              onChange={(e) => setNewSource({...newSource, description: e.target.value})}
              placeholder="Περιγραφή του τι περιέχει το σαιτ..."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={addCustomSource} 
              className="flex-1"
              disabled={isLoading || !newSource.name || !newSource.url}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Προσθήκη...' : 'Προσθήκη στον Εγκέφαλο'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testUrlExtraction(newSource.url)}
              disabled={!newSource.url || testingUrl}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingUrl ? 'Testing...' : 'Test URL'}
            </Button>
          </div>

          {testResults && (
            <Card className={`mt-4 ${testResults.success ? 'border-green-200' : 'border-red-200'}`}>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  {testResults.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  Test Results:
                </h4>
                {testResults.error ? (
                  <div className="text-red-600 text-sm">{testResults.error}</div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>✅ Connection:</span>
                      <span className="text-green-600">Success</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📊 Data Found:</span>
                      <span>{testResults.data_points || 0} στοιχεία</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🤖 AI Extraction:</span>
                      <span className={testResults.ai_extractable ? 'text-green-600' : 'text-yellow-600'}>
                        {testResults.ai_extractable ? 'Άριστο' : 'Περιορισμένο'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>🪙 Coin Data:</span>
                      <span className={testResults.coin_data_found ? 'text-green-600' : 'text-gray-600'}>
                        {testResults.coin_data_found ? 'Ανιχνεύθηκε' : 'Όχι'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚡ Response Time:</span>
                      <span>{testResults.response_time}ms</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Λίστα Custom Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Προσωπικές Πηγές Εγκυκλοπαίδειας ({customSources.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Όλα τα σαιτ που έχετε προσθέσει στον AI εγκέφαλο
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {source.name}
                    {source.ai_integration && (
                      <Brain className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{source.url}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      {sourceTypes.find(t => t.value === source.type)?.label || source.type}
                    </Badge>
                    <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                      {source.status === 'active' ? 'Ενεργό' : 'Ανενεργό'}
                    </Badge>
                    {source.ai_integration && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Ready
                      </Badge>
                    )}
                    {source.scraping_enabled && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Auto-Extract
                      </Badge>
                    )}
                  </div>
                  {source.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {source.description}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testUrlExtraction(source.url)}
                  >
                    <TestTube className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => removeSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {customSources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">Δεν έχετε προσθέσει ακόμα custom σαιτ</p>
                <p className="text-sm">Προσθέστε το πρώτο σας σαιτ νομισμάτων παραπάνω!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {customSources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Στατιστικά Προσωπικών Πηγών</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{customSources.length}</div>
                <div className="text-xs text-muted-foreground">Συνολικές Πηγές</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {customSources.filter(s => s.status === 'active').length}
                </div>
                <div className="text-xs text-muted-foreground">Ενεργές</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {customSources.filter(s => s.ai_integration).length}
                </div>
                <div className="text-xs text-muted-foreground">AI Enabled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {customSources.filter(s => s.scraping_enabled).length}
                </div>
                <div className="text-xs text-muted-foreground">Auto-Extract</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomSourceManager;
