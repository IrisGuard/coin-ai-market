
import { useQuery } from '@tanstack/react-query';

interface Coin {
  id: string;
  name: string;
  price: number;
  image: string;
  year: number;
  grade: string;
  country?: string;
  denomination?: string;
  seller_id?: string;
}

// Mock coins data distributed across dealer stores
const mockCoinsData: Record<string, Coin[]> = {
  '1': [
    {
      id: '1',
      name: '1921 Morgan Silver Dollar',
      price: 125,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1921,
      grade: 'MS-63',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '1'
    },
    {
      id: '11',
      name: '1942/1 Mercury Dime',
      price: 450,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1942,
      grade: 'VF-25',
      country: 'USA',
      denomination: '10 Cents',
      seller_id: '1'
    },
    {
      id: '21',
      name: '1964-D Peace Dollar',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1964,
      grade: 'MS-63',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '1'
    }
  ],
  '2': [
    {
      id: '2',
      name: '1943 Walking Liberty Half',
      price: 85,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1943,
      grade: 'AU-55',
      country: 'USA',
      denomination: '50 Cents',
      seller_id: '2'
    },
    {
      id: '12',
      name: '1877 Indian Head Cent',
      price: 890,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1877,
      grade: 'G-6',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '2'
    },
    {
      id: '22',
      name: '1931-S Lincoln Cent',
      price: 125,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1931,
      grade: 'XF-40',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '2'
    }
  ],
  '3': [
    {
      id: '3',
      name: '1936 Buffalo Nickel',
      price: 45,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1936,
      grade: 'XF-40',
      country: 'USA',
      denomination: '5 Cents',
      seller_id: '3'
    },
    {
      id: '13',
      name: '1964 Kennedy Half Dollar',
      price: 15,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1964,
      grade: 'MS-60',
      country: 'USA',
      denomination: '50 Cents',
      seller_id: '3'
    },
    {
      id: '23',
      name: '1942-P War Nickel',
      price: 45,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1942,
      grade: 'MS-65',
      country: 'USA',
      denomination: '5 Cents',
      seller_id: '3'
    }
  ],
  '4': [
    {
      id: '4',
      name: '1955 Doubled Die Lincoln Cent',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1955,
      grade: 'MS-64',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '4'
    },
    {
      id: '14',
      name: '1950-D Jefferson Nickel',
      price: 35,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1950,
      grade: 'MS-63',
      country: 'USA',
      denomination: '5 Cents',
      seller_id: '4'
    },
    {
      id: '24',
      name: '1926-S Peace Silver Dollar',
      price: 185,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1926,
      grade: 'AU-50',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '4'
    }
  ],
  '5': [
    {
      id: '5',
      name: '1916-D Mercury Dime',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1916,
      grade: 'VF-30',
      country: 'USA',
      denomination: '10 Cents',
      seller_id: '5'
    },
    {
      id: '15',
      name: '1928 Peace Silver Dollar',
      price: 275,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1928,
      grade: 'AU-58',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '5'
    },
    {
      id: '25',
      name: '1955-S Lincoln Cent',
      price: 65,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1955,
      grade: 'MS-64',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '5'
    }
  ],
  '6': [
    {
      id: '6',
      name: '1893-S Morgan Dollar',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1893,
      grade: 'F-15',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '6'
    },
    {
      id: '16',
      name: '1914-D Lincoln Cent',
      price: 195,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1914,
      grade: 'F-12',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '6'
    },
    {
      id: '26',
      name: '1918/7-D Buffalo Nickel',
      price: 2850,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1918,
      grade: 'F-15',
      country: 'USA',
      denomination: '5 Cents',
      seller_id: '6'
    }
  ],
  '7': [
    {
      id: '7',
      name: '1909-S VDB Lincoln Cent',
      price: 750,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1909,
      grade: 'MS-62',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '7'
    },
    {
      id: '17',
      name: '1937-D Three Legged Buffalo',
      price: 825,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1937,
      grade: 'VF-20',
      country: 'USA',
      denomination: '5 Cents',
      seller_id: '7'
    },
    {
      id: '27',
      name: '1965 Silver Quarter',
      price: 125,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1965,
      grade: 'MS-60',
      country: 'USA',
      denomination: '25 Cents',
      seller_id: '7'
    }
  ],
  '8': [
    {
      id: '8',
      name: '1970-S Small Date Lincoln Cent',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1970,
      grade: 'MS-65',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '8'
    },
    {
      id: '18',
      name: '1945 Mercury Dime',
      price: 25,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1945,
      grade: 'MS-64',
      country: 'USA',
      denomination: '10 Cents',
      seller_id: '8'
    },
    {
      id: '28',
      name: '1942/1-D Mercury Dime',
      price: 485,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1942,
      grade: 'VF-35',
      country: 'USA',
      denomination: '10 Cents',
      seller_id: '8'
    }
  ],
  '9': [
    {
      id: '9',
      name: '1916 Standing Liberty Quarter',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1916,
      grade: 'VG-8',
      country: 'USA',
      denomination: '25 Cents',
      seller_id: '9'
    },
    {
      id: '19',
      name: '1881-S Morgan Silver Dollar',
      price: 65,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1881,
      grade: 'MS-62',
      country: 'USA',
      denomination: '1 Dollar',
      seller_id: '9'
    },
    {
      id: '29',
      name: '1984 Double Die Lincoln Cent',
      price: 285,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1984,
      grade: 'MS-63',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '9'
    }
  ],
  '10': [
    {
      id: '10',
      name: '1932-D Washington Quarter',
      price: 125,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      year: 1932,
      grade: 'XF-45',
      country: 'USA',
      denomination: '25 Cents',
      seller_id: '10'
    },
    {
      id: '20',
      name: '1922 No D Lincoln Cent',
      price: 485,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
      year: 1922,
      grade: 'VF-30',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '10'
    },
    {
      id: '30',
      name: '1949-S Lincoln Cent',
      price: 45,
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=400&fit=crop',
      year: 1949,
      grade: 'MS-65',
      country: 'USA',
      denomination: '1 Cent',
      seller_id: '10'
    }
  ]
};

export const useDealerCoins = (dealerId: string) => {
  return useQuery({
    queryKey: ['dealer-coins', dealerId],
    queryFn: async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCoinsData[dealerId] || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
