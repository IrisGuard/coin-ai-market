
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Database, Edit, Trash2, Copy, Loader2 } from 'lucide-react';
import { useRealSourceTemplates, useCreateRealSourceTemplate } from '@/hooks/useRealSourceTemplates';

const SourceTemplateManager = () => {
  const { data: templates, isLoading } = useRealSourceTemplates();
  const createTemplate = useCreateRealSourceTemplate();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleClone = (template: any) => {
    setEditingTemplate({
      ...template,
      id: '',
      name: `${template.name} (Copy)`
    });
    setShowForm(true);
  };

  const handleSubmit = async (formData: FormData) => {
    const templateData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      supported_features: (formData.get('features') as string)?.split(',').map(f => f.trim()).filter(f => f),
      default_config: JSON.parse(formData.get('config') as string || '{}'),
      template_config: JSON.parse(formData.get('config') as string || '{}')
    };

    try {
      await createTemplate.mutateAsync(templateData);
      setShowForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading source templates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Production Source Templates</h3>
          <p className="text-sm text-muted-foreground">
            Active templates for real data source integrations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template: any) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  {template.name}
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleClone(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium">Features</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.supported_features?.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium">Configuration</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    <pre className="whitespace-pre-wrap overflow-hidden">
                      {JSON.stringify(template.default_config || template.template_config, null, 2).substring(0, 150)}
                      {JSON.stringify(template.default_config || template.template_config, null, 2).length > 150 && '...'}
                    </pre>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate && editingTemplate.id ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingTemplate?.name || ''}
                    placeholder="e.g., Live Auction Integration"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={editingTemplate?.description || ''}
                    placeholder="Brief description of template usage"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Supported Features (comma-separated)</Label>
                <Input
                  id="features"
                  name="features"
                  defaultValue={editingTemplate?.supported_features?.join(', ') || ''}
                  placeholder="real-time-pricing, historical-data, authentication"
                />
              </div>

              <div>
                <Label htmlFor="config">Configuration (JSON)</Label>
                <Textarea
                  id="config"
                  name="config"
                  defaultValue={JSON.stringify(editingTemplate?.default_config || editingTemplate?.template_config || {
                    rate_limit: 60,
                    proxy_required: false,
                    data_quality: "production",
                    update_frequency: "hourly"
                  }, null, 2)}
                  placeholder="JSON configuration object"
                  className="min-h-[200px] font-mono text-xs"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    editingTemplate && editingTemplate.id ? 'Update Template' : 'Create Template'
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingTemplate(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SourceTemplateManager;
