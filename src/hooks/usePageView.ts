
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    console.log('Page view:', location.pathname);
  }, [location.pathname]);
};
