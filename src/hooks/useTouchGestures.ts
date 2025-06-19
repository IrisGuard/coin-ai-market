
import { useEffect, useRef, RefObject } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
}

interface UseTouchGesturesOptions {
  swipeThreshold?: number;
  timeThreshold?: number;
  doubleTapThreshold?: number;
  longPressThreshold?: number;
  pinchThreshold?: number;
}

export const useTouchGestures = (
  elementRef: RefObject<HTMLElement>,
  handlers: GestureHandlers,
  options: UseTouchGesturesOptions = {}
) => {
  const {
    swipeThreshold = 50,
    timeThreshold = 300,
    doubleTapThreshold = 300,
    longPressThreshold = 500,
    pinchThreshold = 0.1,
  } = options;

  const startPoint = useRef<TouchPoint | null>(null);
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistance = useRef<number>(0);

  const getTouchPoint = (touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  });

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single touch
      startPoint.current = getTouchPoint(e.touches[0]);
      
      // Start long press timer
      longPressTimer.current = setTimeout(() => {
        handlers.onLongPress?.();
      }, longPressThreshold);
    } else if (e.touches.length === 2) {
      // Multi-touch (pinch)
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    
    // Cancel long press on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (e.touches.length === 2 && handlers.onPinch) {
      // Handle pinch gesture
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance.current;
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        handlers.onPinch(scale);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!startPoint.current || e.changedTouches.length === 0) return;

    const endPoint = getTouchPoint(e.changedTouches[0]);
    const deltaX = endPoint.x - startPoint.current.x;
    const deltaY = endPoint.y - startPoint.current.y;
    const deltaTime = endPoint.timestamp - startPoint.current.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check for swipe gestures
    if (distance > swipeThreshold && deltaTime < timeThreshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    } else if (distance < 10 && deltaTime < timeThreshold) {
      // Tap gesture
      const now = Date.now();
      if (now - lastTap.current < doubleTapThreshold) {
        handlers.onDoubleTap?.();
      } else {
        handlers.onTap?.();
      }
      lastTap.current = now;
    }

    startPoint.current = null;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [elementRef, handlers, options]);

  return {
    isTouch: 'ontouchstart' in window,
  };
};
