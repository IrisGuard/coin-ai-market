
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
import { Grid3X3, Upload, Eye, TrendingUp, Image, Edit, Trash2, Move, Save } from 'lucide-react';

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
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
    is_active: true
  });

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingImageFor(categoryId);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(filePath);

      // Update category with image URL
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
      is_active: category.is_active
    });
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) return;

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
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Enhanced Category Management
            <Badge variant="outline">{categories.length} categories</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category: Category, index) => (
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
                      <h3 className="font-medium text-sm">{category.name}</h3>
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
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={editForm.icon}
                onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., Coins, Star, Globe"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
              />
            </div>
            
            <div>
              <Label htmlFor="color">Gradient Color</Label>
              <Input
                id="color"
                value={editForm.color}
                onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., from-blue-400 to-indigo-500"
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
    </div>
  );
};

export default EnhancedCategoryManagerWithUpload;
