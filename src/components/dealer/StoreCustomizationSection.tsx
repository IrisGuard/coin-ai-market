
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Store, Upload, Save, Image, User, Phone, Mail, MapPin } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  description?: string;
  banner_image_url?: string;
  logo_url?: string;
  store_description?: string;
  contact_info?: any;
  user_id: string;
  is_active: boolean;
  verified: boolean;
}

const StoreCustomizationSection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    store_description: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
      website: ''
    }
  });

  const { data: store, isLoading } = useQuery({
    queryKey: ['dealer-store', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || '',
          store_description: data.store_description || '',
          contact_info: data.contact_info || {
            phone: '',
            email: '',
            address: '',
            website: ''
          }
        });
      }
    }
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (updates: Partial<Store>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('stores')
        .upsert({
          user_id: user.id,
          ...updates
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-store', user?.id] });
      toast.success('Store updated successfully');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('Store name already exists. Please choose a different name.');
      } else {
        toast.error(`Failed to update store: ${error.message}`);
      }
    }
  });

  const handleImageUpload = async (file: File, type: 'banner' | 'logo') => {
    if (!user?.id) return;

    const setUploading = type === 'banner' ? setUploadingBanner : setUploadingLogo;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `store-${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stores')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('stores')
        .getPublicUrl(filePath);

      const updateField = type === 'banner' ? 'banner_image_url' : 'logo_url';
      await updateStoreMutation.mutateAsync({
        [updateField]: publicUrl
      });

      toast.success(`Store ${type} uploaded successfully`);
    } catch (error: any) {
      toast.error(`Failed to upload ${type}: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateStoreMutation.mutateAsync({
        name: formData.name,
        store_description: formData.store_description,
        contact_info: formData.contact_info
      });
    } catch (error) {
      // Error handling is done in mutation onError
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading store information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          Store Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Banner */}
        <div>
          <Label className="text-base font-medium">Store Banner</Label>
          <div className="mt-2">
            {store?.banner_image_url ? (
              <div className="relative">
                <img
                  src={store.banner_image_url}
                  alt="Store banner"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'banner');
                      }}
                      disabled={uploadingBanner}
                    />
                    <Button variant="secondary" size="sm" disabled={uploadingBanner}>
                      {uploadingBanner ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-gray-600" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Change Banner
                        </>
                      )}
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload your store banner</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'banner');
                    }}
                    disabled={uploadingBanner}
                  />
                  <Button variant="outline" disabled={uploadingBanner}>
                    {uploadingBanner ? (
                      <div className="animate-spin h-4 w-4 border-b-2 border-gray-600" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Banner
                      </>
                    )}
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Store Logo */}
        <div>
          <Label className="text-base font-medium">Store Logo</Label>
          <div className="mt-2 flex items-center gap-4">
            {store?.logo_url ? (
              <div className="relative">
                <img
                  src={store.logo_url}
                  alt="Store logo"
                  className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                />
                <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'logo');
                    }}
                    disabled={uploadingLogo}
                  />
                  <Upload className="w-4 h-4 text-white" />
                </label>
              </div>
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'logo');
                }}
                disabled={uploadingLogo}
              />
              <Button variant="outline" size="sm" disabled={uploadingLogo}>
                {uploadingLogo ? (
                  <div className="animate-spin h-4 w-4 border-b-2 border-gray-600" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {store?.logo_url ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
            </label>
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="store_name">Store Name *</Label>
            <Input
              id="store_name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your store name"
            />
          </div>
          
          <div>
            <Label htmlFor="store_email">Contact Email</Label>
            <Input
              id="store_email"
              type="email"
              value={formData.contact_info.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, email: e.target.value }
              }))}
              placeholder="store@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="store_phone">Phone Number</Label>
            <Input
              id="store_phone"
              value={formData.contact_info.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, phone: e.target.value }
              }))}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="store_website">Website</Label>
            <Input
              id="store_website"
              value={formData.contact_info.website}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, website: e.target.value }
              }))}
              placeholder="https://yourstore.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="store_address">Store Address</Label>
          <Textarea
            id="store_address"
            value={formData.contact_info.address}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              contact_info: { ...prev.contact_info, address: e.target.value }
            }))}
            placeholder="123 Main Street, City, State, ZIP"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="store_description">Store Description</Label>
          <Textarea
            id="store_description"
            value={formData.store_description}
            onChange={(e) => setFormData(prev => ({ ...prev, store_description: e.target.value }))}
            placeholder="Tell customers about your store, specialties, and what makes you unique..."
            rows={4}
          />
        </div>

        <Button onClick={handleSave} className="w-full" disabled={updateStoreMutation.isLoading}>
          {updateStoreMutation.isLoading ? (
            <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Store Information
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreCustomizationSection;
