
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCategories, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Grid3X3, Upload, Eye, TrendingUp, Image, Edit, Trash2, Move, Save, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

const EnhancedCategoryManagerWithUpload = () => {
  const { data: categories = [], isLoading, refetch } = useCategories();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
    is_active: true,
    display_order: 0
  });

  const availableIcons = [
    'MapPin', 'Globe', 'Crown', 'Coins', 'DollarSign', 'Medal', 
    'Banknote', 'Shield', 'Star', 'Target', 'AlertCircle', 'Clock', 'Zap'
  ];

  const availableColors = [
    'from-red-400 to-blue-500',
    'from-green-400 to-blue-500',
    'from-amber-400 to-orange-500',
    'from-purple-400 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-gray-300 to-gray-500',
    'from-blue-400 to-indigo-500',
    'from-cyan-400 to-blue-500',
    'from-teal-400 to-green-500'
  ];

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingImageFor(categoryId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(filePath);

      await updateCategoryMutation.mutateAsync({
        categoryId,
        updates: { image_url: publicUrl }
      });

      toast.success('Category image uploaded successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImageFor(null);
    }
  };

  const handleFileSelect = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(categoryId, file);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '',
      is_active: category.is_active,
      display_order: category.display_order || 0
    });
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditForm({
      name: '',
      description: '',
      icon: 'Coins',
      color: availableColors[0],
      is_active: true,
      display_order: categories.length + 1
    });
    setSelectedCategory(null);
    setCreateDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (selectedCategory) {
      // Update existing category
      try {
        await updateCategoryMutation.mutateAsync({
          categoryId: selectedCategory.id,
          updates: editForm
        });
        toast.success('Category updated successfully');
        setEditDialogOpen(false);
        setSelectedCategory(null);
        refetch();
      } catch (error: any) {
        toast.error(`Failed to update category: ${error.message}`);
      }
    } else {
      // Create new category
      try {
        const { error } = await supabase
          .from('categories')
          .insert([editForm]);
        
        if (error) throw error;
        
        toast.success('Category created successfully');
        setCreateDialogOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(`Failed to create category: ${error.message}`);
      }
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: category.id,
        updates: { is_active: !category.is_active }
      });
      toast.success(`Category ${category.is_active ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to toggle category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast.success('Category deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading categories...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              <CardTitle>Enhanced Category Management</CardTitle>
              <Badge variant="outline">{categories.length} categories</Badge>
            </div>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category: Category) => (
              <Card
                key={category.id}
                className={`relative overflow-hidden ${!category.is_active ? 'opacity-60' : ''}`}
              >
                <div className="absolute top-2 right-2 cursor-move">
                  <Move className="w-4 h-4 text-gray-400" />
                </div>
                
                <CardContent className="p-4">
                  {/* Category Image */}
                  <div className="relative mb-4">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className={`w-full h-32 bg-gradient-to-br ${category.color || 'from-gray-200 to-gray-300'} rounded-lg flex items-center justify-center text-white`}>
                        <span className="text-lg font-semibold">{category.name}</span>
                      </div>
                    )}
                    
                    {/* Upload Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(category.id, e)}
                          disabled={uploadingImageFor === category.id}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white text-black hover:bg-gray-100"
                          disabled={uploadingImageFor === category.id}
                        >
                          {uploadingImageFor === category.id ? (
                            <div className="animate-spin h-4 w-4 border-b-2 border-gray-600" />
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-1" />
                              Upload
                            </>
                          )}
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm line-clamp-2">{category.name}</h3>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {category.description || 'No description available'}
                    </p>

                    {/* Basic Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span>Order: {category.display_order}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Icon: {category.icon || 'None'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(category)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icon Name</Label>
              <select
                id="icon"
                value={editForm.icon}
                onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="color">Gradient Color</Label>
              <select
                id="color"
                value={editForm.color}
                onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {availableColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={editForm.display_order}
                onChange={(e) => setEditForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                placeholder="Display order"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create_name">Category Name *</Label>
              <Input
                id="create_name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="create_icon">Icon Name</Label>
              <select
                id="create_icon"
                value={editForm.icon}
                onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="create_description">Description</Label>
              <Textarea
                id="create_description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="create_color">Gradient Color</Label>
              <select
                id="create_color"
                value={editForm.color}
                onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {availableColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="create_display_order">Display Order</Label>
              <Input
                id="create_display_order"
                type="number"
                value={editForm.display_order}
                onChange={(e) => setEditForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                placeholder="Display order"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="create_is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="create_is_active">Active</Label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedCategoryManagerWithUpload;
