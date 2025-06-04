
// Temporary mock API για development μέχρι να ετοιμαστεί το νέο Supabase
// Όλα τα functions επιστρέφουν mock data ή errors

export interface MockUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface MockSession {
  user: MockUser;
  access_token: string;
}

export class MockAuthAPI {
  static async signInWithPassword(email: string, password: string) {
    // Mock login - για development
    return {
      data: {
        session: {
          user: {
            id: 'mock-user-id',
            email,
            created_at: new Date().toISOString()
          },
          access_token: 'mock-token'
        }
      },
      error: null
    };
  }

  static async signUp(email: string, password: string, options?: any) {
    return {
      data: {
        user: {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString()
        }
      },
      error: null
    };
  }

  static async signOut() {
    return { error: null };
  }

  static async getSession() {
    return {
      data: { session: null },
      error: null
    };
  }

  static onAuthStateChange(callback: Function) {
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
}

export class MockDatabaseAPI {
  static from(table: string) {
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'No Supabase connection' } }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        in: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'No Supabase connection' } })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'No Supabase connection' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'No Supabase connection' } })
      })
    };
  }

  static rpc(functionName: string, params?: any) {
    return Promise.resolve({ data: null, error: { message: 'No Supabase connection' } });
  }
}

// Mock supabase object για backward compatibility
export const mockSupabase = {
  auth: MockAuthAPI,
  from: MockDatabaseAPI.from,
  rpc: MockDatabaseAPI.rpc,
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'No storage connection' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
};
