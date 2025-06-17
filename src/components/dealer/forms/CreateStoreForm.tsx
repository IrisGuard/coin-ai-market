
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from '@/hooks/use-toast';

interface CreateStoreFormProps {
  onStoreCreated?: (storeId: string) => void;
  onCancel?: () => void;
}

const CreateStoreForm: React.FC<CreateStoreFormProps> = ({ onStoreCreated, onCancel }) => {
  const { user } = useAuth();
  const { isAdminUser } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    },
    phone: '',
    email: '',
    website: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a store",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: store, error } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          address: formData.address,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          website: formData.website.trim() || null,
          is_active: true,
          verified: isAdminUser ? true : false // Auto-verify admin stores
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Store "${formData.name}" created successfully${isAdminUser ? ' and auto-verified' : ''}!`,
      });

      if (onStoreCreated && store) {
        onStoreCreated(store.id);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        address: {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        },
        phone: '',
        email: '',
        website: ''
      });

    } catch (error: any) {
      console.error('Error creating store:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create store",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-6 h-6 text-green-600" />
          Create New Store
          {isAdminUser && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Auto-Verified
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your store name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your store and what you specialize in"
                rows={3}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="New York"
                />
              </div>

              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="NY"
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.address.postal_code}
                  onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select 
                value={formData.address.country} 
                onValueChange={(value) => handleInputChange('address.country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="IT">Italy</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="GR">Greece</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="CH">Switzerland</SelectItem>
                  <SelectItem value="AT">Austria</SelectItem>
                  <SelectItem value="NL">Netherlands</SelectItem>
                  <SelectItem value="BE">Belgium</SelectItem>
                  <SelectItem value="DK">Denmark</SelectItem>
                  <SelectItem value="SE">Sweden</SelectItem>
                  <SelectItem value="NO">Norway</SelectItem>
                  <SelectItem value="FI">Finland</SelectItem>
                  <SelectItem value="GI">Gibraltar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="store@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.yourstore.com"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Store...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 mr-2" />
                  Create Store
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateStoreForm;
