
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Globe, Sparkles } from 'lucide-react';
import { NewCommandForm } from '../types';
import { toast } from '@/hooks/use-toast';

interface AddCommandFormProps {
  onSubmit: (command: NewCommandForm) => void;
  isSubmitting: boolean;
}

const AddCommandForm: React.FC<AddCommandFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<NewCommandForm>({
    name: '',
    description: '',
    code: '',
    category: 'general',
    command_type: 'manual',
    priority: 1,
    execution_timeout: 30000,
    site_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Command name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Command code/instructions are required.",
        variant: "destructive",
      });
      return;
    }

    console.log('➕ Submitting new AI command:', formData);
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      category: 'general',
      command_type: 'manual',
      priority: 1,
      execution_timeout: 30000,
      site_url: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Add New AI Command
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Analyze Coin Image"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="coin-analysis">Coin Analysis</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="recognition">Recognition</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="interface">Interface</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of what this command does"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Site URL (Optional - for website parsing)
            </label>
            <Input
              value={formData.site_url}
              onChange={(e) => setFormData({...formData, site_url: e.target.value})}
              placeholder="https://example.com/coin-page"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If provided, the AI will parse this website for coin information during execution
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Command Code/Instructions *</label>
            <Textarea
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder={formData.site_url ? 
                "Instructions for analyzing the website content..." :
                "Enter the command logic, instructions, or code..."
              }
              rows={8}
              className="w-full font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Type</label>
              <Select 
                value={formData.command_type} 
                onValueChange={(value) => setFormData({...formData, command_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="triggered">Triggered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Priority (1-10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 1})}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Timeout (ms)</label>
              <Input
                type="number"
                min={1000}
                max={300000}
                step={1000}
                value={formData.execution_timeout}
                onChange={(e) => setFormData({...formData, execution_timeout: parseInt(e.target.value) || 30000})}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || !formData.code.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Command
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCommandForm;
