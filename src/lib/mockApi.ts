
// Complete Mock API for development - replacing Supabase functionality
// This provides all the functionality needed for the CoinVision AI platform

export interface MockUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  reputation?: number;
}

export interface MockSession {
  user: MockUser;
  access_token: string;
}

export interface MockCoin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
  image: string;
  obverseImage?: string;
  reverseImage?: string;
  isAuction?: boolean;
  timeLeft?: string;
  favorites?: number;
}

class MockAPI {
  private currentUser: MockUser | null = null;
  private isAuthenticated: boolean = false;

  // Authentication Methods
  async signInWithPassword(email: string, password: string) {
    // Mock login validation
    if (email && password) {
      this.currentUser = {
        id: 'mock-user-' + Date.now(),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        reputation: 85
      };
      this.isAuthenticated = true;
      localStorage.setItem('mock_user', JSON.stringify(this.currentUser));
      localStorage.setItem('mock_authenticated', 'true');
      
      return {
        data: {
          session: {
            user: this.currentUser,
            access_token: 'mock-token-' + Date.now()
          }
        },
        error: null
      };
    }
    
    return {
      data: { session: null },
      error: { message: 'Invalid credentials' }
    };
  }

  async signUp(email: string, password: string, options?: any) {
    this.currentUser = {
      id: 'mock-user-' + Date.now(),
      email,
      name: options?.data?.name || email.split('@')[0],
      created_at: new Date().toISOString(),
      reputation: 0
    };
    this.isAuthenticated = true;
    localStorage.setItem('mock_user', JSON.stringify(this.currentUser));
    localStorage.setItem('mock_authenticated', 'true');

    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async signOut() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_authenticated');
    return { error: null };
  }

  async getCurrentUser(): Promise<MockUser | null> {
    const stored = localStorage.getItem('mock_user');
    const isAuth = localStorage.getItem('mock_authenticated') === 'true';
    
    if (stored && isAuth) {
      this.currentUser = JSON.parse(stored);
      this.isAuthenticated = true;
      return this.currentUser;
    }
    
    return null;
  }

  async getSession() {
    const user = await this.getCurrentUser();
    return {
      data: { 
        session: user ? {
          user,
          access_token: 'mock-token'
        } : null 
      },
      error: null
    };
  }

  // Coin Management
  async getFeaturedCoins(): Promise<MockCoin[]> {
    return [
      {
        id: '1',
        name: '1909-S VDB Lincoln Cent',
        year: 1909,
        grade: 'MS-65',
        price: 1200,
        rarity: 'Ultra Rare',
        image: '/placeholder.svg',
        favorites: 45
      },
      {
        id: '2',
        name: 'Morgan Silver Dollar',
        year: 1878,
        grade: 'AU-58',
        price: 350,
        rarity: 'Rare',
        image: '/placeholder.svg',
        favorites: 23
      },
      {
        id: '3',
        name: 'Mercury Dime',
        year: 1916,
        grade: 'XF-40',
        price: 85,
        rarity: 'Uncommon',
        image: '/placeholder.svg',
        isAuction: true,
        timeLeft: '2h 15m',
        favorites: 12
      },
      {
        id: '4',
        name: 'Standing Liberty Quarter',
        year: 1920,
        grade: 'VF-30',
        price: 150,
        rarity: 'Common',
        image: '/placeholder.svg',
        favorites: 8
      }
    ];
  }

  async getMarketplaceCoins(): Promise<MockCoin[]> {
    const featured = await this.getFeaturedCoins();
    return [...featured, ...Array(8).fill(null).map((_, i) => ({
      id: `marketplace-${i + 5}`,
      name: `Historic Coin ${i + 5}`,
      year: 1850 + i * 10,
      grade: ['MS-65', 'AU-58', 'XF-40', 'VF-30'][i % 4],
      price: Math.floor(Math.random() * 1000) + 50,
      rarity: ['Common', 'Uncommon', 'Rare', 'Ultra Rare'][i % 4] as any,
      image: '/placeholder.svg',
      favorites: Math.floor(Math.random() * 50)
    }))];
  }

  async getCoinById(id: string): Promise<MockCoin | null> {
    const coins = await this.getMarketplaceCoins();
    return coins.find(coin => coin.id === id) || null;
  }

  // Favorites
  async checkFavorite(userId: string, coinId: string): Promise<boolean> {
    const favorites = JSON.parse(localStorage.getItem('mock_favorites') || '[]');
    return favorites.some((fav: any) => fav.userId === userId && fav.coinId === coinId);
  }

  async addFavorite(userId: string, coinId: string): Promise<void> {
    const favorites = JSON.parse(localStorage.getItem('mock_favorites') || '[]');
    favorites.push({ userId, coinId, created_at: new Date().toISOString() });
    localStorage.setItem('mock_favorites', JSON.stringify(favorites));
  }

  async removeFavorite(userId: string, coinId: string): Promise<void> {
    const favorites = JSON.parse(localStorage.getItem('mock_favorites') || '[]');
    const filtered = favorites.filter((fav: any) => !(fav.userId === userId && fav.coinId === coinId));
    localStorage.setItem('mock_favorites', JSON.stringify(filtered));
  }

  // Bidding
  async placeBid(coinId: string, userId: string, amount: number): Promise<void> {
    const bids = JSON.parse(localStorage.getItem('mock_bids') || '[]');
    bids.push({
      coinId,
      userId,
      amount,
      time: new Date().toISOString()
    });
    localStorage.setItem('mock_bids', JSON.stringify(bids));
  }

  // Coin Analysis
  async analyzeCoin(images: File[]): Promise<any> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      identification: {
        name: 'Morgan Silver Dollar',
        year: 1878,
        mint: 'Philadelphia',
        denomination: 'One Dollar',
        confidence: 0.95
      },
      grading: {
        grade: 'AU-58',
        condition: 'About Uncirculated',
        details: 'Light wear on highest points, good luster',
        confidence: 0.88
      },
      valuation: {
        lowEstimate: 280,
        highEstimate: 350,
        marketValue: 315,
        confidence: 0.92
      },
      rarity: 'Uncommon',
      errors: [],
      authenticity: {
        isAuthentic: true,
        confidence: 0.94
      }
    };
  }

  // Image Upload Mock
  async uploadImages(images: File[]): Promise<string[]> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return images.map((_, index) => 
      `https://mock-storage.com/images/${Date.now()}-${index}.jpg`
    );
  }

  // Notifications
  async getNotifications(userId: string): Promise<any[]> {
    return [
      {
        id: '1',
        message: 'Welcome to CoinVision AI!',
        type: 'info',
        created_at: new Date().toISOString(),
        is_read: false
      }
    ];
  }

  // Admin functions
  async getUsers(): Promise<MockUser[]> {
    return [
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Smith',
        avatar_url: '',
        reputation: 85,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'jane@example.com',
        name: 'Jane Doe',
        avatar_url: '',
        reputation: 92,
        created_at: new Date().toISOString()
      }
    ];
  }

  async getTransactions(): Promise<any[]> {
    return [
      {
        id: '1',
        coin_id: 'coin1',
        seller_id: 'user1',
        buyer_id: 'user2',
        amount: 1500,
        status: 'completed',
        transaction_type: 'purchase',
        created_at: new Date().toISOString()
      }
    ];
  }

  async getSystemStats(): Promise<any> {
    return {
      listed_coins: 1245,
      active_auctions: 126,
      registered_users: 45729,
      total_volume: 1200000,
      weekly_transactions: 342
    };
  }

  // Auth state change mock
  onAuthStateChange(callback: Function) {
    // Simulate auth state changes
    setTimeout(() => {
      callback('SIGNED_IN', { user: this.currentUser });
    }, 100);

    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
}

// Export the singleton instance
export const mockApi = new MockAPI();

// Backward compatibility exports
export const MockAuthAPI = {
  signInWithPassword: (email: string, password: string) => mockApi.signInWithPassword(email, password),
  signUp: (email: string, password: string, options?: any) => mockApi.signUp(email, password, options),
  signOut: () => mockApi.signOut(),
  getSession: () => mockApi.getSession(),
  onAuthStateChange: (callback: Function) => mockApi.onAuthStateChange(callback)
};

export const MockDatabaseAPI = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock database' } }),
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      in: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock database' } })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: { message: 'Mock database' } })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: { message: 'Mock database' } })
    })
  }),
  rpc: (functionName: string, params?: any) => Promise.resolve({ data: null, error: { message: 'Mock database' } })
};

export const mockSupabase = {
  auth: MockAuthAPI,
  from: MockDatabaseAPI.from,
  rpc: MockDatabaseAPI.rpc,
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Mock storage' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
};
