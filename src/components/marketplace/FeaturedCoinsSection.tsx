
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MockCoin {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  store: string;
  condition: string;
  year: number;
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
    year: 1921
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
    year: 1955
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
    year: 1893
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
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Featured Coins
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mockCoins.map((coin) => (
          <Card key={coin.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-orange-300">
            <CardContent className="p-3">
              <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                <img 
                  src={coin.image}
                  alt={coin.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {coin.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-electric-orange">
                    ${coin.price.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 truncate">
                  {coin.seller}
                </p>
                
                <Button 
                  size="sm" 
                  className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white text-xs"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCoinsSection;
