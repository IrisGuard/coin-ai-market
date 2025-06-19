
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileSlideProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export const MobileSlide = ({ 
  children, 
  isVisible, 
  direction = 'right',
  duration = 0.3 
}: MobileSlideProps) => {
  const variants = {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MobileFadeProps {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
  delay?: number;
}

export const MobileFade = ({ 
  children, 
  isVisible, 
  duration = 0.3,
  delay = 0 
}: MobileFadeProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MobileScaleProps {
  children: React.ReactNode;
  isVisible: boolean;
  scale?: number;
  duration?: number;
}

export const MobileScale = ({ 
  children, 
  isVisible, 
  scale = 0.8,
  duration = 0.3 
}: MobileScaleProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale, opacity: 0 }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MobileSpringProps {
  children: React.ReactNode;
  trigger: boolean;
  damping?: number;
  stiffness?: number;
}

export const MobileSpring = ({ 
  children, 
  trigger,
  damping = 10,
  stiffness = 100 
}: MobileSpringProps) => {
  return (
    <motion.div
      animate={trigger ? { scale: 1.05 } : { scale: 1 }}
      transition={{
        type: 'spring',
        damping,
        stiffness,
      }}
    >
      {children}
    </motion.div>
  );
};

interface MobileSwipeProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const MobileSwipe = ({ 
  children, 
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50 
}: MobileSwipeProps) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const { offset } = info;
        
        if (Math.abs(offset.x) > threshold) {
          if (offset.x > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
        
        if (Math.abs(offset.y) > threshold) {
          if (offset.y > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }}
      whileDrag={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const MobilePullToRefresh = ({ 
  children, 
  onRefresh,
  threshold = 80 
}: MobilePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ bottom: 0 }}
      dragElastic={0.3}
      onDrag={(_, info) => {
        if (info.offset.y > 0) {
          setPullDistance(info.offset.y);
        }
      }}
      onDragEnd={(_, info) => {
        if (info.offset.y > threshold && !isRefreshing) {
          handleRefresh();
        } else {
          setPullDistance(0);
        }
      }}
      animate={{
        y: isRefreshing ? threshold : 0,
      }}
    >
      {/* Pull indicator */}
      {pullDistance > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-16 text-gray-500"
        >
          <motion.div
            animate={{ rotate: pullDistance > threshold ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isRefreshing ? (
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <div className="text-sm">
                {pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {children}
    </motion.div>
  );
};

interface MobileStaggerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  isVisible: boolean;
}

export const MobileStagger = ({ 
  children, 
  staggerDelay = 0.1,
  isVisible 
}: MobileStaggerProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div>
          {children.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                delay: index * staggerDelay,
                duration: 0.3,
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
