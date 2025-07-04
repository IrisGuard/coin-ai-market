// PHASE 5: Mobile-optimized card component with touch feedback
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnimationTrigger } from '@/hooks/useIntersectionObserver';
import { motion } from 'framer-motion';

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  touchFeedback?: boolean;
}

const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className = '',
  onClick,
  delay = 0,
  touchFeedback = true,
}) => {
  const isMobile = useIsMobile();
  const { elementRef, shouldAnimate } = useAnimationTrigger(delay);

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileTap={touchFeedback && isMobile ? { scale: 0.98 } : {}}
      className="w-full"
    >
      <Card 
        className={`group transition-all duration-300 hover:shadow-lg ${
          onClick ? 'cursor-pointer' : ''
        } ${
          isMobile && touchFeedback ? 'active:scale-[0.98] active:shadow-sm' : ''
        } ${className}`}
        onClick={onClick}
      >
        <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileOptimizedCard;