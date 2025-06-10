
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CategoryFormDialogProps {
  category: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    image_url?: string;
    display_order: number;
    is_active: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (categoryId: string, updates: any) => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  category,
  open,
  onOpenChange,
  onUpdate
}) => {
  const [editingCategory, setEditingCategory] = useState(category);

  useEffect(() => {
    setEditingCategory(category);
  }, [category]);

  const handleUpdate = () => {
    onUpdate(editingCategory.id, editingCategory);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
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
          <Button onClick={handleUpdate} className="w-full">
            Update Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
