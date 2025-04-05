
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CoinCard from '@/components/CoinCard';
import { Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';

// Sample extended coin data for marketplace
const marketplaceCoins = [
  {
    id: '1',
    name: '10 Drachmai',
    year: 1959,
    grade: 'MS66',
    price: 55.00,
    rarity: 'Uncommon' as const,
    image: 'https://www.karamitsos.com/img/lots/559/127028.jpg',
    isAuction: true,
    timeLeft: '2d 5h',
  },
  {
    id: '2',
    name: 'Morgan Dollar',
    year: 1879,
    grade: 'MS67',
    price: 1250.00,
    rarity: 'Rare' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/1879S_Morgan_Dollar_NGC_MS67plus_Obverse.png',
  },
  {
    id: '3',
    name: 'British Sovereign',
    year: 1817,
    grade: 'AU58',
    price: 525.00,
    rarity: 'Uncommon' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Great_Britain_1817_Half_Sovereign.jpg/1200px-Great_Britain_1817_Half_Sovereign.jpg',
    isAuction: true,
    timeLeft: '6h 15m',
  },
  {
    id: '4',
    name: '1 Lepton',
    year: 1857,
    grade: 'VF30',
    price: 35.00,
    rarity: 'Common' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/One_lepton_of_Greece_1857_%28reverse%29.jpg',
  },
  {
    id: '5',
    name: 'Ancient Tetradrachm',
    year: -350,
    grade: 'XF',
    price: 1800.00,
    rarity: 'Rare' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/29/ATTICA%2C_Athens._Circa_454-404_BC.jpg',
    isAuction: true,
    timeLeft: '1d 12h',
  },
  {
    id: '6',
    name: '20 Drachmai',
    year: 1960,
    grade: 'MS63',
    price: 75.00,
    rarity: 'Common' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Greece_20_drachmai_1960_obv.jpg',
  },
  {
    id: '7',
    name: 'Byzantine Solidus',
    year: 720,
    grade: 'AU55',
    price: 950.00,
    rarity: 'Rare' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Solidus-Leo_III_and_Constantine_V-sb1504.jpg',
  },
  {
    id: '8',
    name: '5 Lepta',
    year: 1882,
    grade: 'VF20',
    price: 45.00,
    rarity: 'Uncommon' as const,
    image: 'https://en.numista.com/catalogue/photos/grece/g1163.jpg',
    isAuction: true,
    timeLeft: '3d 8h',
  },
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuctionOnly, setIsAuctionOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'year'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const filteredCoins = marketplaceCoins
    .filter(coin => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return coin.name.toLowerCase().includes(searchLower) || 
               coin.year.toString().includes(searchLower) ||
               coin.grade.toLowerCase().includes(searchLower);
      }
      return true;
    })
    .filter(coin => {
      // Apply auction filter
      if (isAuctionOnly) {
        return coin.isAuction === true;
      }
      return true;
    })
    .filter(coin => {
      // Apply rarity filter
      if (selectedRarity) {
        return coin.rarity === selectedRarity;
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return sortDirection === 'asc' ? a.year - b.year : b.year - a.year;
      }
    });

  const handleSort = (field: 'price' | 'year') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-coin-blue">Coin Marketplace</h1>
              <p className="mt-2 text-gray-600">
                Browse and bid on collectible coins from around the world
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search coins..."
                  className="coin-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filters:</span>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auctionOnly"
                  className="mr-2"
                  checked={isAuctionOnly}
                  onChange={() => setIsAuctionOnly(!isAuctionOnly)}
                />
                <label htmlFor="auctionOnly" className="text-gray-600">Auctions only</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-gray-600">Rarity:</label>
                <select
                  className="border border-gray-300 rounded-md p-1 text-sm"
                  value={selectedRarity || ''}
                  onChange={(e) => setSelectedRarity(e.target.value || null)}
                >
                  <option value="">All</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Ultra Rare">Ultra Rare</option>
                </select>
              </div>
              
              <div className="ml-auto flex space-x-4">
                <button
                  onClick={() => handleSort('price')}
                  className={`flex items-center text-sm ${sortBy === 'price' ? 'text-coin-gold font-medium' : 'text-gray-600'}`}
                >
                  Price
                  {sortBy === 'price' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp size={16} className="ml-1" /> : 
                    <ArrowDown size={16} className="ml-1" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('year')}
                  className={`flex items-center text-sm ${sortBy === 'year' ? 'text-coin-gold font-medium' : 'text-gray-600'}`}
                >
                  Year
                  {sortBy === 'year' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp size={16} className="ml-1" /> : 
                    <ArrowDown size={16} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {filteredCoins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No coins found matching your criteria.</p>
              <button 
                className="mt-4 text-coin-gold underline"
                onClick={() => {
                  setSearchTerm('');
                  setIsAuctionOnly(false);
                  setSelectedRarity(null);
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCoins.map((coin) => (
                <CoinCard key={coin.id} {...coin} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
