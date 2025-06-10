
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnhancedCategories, useCategoryImageUpload } from '@/hooks/admin/useEnhancedCategories';
import { Grid3X3, Upload, Eye, TrendingUp, Image } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EnhancedCategoryManager = () => {
  const { data: categories, isLoading } = useEnhancedCategories();
  const imageUploadMutation = useCategoryImageUpload();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(null);

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingImageFor(categoryId);
    try {
      await imageUploadMutation.mutateAsync({ categoryId, file });
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading enhanced categories...</p>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category: Category) => (
              <Card key={category.id} className="relative overflow-hidden">
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
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
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
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description || 'No description available'}
                    </p>

                    {/* Basic Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Grid3X3 className="w-3 h-3 text-blue-600" />
                        <span>Order: {category.display_order}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-green-600" />
                        <span>Icon: {category.icon || 'None'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{category.name} - Category Details</DialogTitle>
                          </DialogHeader>
                          {selectedCategory && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {selectedCategory.display_order}
                                  </div>
                                  <div className="text-sm text-blue-800">Display Order</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    {selectedCategory.is_active ? 'Active' : 'Inactive'}
                                  </div>
                                  <div className="text-sm text-green-800">Status</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Category Details</Label>
                                <div className="p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                                  <p><strong>Icon:</strong> {selectedCategory.icon || 'None'}</p>
                                  <p><strong>Description:</strong> {selectedCategory.description || 'No description'}</p>
                                  <p><strong>Created:</strong> {new Date(selectedCategory.created_at).toLocaleDateString()}</p>
                                  <p><strong>Updated:</strong> {new Date(selectedCategory.updated_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCategoryManager;
