
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Call the increment_page_view function
        const { error } = await supabase.rpc('increment_page_view', {
          page_path_param: location.pathname
        });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    // Track page view with a small delay to ensure proper rendering
    const timer = setTimeout(trackPageView, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
