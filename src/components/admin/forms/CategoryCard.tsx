
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { toast } from '@/hooks/use-toast';
import CategoryFormDialog from './CategoryFormDialog';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    image_url?: string;
    display_order: number;
    is_active: boolean;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleUpdateCategory = async (categoryId: string, updates: any) => {
    try {
      await updateCategoryMutation.mutateAsync({ categoryId, updates });
      setShowEditDialog(false);
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

  return (
    <>
      <Card className="relative">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
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

      <CategoryFormDialog
        category={category}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdate={handleUpdateCategory}
      />
    </>
  );
};

export default CategoryCard;
