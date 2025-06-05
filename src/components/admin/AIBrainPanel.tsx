
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Globe, Code, Database, Settings, Zap, Link, Download, Upload, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AIBrainPanel = () => {
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState({ name: '', description: '', code: '', category: 'general' });
  const [urlToRead, setUrlToRead] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    provider: 'custom',
    endpoint: '',
    apiKey: '',
    model: '',
    temperature: 0.7,
    maxTokens: 2000
  });

  useEffect(() => {
    loadCommands();
    loadAIConfig();
  }, []);

  const loadCommands = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommands(data || []);
    } catch (error) {
      console.error('Failed to load commands:', error);
    }
  };

  const loadAIConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_configuration')
        .select('*')
        .single();

      if (data && data.config) {
        // Safely parse the JSON config with proper typing
        const config = typeof data.config === 'string' ? JSON.parse(data.config) : data.config;
        setAiConfig(prev => ({
          ...prev,
          ...config
        }));
      }
    } catch (error) {
      console.error('Failed to load AI config:', error);
    }
  };

  const saveCommand = async () => {
    try {
      const { error } = await supabase
        .from('ai_commands')
        .insert([{
          name: newCommand.name,
          description: newCommand.description,
          code: newCommand.code,
          category: newCommand.category,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Command Saved",
        description: "AI command has been added to the brain.",
      });

      setNewCommand({ name: '', description: '', code: '', category: 'general' });
      loadCommands();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const readExternalURL = async () => {
    if (!urlToRead) return;

    setIsReading(true);
    try {
      const { data, error } = await supabase.functions.invoke('url-reader', {
        body: { url: urlToRead }
      });

      if (error) throw error;

      setUrlContent(data.content);
      
      const autoCommand = {
        name: `URL_${new Date().getTime()}`,
        description: `Auto-generated from ${urlToRead}`,
        code: `// Content from ${urlToRead}\n${data.content.substring(0, 1000)}...`,
        category: 'external'
      };

      const { error: saveError } = await supabase
        .from('ai_commands')
        .insert([autoCommand]);

      if (!saveError) {
        toast({
          title: "URL Content Processed",
          description: "Content has been read and added to AI brain.",
        });
        loadCommands();
      }

    } catch (error) {
      toast({
        title: "URL Reading Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsReading(false);
    }
  };

  const updateAIConfig = async () => {
    try {
      const { error } = await supabase
        .from('ai_configuration')
        .upsert([{
          id: 'main',
          config: aiConfig,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "AI Configuration Updated",
        description: "AI brain configuration has been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCommand = async (id) => {
    try {
      const { error } = await supabase
        .from('ai_commands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Command Deleted",
        description: "Command has been removed from AI brain.",
      });
      loadCommands();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportBrain = async () => {
    const brainData = {
      commands,
      config: aiConfig,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(brainData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-brain-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBrain = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const brainData = JSON.parse(text);

      if (brainData.commands) {
        const { error } = await supabase
          .from('ai_commands')
          .insert(brainData.commands.map(cmd => ({
            ...cmd,
            id: undefined,
            created_at: undefined
          })));

        if (error) throw error;
      }

      if (brainData.config) {
        setAiConfig(brainData.config);
        await updateAIConfig();
      }

      toast({
        title: "Brain Imported",
        description: "AI brain has been successfully imported.",
      });
      loadCommands();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <span>AI Brain Control Center</span>
            <Badge variant="secondary">{commands.length} Commands Loaded</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100">
            Configure AI behavior, add custom commands, and read external content. 
            The AI can access any webpage and learn from it.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            External URL Reader
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter any URL to read content..."
              value={urlToRead}
              onChange={(e) => setUrlToRead(e.target.value)}
              className="flex-1"
            />
            <Button onClick={readExternalURL} disabled={isReading || !urlToRead}>
              {isReading ? 'Reading...' : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          {urlContent && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Content Preview:</h4>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{urlContent.substring(0, 500)}...</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">AI Provider</label>
              <Input
                value={aiConfig.provider}
                onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value})}
                placeholder="custom, openai, anthropic, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">API Endpoint</label>
              <Input
                value={aiConfig.endpoint}
                onChange={(e) => setAiConfig({...aiConfig, endpoint: e.target.value})}
                placeholder="https://your-ai-api.com/v1/chat"
              />
            </div>
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                placeholder="Your API key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Model</label>
              <Input
                value={aiConfig.model}
                onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                placeholder="gpt-4, claude-3, custom-model"
              />
            </div>
          </div>
          <Button onClick={updateAIConfig} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Update AI Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            Add New AI Command
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Command name"
              value={newCommand.name}
              onChange={(e) => setNewCommand({...newCommand, name: e.target.value})}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={newCommand.category}
              onChange={(e) => setNewCommand({...newCommand, category: e.target.value})}
            >
              <option value="general">General</option>
              <option value="coin-analysis">Coin Analysis</option>
              <option value="marketplace">Marketplace</option>
              <option value="external">External Content</option>
              <option value="automation">Automation</option>
            </select>
          </div>
          
          <Input
            placeholder="Command description"
            value={newCommand.description}
            onChange={(e) => setNewCommand({...newCommand, description: e.target.value})}
          />
          
          <Textarea
            placeholder="Command code/instructions for AI..."
            value={newCommand.code}
            onChange={(e) => setNewCommand({...newCommand, code: e.target.value})}
            rows={6}
          />
          
          <Button onClick={saveCommand} disabled={!newCommand.name || !newCommand.code}>
            <Database className="w-4 h-4 mr-2" />
            Add to AI Brain
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Brain Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportBrain}>
                <Download className="w-4 h-4 mr-2" />
                Export Brain
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('import-brain')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import Brain
              </Button>
              <input
                id="import-brain"
                type="file"
                accept=".json"
                onChange={importBrain}
                className="hidden"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commands.map((command) => (
              <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{command.name}</h4>
                    <Badge variant="outline">{command.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{command.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Created: {new Date(command.created_at).toLocaleString()}
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteCommand(command.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            
            {commands.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No commands in AI brain yet. Add your first command above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainPanel;
