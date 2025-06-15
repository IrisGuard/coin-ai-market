
-- Create function to get user subscriptions
CREATE OR REPLACE FUNCTION public.get_user_subscriptions(p_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  plan_name text,
  status text,
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    us.user_id,
    us.plan_name,
    us.status,
    us.expires_at,
    us.cancelled_at,
    us.created_at
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id
  ORDER BY us.created_at DESC;
END;
$$;

-- Create function to get subscription plans
CREATE OR REPLACE FUNCTION public.get_subscription_plans()
RETURNS TABLE(
  id text,
  name text,
  price numeric,
  currency text,
  features text[],
  duration_days integer,
  popular boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.name,
    sp.price,
    sp.currency,
    sp.features,
    sp.duration_days,
    sp.popular
  FROM public.subscription_plans sp
  WHERE sp.is_active = true
  ORDER BY sp.price ASC;
END;
$$;

-- Create function to cancel user subscription
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(p_subscription_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.user_subscriptions 
  SET 
    status = 'cancelled',
    cancelled_at = now()
  WHERE id = p_subscription_id 
    AND user_id = p_user_id;
END;
$$;
