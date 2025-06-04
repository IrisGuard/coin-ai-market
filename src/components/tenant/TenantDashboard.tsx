
import React, { useState } from 'react';
import { useTenants, useCreateTenant, useAddCustomDomain } from '@/hooks/useTenants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Globe, CreditCard, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const TenantDashboard = () => {
  const { data: tenants = [], isLoading } = useTenants();
  const createTenant = useCreateTenant();
  const addCustomDomain = useAddCustomDomain();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    settings: {
      description: '',
      primary_color: '#1F2937',
      secondary_color: '#3B82F6'
    }
  });
  
  const [newDomain, setNewDomain] = useState('');

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.domain) return;
    
    await createTenant.mutateAsync({
      name: newTenant.name,
      domain: newTenant.domain,
      settings: newTenant.settings
    });
    
    setIsCreateOpen(false);
    setNewTenant({
      name: '',
      domain: '',
      settings: {
        description: '',
        primary_color: '#1F2937',
        secondary_color: '#3B82F6'
      }
    });
  };

  const handleAddDomain = async () => {
    if (!newDomain || !selectedTenant) return;
    
    await addCustomDomain.mutateAsync({
      tenantId: selectedTenant,
      domain: newDomain
    });
    
    setIsDomainOpen(false);
    setNewDomain('');
    setSelectedTenant('');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Management</h1>
          <p className="text-gray-600 mt-2">Manage your coin marketplaces and custom domains</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-brand-primary to-electric-blue">
              <Plus className="w-4 h-4 mr-2" />
              Create Marketplace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Marketplace</DialogTitle>
              <DialogDescription>
                Set up a new coin marketplace with custom branding
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Marketplace Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="My Coin Shop"
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={newTenant.domain}
                  onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value.toLowerCase() })}
                  placeholder="mycoinshop.com"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newTenant.settings.description}
                  onChange={(e) => setNewTenant({ 
                    ...newTenant, 
                    settings: { ...newTenant.settings, description: e.target.value }
                  })}
                  placeholder="Premium rare coins and collectibles"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={newTenant.settings.primary_color}
                    onChange={(e) => setNewTenant({ 
                      ...newTenant, 
                      settings: { ...newTenant.settings, primary_color: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={newTenant.settings.secondary_color}
                    onChange={(e) => setNewTenant({ 
                      ...newTenant, 
                      settings: { ...newTenant.settings, secondary_color: e.target.value }
                    })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateTenant} disabled={createTenant.isPending} className="w-full">
                {createTenant.isPending ? 'Creating...' : 'Create Marketplace'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant, index) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: tenant.settings?.primary_color || '#1F2937' }}
                    >
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tenant.domain}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={tenant.is_active ? "default" : "secondary"}>
                    {tenant.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {tenant.settings?.description && (
                  <p className="text-sm text-gray-600 mb-4">{tenant.settings.description}</p>
                )}
                
                <div className="flex items-center space-x-2 mb-4">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: tenant.settings?.primary_color || '#1F2937' }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: tenant.settings?.secondary_color || '#3B82F6' }}
                  ></div>
                  <span className="text-xs text-gray-500">Brand Colors</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedTenant(tenant.id);
                      setIsDomainOpen(true);
                    }}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Add Custom Domain (€600/year)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Palette className="w-4 h-4 mr-2" />
                    Customize Theme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Domain Dialog */}
      <Dialog open={isDomainOpen} onOpenChange={setIsDomainOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Add a custom domain for €600/year. Your marketplace will be accessible at both the subdomain and custom domain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="domain">Custom Domain</Label>
              <Input
                id="domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="mycoinshop.com"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Premium Feature</span>
              </div>
              <p className="text-sm text-yellow-700">
                Custom domains cost €600 per year and include SSL certificate, DNS management, and 24/7 support.
              </p>
            </div>
            <Button onClick={handleAddDomain} disabled={addCustomDomain.isPending} className="w-full">
              {addCustomDomain.isPending ? 'Adding...' : 'Add Domain & Setup Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantDashboard;
