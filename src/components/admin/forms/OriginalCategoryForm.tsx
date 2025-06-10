
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Grid3X3, Plus, Settings } from 'lucide-react';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';
import { toast } from '@/hooks/use-toast';
import CategoryCard from './CategoryCard';

const OriginalCategoryForm = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Basic Category Settings
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
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginalCategoryForm;
