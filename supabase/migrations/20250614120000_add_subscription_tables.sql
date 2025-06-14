
-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  features text[] DEFAULT '{}',
  duration_days integer NOT NULL DEFAULT 30,
  popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

-- Policies for user_subscriptions (users can view their own)
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert some default subscription plans
INSERT INTO public.subscription_plans (name, price, currency, features, duration_days, popular) VALUES
('dealer_premium', 49, 'USD', ARRAY['Enhanced AI Analysis', 'Priority Listing', 'Advanced Analytics', '1000+ Coin Listings', 'Premium Badge'], 30, false),
('dealer_pro', 99, 'USD', ARRAY['All Premium Features', 'Unlimited Listings', 'Featured Store Placement', 'Custom Store Branding', 'API Access', 'Bulk Upload Tools'], 30, true),
('dealer_enterprise', 199, 'USD', ARRAY['All Pro Features', 'White-label Store', 'Custom Domain', 'Dedicated Support', 'Advanced Integrations', 'Multi-store Management'], 30, false),
('admin_pro', 99, 'USD', ARRAY['Advanced Analytics Dashboard', 'Premium AI Features', 'Priority Support', 'Extended API Access', 'Custom Reporting'], 30, false),
('admin_enterprise', 299, 'USD', ARRAY['All Pro Features', 'White-label Solution', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantee', 'Advanced Security'], 30, true)
ON CONFLICT (name) DO NOTHING;
