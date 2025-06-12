
-- Create RLS policies for error_reference_sources (Admin-only access)
ALTER TABLE public.error_reference_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to error reference sources"
ON public.error_reference_sources
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for source_performance_metrics (Admin-only access) 
ALTER TABLE public.source_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to source performance metrics"
ON public.source_performance_metrics
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for vpn_proxies (Admin-only access)
ALTER TABLE public.vpn_proxies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to vpn proxies"
ON public.vpn_proxies
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
