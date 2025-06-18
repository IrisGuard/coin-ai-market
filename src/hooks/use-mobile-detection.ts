
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      
      // Mobile detection
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || width <= 768;
      
      // Tablet detection
      const isTabletDevice = (width > 768 && width <= 1024) || 
                           /iPad|Android(?!.*Mobile)/i.test(userAgent);
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};
