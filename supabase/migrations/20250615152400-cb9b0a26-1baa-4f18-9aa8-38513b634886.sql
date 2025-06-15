
-- Create token_locks table for storing user token locks
CREATE TABLE public.token_locks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  duration_months integer NOT NULL,
  lock_date timestamp with time zone NOT NULL DEFAULT now(),
  unlock_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  benefit_percentage numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create wallet_balances table for user GCAI token balances
CREATE TABLE public.wallet_balances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  wallet_address text NOT NULL,
  gcai_balance numeric NOT NULL DEFAULT 0,
  locked_balance numeric NOT NULL DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create referrals table for tracking referral system
CREATE TABLE public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid NOT NULL,
  referred_id uuid,
  referral_code text NOT NULL UNIQUE,
  commission_rate numeric DEFAULT 0.05,
  total_earned numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create token_activity table for logging all token-related activities
CREATE TABLE public.token_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  amount numeric,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create token_info table for storing token configuration
CREATE TABLE public.token_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_supply numeric NOT NULL DEFAULT 1000000000,
  circulating_supply numeric NOT NULL DEFAULT 250000000,
  current_price_usd numeric NOT NULL DEFAULT 0.10,
  treasury_address text NOT NULL,
  usdc_rate numeric NOT NULL DEFAULT 10,
  sol_rate numeric NOT NULL DEFAULT 1000,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create lock_options table for storing lock duration options
CREATE TABLE public.lock_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  duration_months integer NOT NULL,
  benefit_percentage numeric NOT NULL,
  is_popular boolean DEFAULT false,
  is_maximum boolean DEFAULT false,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.token_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lock_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies for token_locks
CREATE POLICY "Users can view their own token locks" 
  ON public.token_locks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token locks" 
  ON public.token_locks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token locks" 
  ON public.token_locks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for wallet_balances
CREATE POLICY "Users can view their own wallet balances" 
  ON public.wallet_balances 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet balances" 
  ON public.wallet_balances 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet balances" 
  ON public.wallet_balances 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create their own referrals" 
  ON public.referrals 
  FOR INSERT 
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their own referrals" 
  ON public.referrals 
  FOR UPDATE 
  USING (auth.uid() = referrer_id);

-- RLS Policies for token_activity
CREATE POLICY "Users can view their own token activity" 
  ON public.token_activity 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token activity" 
  ON public.token_activity 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Public read access for token_info and lock_options
CREATE POLICY "Anyone can read token info" 
  ON public.token_info 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can read lock options" 
  ON public.lock_options 
  FOR SELECT 
  USING (true);

-- Insert default token info
INSERT INTO public.token_info (total_supply, circulating_supply, current_price_usd, treasury_address, usdc_rate, sol_rate)
VALUES (1000000000, 250000000, 0.10, '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 10, 1000);

-- Insert default lock options
INSERT INTO public.lock_options (duration_months, benefit_percentage, is_popular, is_maximum, display_order) VALUES
(3, 5, false, false, 1),
(6, 12, true, false, 2),
(12, 25, false, false, 3),
(18, 40, false, false, 4),
(24, 60, false, false, 5),
(36, 100, false, true, 6);
