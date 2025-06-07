
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTabletDevice = /iPad|Android(?=.*Mobile)/i.test(userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice && !isTabletDevice);
      setIsTablet(isTabletDevice);
      setIsTouchDevice(hasTouchScreen);
    };

    checkDevice();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', checkDevice);
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('orientationchange', checkDevice);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isTouchDevice,
    isDesktop: !isMobile && !isTablet
  };
};
