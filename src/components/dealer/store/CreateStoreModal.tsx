
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Store, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore } from '@/contexts/AdminStoreContext';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreCreated?: () => void;
}

const countryOptions = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮' }
];

const CreateStoreModal: React.FC<CreateStoreModalProps> = ({ isOpen, onClose, onStoreCreated }) => {
  const { user } = useAuth();
  const { setSelectedStoreId } = useAdminStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Check if user has admin role
      const { data: adminRoles } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const isAdmin = adminRoles && adminRoles.length > 0;
      
      // Create store with proper verification status
      const { data: store, error } = await supabase
        .from('stores')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          user_id: user.id,
          verified: isAdmin, // Auto-verify for admins
          is_active: true,
          address: {
            country: formData.country
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error('Store creation error:', error);
        toast({
          title: "Error creating store",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Store created successfully!",
        description: isAdmin ? "Your store is verified and ready." : "Your store is pending verification.",
      });
      
      // Set as selected store and reset form
      setSelectedStoreId(store.id);
      setFormData({ name: '', country: '', description: '' });
      onStoreCreated?.();
      onClose();
      
    } catch (error: any) {
      console.error('Store creation error:', error);
      toast({
        title: "Error creating store",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-emerald bg-clip-text text-transparent flex items-center gap-2">
                <Store className="w-6 h-6 text-electric-green" />
                Create Your Store
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-600 text-sm">
              Set up your coin store in the marketplace
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Input
                  placeholder="Store Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger className={errors.country ? 'border-red-300' : ''}>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.country}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <Textarea
                  placeholder="Store Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-electric-green to-electric-emerald hover:from-electric-emerald hover:to-electric-cyan"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Store...' : 'Create Store'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateStoreModal;
