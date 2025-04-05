import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, ChevronLeft, ShoppingCart, Star, Eye, Shield } from 'lucide-react';

const CoinDetails = () => {
  const { id } = useParams();

  // Mock coin data for demonstration
  const coin = {
    id: '1',
    name: '10 Drachmai',
    year: 1959,
    grade: 'MS66',
    price: 55.00,
    rarity: 'Uncommon',
    image: 'https://www.karamitsos.com/img/lots/559/127028.jpg',
    isAuction: true,
    timeLeft: '2d 5h',
    description: 'A beautiful example of a 1959 Greek 10 Drachmai coin, graded MS66 by NGC. This coin features a stunning design and is a great addition to any collection.',
    condition: 'Mint State',
    origin: 'Greece',
    material: 'Nickel',
    weight: '10 grams',
    dimensions: '30mm diameter',
    ruler: 'Paul I',
    certifications: ['NGC Certified', 'PCGS Graded'],
    authenticityGuarantee: true,
    shippingOptions: ['Worldwide', 'Insured'],
    returnsAccepted: true,
    sellerInfo: {
      username: 'CoinCollector123',
      feedbackScore: 4.8,
      location: 'Athens, Greece'
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a href="/marketplace" className="inline-flex items-center text-coin-blue hover:text-coin-gold">
              <ChevronLeft size={20} className="mr-2" />
              Back to Marketplace
            </a>
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
                
                {coin.isAuction && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock size={16} className="mr-2" />
                    Time Left: {coin.timeLeft}
                  </div>
                )}
                
                <p className="text-gray-700 leading-relaxed mb-6">{coin.description}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-xl font-semibold text-coin-blue mb-3">Coin Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Condition</p>
                      <p className="font-medium">{coin.condition}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Origin</p>
                      <p className="font-medium">{coin.origin}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Material</p>
                      <p className="font-medium">{coin.material}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Weight</p>
                      <p className="font-medium">{coin.weight}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Dimensions</p>
                      <p className="font-medium">{coin.dimensions}</p>
                    </div>
                     <div>
                      <p className="text-gray-500 text-sm">Ruler</p>
                      <p className="font-medium">{coin.ruler}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-coin-blue mb-3">Seller Information</h2>
              <div className="flex items-center">
                <div className="mr-4">
                  <svg className="h-10 w-10 rounded-full bg-gray-300 text-gray-600">
                    {/* Placeholder for user avatar */}
                    <Shield size={40} />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{coin.sellerInfo.username}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star size={14} className="mr-1" />
                    {coin.sellerInfo.feedbackScore} ({Math.floor(Math.random() * 500)} Feedback)
                  </div>
                  <p className="text-sm text-gray-500">Location: {coin.sellerInfo.location}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-coin-blue mb-3">Purchase Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Certifications</p>
                  <ul className="list-disc pl-5">
                    {coin.certifications.map((cert, index) => (
                      <li key={index} className="font-medium">{cert}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Authenticity Guarantee</p>
                  <p className="font-medium">{coin.authenticityGuarantee ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Shipping Options</p>
                  <ul className="list-disc pl-5">
                    {coin.shippingOptions.map((option, index) => (
                      <li key={index} className="font-medium">{option}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Returns Accepted</p>
                  <p className="font-medium">{coin.returnsAccepted ? 'Yes' : 'No'}</p>
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
