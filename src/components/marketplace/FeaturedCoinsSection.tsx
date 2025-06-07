
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Eye, Heart } from 'lucide-react';

interface MockCoin {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  store: string;
  condition: string;
  year: number;
  featured?: boolean;
}

const mockCoins: MockCoin[] = [
  {
    id: '1',
    title: '1921 Morgan Silver Dollar',
    price: 125,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'CoinMaster Pro',
    store: '1',
    condition: 'MS-63',
    year: 1921,
    featured: true
  },
  {
    id: '2',
    title: '1943 Walking Liberty Half',
    price: 85,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Heritage Coins',
    store: '2',
    condition: 'AU-55',
    year: 1943
  },
  {
    id: '3',
    title: '1936 Buffalo Nickel',
    price: 45,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Ancient Treasures',
    store: '3',
    condition: 'XF-40',
    year: 1936
  },
  {
    id: '4',
    title: '1955 Doubled Die Lincoln Cent',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Modern Mints',
    store: '4',
    condition: 'MS-64',
    year: 1955,
    featured: true
  },
  {
    id: '5',
    title: '1916-D Mercury Dime',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Gold Standard',
    store: '5',
    condition: 'VF-30',
    year: 1916
  },
  {
    id: '6',
    title: '1893-S Morgan Dollar',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'The Coin Vault',
    store: '6',
    condition: 'F-15',
    year: 1893,
    featured: true
  },
  {
    id: '7',
    title: '1909-S VDB Lincoln Cent',
    price: 750,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'World Coin Exchange',
    store: '7',
    condition: 'MS-62',
    year: 1909
  },
  {
    id: '8',
    title: '1970-S Small Date Lincoln Cent',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Rare Finds',
    store: '8',
    condition: 'MS-65',
    year: 1970
  },
  {
    id: '9',
    title: '1916 Standing Liberty Quarter',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Coin Connect',
    store: '9',
    condition: 'VG-8',
    year: 1916
  },
  {
    id: '10',
    title: '1932-D Washington Quarter',
    price: 125,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Heritage Coin Company',
    store: '10',
    condition: 'XF-45',
    year: 1932
  },
  {
    id: '11',
    title: '1942/1 Mercury Dime',
    price: 450,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'CoinMaster Pro',
    store: '1',
    condition: 'VF-25',
    year: 1942
  },
  {
    id: '12',
    title: '1877 Indian Head Cent',
    price: 890,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'European Coin Specialists',
    store: '2',
    condition: 'G-6',
    year: 1877
  },
  {
    id: '13',
    title: '1964 Kennedy Half Dollar',
    price: 15,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Ancient Treasures',
    store: '3',
    condition: 'MS-60',
    year: 1964
  },
  {
    id: '14',
    title: '1950-D Jefferson Nickel',
    price: 35,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Modern Mints',
    store: '4',
    condition: 'MS-63',
    year: 1950
  },
  {
    id: '15',
    title: '1928 Peace Silver Dollar',
    price: 275,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Gold Standard',
    store: '5',
    condition: 'AU-58',
    year: 1928
  },
  {
    id: '16',
    title: '1914-D Lincoln Cent',
    price: 195,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'The Coin Vault',
    store: '6',
    condition: 'F-12',
    year: 1914
  },
  {
    id: '17',
    title: '1937-D Three Legged Buffalo',
    price: 825,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'World Coin Exchange',
    store: '7',
    condition: 'VF-20',
    year: 1937
  },
  {
    id: '18',
    title: '1945 Mercury Dime',
    price: 25,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Rare Finds',
    store: '8',
    condition: 'MS-64',
    year: 1945
  },
  {
    id: '19',
    title: '1881-S Morgan Silver Dollar',
    price: 65,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Coin Connect',
    store: '9',
    condition: 'MS-62',
    year: 1881
  },
  {
    id: '20',
    title: '1922 No D Lincoln Cent',
    price: 485,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Heritage Coin Company',
    store: '10',
    condition: 'VF-30',
    year: 1922
  },
  {
    id: '21',
    title: '1964-D Peace Dollar',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'CoinMaster Pro',
    store: '1',
    condition: 'MS-63',
    year: 1964
  },
  {
    id: '22',
    title: '1931-S Lincoln Cent',
    price: 125,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'European Coin Specialists',
    store: '2',
    condition: 'XF-40',
    year: 1931
  },
  {
    id: '23',
    title: '1942-P War Nickel',
    price: 45,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Ancient Treasures',
    store: '3',
    condition: 'MS-65',
    year: 1942
  },
  {
    id: '24',
    title: '1926-S Peace Silver Dollar',
    price: 185,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Modern Mints',
    store: '4',
    condition: 'AU-50',
    year: 1926
  },
  {
    id: '25',
    title: '1955-S Lincoln Cent',
    price: 65,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Gold Standard',
    store: '5',
    condition: 'MS-64',
    year: 1955
  },
  {
    id: '26',
    title: '1918/7-D Buffalo Nickel',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'The Coin Vault',
    store: '6',
    condition: 'F-15',
    year: 1918
  },
  {
    id: '27',
    title: '1965 Silver Quarter',
    price: 125,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'World Coin Exchange',
    store: '7',
    condition: 'MS-60',
    year: 1965
  },
  {
    id: '28',
    title: '1942/1-D Mercury Dime',
    price: 485,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    seller: 'Rare Finds',
    store: '8',
    condition: 'VF-35',
    year: 1942
  },
  {
    id: '29',
    title: '1984 Double Die Lincoln Cent',
    price: 285,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    seller: 'Coin Connect',
    store: '9',
    condition: 'MS-63',
    year: 1984
  },
  {
    id: '30',
    title: '1949-S Lincoln Cent',
    price: 45,
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
    seller: 'Heritage Coin Company',
    store: '10',
    condition: 'MS-65',
    year: 1949
  }
];

const FeaturedCoinsSection = () => {
  // Show more coins for larger screens
  const displayCoins = mockCoins.slice(0, 12);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Coins
          </h2>
          <p className="text-lg text-gray-600">
            Hand-picked treasures from verified dealers worldwide
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white">
            View All
          </Button>
        </Link>
      </div>
      
      {/* Responsive grid that adapts to screen size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-6">
        {displayCoins.map((coin) => (
          <Card key={coin.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={coin.image}
                    alt={coin.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {coin.featured && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Featured
                  </div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-3 lg:p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight text-sm lg:text-base">
                  {coin.title}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${coin.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {coin.condition}
                  </span>
                </div>
                
                <p className="text-xs lg:text-sm text-gray-600 mb-3 truncate">
                  {coin.seller}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white text-xs lg:text-sm"
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="px-2 lg:px-3 border-gray-200 hover:border-gray-300"
                  >
                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCoinsSection;
