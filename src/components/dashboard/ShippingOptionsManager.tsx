
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ShippingOption {
  type: string;
  provider: string;
  price: number;
  countries: string[];
}

interface ShippingOptionsManagerProps {
  storeId: string;
  currentOptions: ShippingOption[];
}

const SHIPPING_TYPES = [
  'Standard Post',
  'Registered Letter',
  'Registered Parcel',
  'Courier',
  'Express Delivery',
  'Economy Shipping'
];

const PROVIDERS = [
  'ELTA',
  'DHL',
  'FedEx',
  'UPS',
  'ACS',
  'Speedex',
  'Other'
];

const ShippingOptionsManager: React.FC<ShippingOptionsManagerProps> = ({ 
  storeId, 
  currentOptions 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<ShippingOption[]>(currentOptions || []);
  const [newOption, setNewOption] = useState<ShippingOption>({
    type: '',
    provider: '',
    price: 0,
    countries: []
  });

  const updateShippingOptions = useMutation({
    mutationFn: async (shippingOptions: ShippingOption[]) => {
      const { error } = await supabase
        .from('stores')
        .update({ shipping_options: shippingOptions })
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      toast({
        title: "Success",
        description: "Shipping options updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shipping options",
        variant: "destructive",
      });
    }
  });

  const addOption = () => {
    if (!newOption.type || !newOption.provider || newOption.price <= 0) {
      toast({
        title: "Invalid Option",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    updateShippingOptions.mutate(updatedOptions);
    
    setNewOption({
      type: '',
      provider: '',
      price: 0,
      countries: []
    });
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    updateShippingOptions.mutate(updatedOptions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Shipping Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Current Shipping Options</h4>
          {options.length === 0 ? (
            <p className="text-gray-500 text-sm">No shipping options configured</p>
          ) : (
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{option.type}</Badge>
                      <span className="font-medium">{option.provider}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Price: ${option.price} | Countries: {option.countries.length || 'All'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Option */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Add New Shipping Option</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shipping Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newOption.type}
                onChange={(e) => setNewOption({ ...newOption, type: e.target.value })}
              >
                <option value="">Select type</option>
                {SHIPPING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Provider</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newOption.provider}
                onChange={(e) => setNewOption({ ...newOption, provider: e.target.value })}
              >
                <option value="">Select provider</option>
                {PROVIDERS.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newOption.price}
                onChange={(e) => setNewOption({ 
                  ...newOption, 
                  price: parseFloat(e.target.value) || 0 
                })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Countries (comma-separated)</Label>
              <Input
                placeholder="US, CA, EU (leave empty for all)"
                value={newOption.countries.join(', ')}
                onChange={(e) => setNewOption({ 
                  ...newOption, 
                  countries: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                })}
              />
            </div>
          </div>
          
          <Button 
            onClick={addOption}
            disabled={updateShippingOptions.isPending}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shipping Option
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingOptionsManager;
