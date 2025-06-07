
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useDealerStores } from '@/hooks/useDealerStores';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import DealerStoresGrid from "@/components/marketplace/DealerStoresGrid";
import { Store, Users, Shield, TrendingUp } from 'lucide-react';

const ActiveMarketplace = () => {
  usePageView();
  usePerformanceMonitoring('ActiveMarketplace');
  
  const { data: stores = [], isLoading } = useDealerStores();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
            Dealer Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover authenticated coins from verified dealers worldwide. Browse professional stores and find the perfect addition to your collection.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-electric-purple rounded-lg flex items-center justify-center mr-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Verified Stores</h3>
                <p className="text-2xl font-bold text-electric-blue">{stores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-green to-electric-emerald rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Dealers</h3>
                <p className="text-2xl font-bold text-electric-green">{stores.filter(s => s.verified_dealer).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-orange to-electric-red rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
                <p className="text-2xl font-bold text-electric-orange">
                  {stores.length > 0 ? (stores.reduce((acc, store) => acc + (store.rating || 5), 0) / stores.length).toFixed(1) : '5.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-purple to-electric-pink rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Global Reach</h3>
                <p className="text-2xl font-bold text-electric-purple">25+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <MarketplaceSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Results Stats */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-electric-blue">
              {stores.filter(store => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                return (
                  store.username?.toLowerCase().includes(searchLower) ||
                  store.full_name?.toLowerCase().includes(searchLower) ||
                  store.bio?.toLowerCase().includes(searchLower) ||
                  store.location?.toLowerCase().includes(searchLower)
                );
              }).length}
            </span> of <span className="font-semibold text-electric-purple">{stores.length}</span> dealer stores
          </p>
        </div>

        {/* Dealer Stores Grid */}
        <DealerStoresGrid 
          stores={stores}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ActiveMarketplace;
