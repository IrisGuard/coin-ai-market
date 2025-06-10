
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Grid3X3, Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminCategoriesTab = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategoryMutation.mutateAsync(newCategory);
      setNewCategory({
        name: '',
        description: '',
        icon: '',
        image_url: '',
        display_order: 0,
        is_active: true
      });
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async (categoryId: string, updates: any) => {
    try {
      await updateCategoryMutation.mutateAsync({ categoryId, updates });
      setEditingCategory(null);
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive"
        });
      }
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
            Category Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Create New Category Form */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Create New Category</h3>
              <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon Name</Label>
                  <Input
                    id="icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    placeholder="e.g., Coins, Star, Globe"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Enter category description"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={newCategory.image_url}
                    onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={newCategory.display_order}
                    onChange={(e) => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Category
                  </Button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Categories</h3>
              {categories?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No categories found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories?.map((category) => (
                    <Card key={category.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge variant={category.is_active ? 'default' : 'secondary'}>
                              {category.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateCategory(category.id, { is_active: !category.is_active })}
                            >
                              {category.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                {editingCategory && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-name">Name</Label>
                                      <Input
                                        id="edit-name"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-description">Description</Label>
                                      <Textarea
                                        id="edit-description"
                                        value={editingCategory.description || ''}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-icon">Icon</Label>
                                      <Input
                                        id="edit-icon"
                                        value={editingCategory.icon || ''}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-image">Image URL</Label>
                                      <Input
                                        id="edit-image"
                                        value={editingCategory.image_url || ''}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                                      />
                                    </div>
                                    <Button
                                      onClick={() => handleUpdateCategory(editingCategory.id, editingCategory)}
                                      className="w-full"
                                    >
                                      Update Category
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        {category.image_url && (
                          <div className="mt-2">
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>Order: {category.display_order}</span>
                          <span>Icon: {category.icon}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategoriesTab;
