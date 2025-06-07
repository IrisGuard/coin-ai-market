
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/hooks/useStores';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Gavel, ArrowLeft } from 'lucide-react';
import CoinUploadForm from '@/components/upload/CoinUploadForm';

const CoinUpload = () => {
  const { user } = useAuth();
  const { data: store } = useUserStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'direct' | 'auction' | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'direct' || type === 'auction') {
      setSelectedType(type);
    }
  }, [searchParams]);

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Create New Listing
              </h1>
              <p className="text-gray-600">
                Choose how you want to sell your coin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-orange-300"
                onClick={() => setSelectedType('direct')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Direct Sale</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3">
                    <Badge className="bg-green-100 text-green-700">Fixed Price</Badge>
                    <p className="text-gray-600">
                      Set a fixed price for immediate purchase. Buyers can purchase instantly without waiting.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Immediate payment</li>
                      <li>• No bidding period</li>
                      <li>• Best for quick sales</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-red-300"
                onClick={() => setSelectedType('auction')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                    <Gavel className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Auction</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3">
                    <Badge className="bg-orange-100 text-orange-700">Competitive Bidding</Badge>
                    <p className="text-gray-600">
                      Let buyers compete with bids to potentially get a higher price than expected.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Set auction duration</li>
                      <li>• Competitive bidding</li>
                      <li>• Potentially higher returns</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedType(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Listing Type
            </Button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {selectedType === 'direct' ? (
                  <Package className="w-6 h-6 text-green-600" />
                ) : (
                  <Gavel className="w-6 h-6 text-orange-600" />
                )}
                <h1 className="text-2xl font-bold text-gray-900">
                  Create {selectedType === 'direct' ? 'Direct Sale' : 'Auction'} Listing
                </h1>
              </div>
              <Badge 
                className={selectedType === 'direct' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
                }
              >
                {selectedType === 'direct' ? 'Fixed Price Sale' : 'Competitive Auction'}
              </Badge>
            </div>
          </div>

          <CoinUploadForm 
            listingType={selectedType} 
            storeId={store?.id}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoinUpload;
