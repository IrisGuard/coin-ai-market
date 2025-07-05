import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { isTouchDevice, getMobileOrientation, useScreenSize } from '@/utils/responsiveUtils';
import MobileNavigation from './MobileNavigation';
import PWAInstallPrompt from './PWAInstallPrompt';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showPWAPrompt?: boolean;
  className?: string;
}

const MobileOptimizedLayout = ({ 
  children, 
  showNavigation = true, 
  showPWAPrompt = true,
  className = "" 
}: MobileOptimizedLayoutProps) => {
  const isMobile = useIsMobile();
  const isTouch = isTouchDevice();
  const orientation = getMobileOrientation();
  const screenInfo = useScreenSize();

  // Add mobile-specific classes based on device characteristics
  const mobileClasses = [
    className,
    isMobile ? 'mobile-layout' : 'desktop-layout',
    isTouch ? 'touch-device' : 'no-touch',
    `orientation-${orientation}`,
    `screen-${screenInfo.screenSize}`,
    'min-h-screen'
  ].filter(Boolean).join(' ');

  return (
    <div className={mobileClasses}>
      {/* Mobile-optimized safe area handling */}
      <div className="safe-area-inset">
        {/* Main content area */}
        <main className={`
          flex-1 
          ${isMobile ? 'pb-20' : ''} 
          ${showNavigation && isMobile ? 'pb-16' : ''}
        `}>
          {children}
        </main>

        {/* Mobile navigation */}
        {showNavigation && isMobile && (
          <MobileNavigation />
        )}

        {/* PWA install prompt */}
        {showPWAPrompt && isMobile && (
          <PWAInstallPrompt compact={true} />
        )}
      </div>

      {/* Mobile-specific styles are handled via CSS classes and Tailwind */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .mobile-layout {
            --safe-area-inset-top: env(safe-area-inset-top);
            --safe-area-inset-right: env(safe-area-inset-right);
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            --safe-area-inset-left: env(safe-area-inset-left);
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          .safe-area-inset {
            padding-top: var(--safe-area-inset-top);
            padding-right: var(--safe-area-inset-right);
            padding-bottom: var(--safe-area-inset-bottom);
            padding-left: var(--safe-area-inset-left);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .touch-device {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }

          .touch-device button,
          .touch-device a,
          .touch-device [role="button"] {
            touch-action: manipulation;
          }

          @media screen and (max-width: 768px) {
            input[type="text"],
            input[type="email"], 
            input[type="password"],
            input[type="search"],
            textarea,
            select {
              font-size: 16px !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .mobile-layout * {
              animation-duration: 0.01ms !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default MobileOptimizedLayout;