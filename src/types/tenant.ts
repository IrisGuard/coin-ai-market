export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: unknown;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceTenant extends Tenant {
  description?: string;
  logo_url?: string;
  theme_colors?: Record<string, string>;
  contact_email?: string;
  status?: 'active' | 'inactive' | 'suspended';
  is_active: boolean;
} 