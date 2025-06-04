
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, ChevronLeft, ShoppingCart, Star, Eye, Shield, Loader2 } from 'lucide-react';
import { useSingleCoin } from '@/hooks/use-single-coin';

const CoinDetails = () => {
  const { id } = useParams();
  
  if (!id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Invalid coin ID</h1>
              <Link to="/marketplace" className="text-coin-blue hover:text-coin-gold mt-4 inline-block">
                Return to Marketplace
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: coin, isLoading, isError } = useSingleCoin(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-coin-purple" />
              <span className="ml-2 text-gray-600">Loading coin details...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !coin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Coin not found</h1>
              <p className="text-gray-600 mb-6">
                The coin you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/marketplace" className="coin-button inline-flex items-center px-6 py-3">
                <ChevronLeft size={20} className="mr-2" />
                Back to Marketplace
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/marketplace" className="inline-flex items-center text-coin-blue hover:text-coin-gold">
              <ChevronLeft size={20} className="mr-2" />
              Back to Marketplace
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-6">
                <img 
                  src={coin.image} 
                  alt={coin.name} 
                  className="w-full h-auto object-contain rounded-lg" 
                />
              </div>
              
              <div className="md:w-1/2 p-6">
                <h1 className="text-3xl font-serif font-bold text-coin-blue mb-2">{coin.name}</h1>
                <p className="text-gray-600 mb-4">
                  {coin.year} | {coin.grade} | {coin.rarity}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-semibold text-coin-gold flex items-center">
                    ${coin.price.toFixed(2)}
                  </div>
                  <button className="coin-button">
                    {coin.isAuction ? 'Place Bid' : 'Buy Now'}
                  </button>
                </div>
                
                {coin.isAuction && coin.timeLeft && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock size={16} className="mr-2" />
                    Time Left: {coin.timeLeft}
                  </div>
                )}
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {coin.description || `A beautiful ${coin.year} ${coin.name} in ${coin.grade} condition.`}
                </p>
                
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-xl font-semibold text-coin-blue mb-3">Coin Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Condition</p>
                      <p className="font-medium">{coin.condition || coin.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Country</p>
                      <p className="font-medium">{coin.country || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Composition</p>
                      <p className="font-medium">{coin.composition || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Weight</p>
                      <p className="font-medium">{coin.weight ? `${coin.weight}g` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Diameter</p>
                      <p className="font-medium">{coin.diameter ? `${coin.diameter}mm` : 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoinDetails;
