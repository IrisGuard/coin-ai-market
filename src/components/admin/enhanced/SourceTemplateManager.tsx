
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Database, Edit, Trash2, Copy } from 'lucide-react';
import { useSourceTemplates } from '@/hooks/useEnhancedAdminSources';

const SourceTemplateManager = () => {
  const { data: templates } = useSourceTemplates();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleClone = (template: any) => {
    setEditingTemplate({
      ...template,
      id: null,
      name: `${template.name} (Copy)`
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Source Templates</h3>
          <p className="text-sm text-muted-foreground">
            Standardized configurations for different source types
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template) => (
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
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
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
                  <Label className="text-xs font-medium">Supported Features</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.supported_features?.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium">Default Configuration</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    <pre className="whitespace-pre-wrap overflow-hidden">
                      {JSON.stringify(template.default_config, null, 2).substring(0, 200)}
                      {JSON.stringify(template.default_config, null, 2).length > 200 && '...'}
                    </pre>
                  </div>
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
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  defaultValue={editingTemplate?.name}
                  placeholder="e.g., Modern Auction House"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description" 
                  defaultValue={editingTemplate?.description}
                  placeholder="Brief description of template usage"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="features">Supported Features (comma-separated)</Label>
              <Input
                id="features"
                defaultValue={editingTemplate?.supported_features?.join(', ')}
                placeholder="search, filters, images, pricing, authentication"
              />
            </div>

            <div>
              <Label htmlFor="config">Default Configuration (JSON)</Label>
              <Textarea
                id="config"
                defaultValue={JSON.stringify(editingTemplate?.default_config || {}, null, 2)}
                placeholder="JSON configuration object"
                className="min-h-[200px] font-mono text-xs"
              />
            </div>

            <div className="flex gap-2">
              <Button>
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SourceTemplateManager;
