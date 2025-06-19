
interface MobileTestConfig {
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  touchSupport: boolean;
}

export const mobileTestConfigs: Record<string, MobileTestConfig> = {
  iPhone12: {
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
  },
  iPhone12Pro: {
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
  },
  iPhoneSE: {
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
  },
  galaxyS21: {
    viewport: { width: 360, height: 800 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    touchSupport: true,
  },
  pixelXL: {
    viewport: { width: 411, height: 731 },
    userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel XL) AppleWebKit/537.36',
    touchSupport: true,
  },
  iPad: {
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
  },
};

export class MobileTestSimulator {
  private originalViewport: { width: number; height: number };
  private originalUserAgent: string;
  private currentConfig: MobileTestConfig | null = null;

  constructor() {
    this.originalViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.originalUserAgent = navigator.userAgent;
  }

  simulate(deviceName: keyof typeof mobileTestConfigs) {
    const config = mobileTestConfigs[deviceName];
    if (!config) {
      throw new Error(`Unknown device: ${deviceName}`);
    }

    this.currentConfig = config;

    // Simulate viewport
    this.setViewport(config.viewport.width, config.viewport.height);

    // Simulate touch support
    if (config.touchSupport) {
      this.enableTouchSimulation();
    }

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    console.log(`Simulating ${deviceName}:`, config);
  }

  private setViewport(width: number, height: number) {
    // Update CSS viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', `width=${width}, initial-scale=1.0`);
    }

    // Update window size (for testing purposes)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
  }

  private enableTouchSimulation() {
    // Add touch event simulation
    if (!('ontouchstart' in window)) {
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: null,
      });
    }

    // Override navigator.maxTouchPoints
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 5,
    });
  }

  reset() {
    if (!this.currentConfig) return;

    // Reset viewport
    this.setViewport(this.originalViewport.width, this.originalViewport.height);

    // Reset touch simulation
    delete (window as any).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });

    this.currentConfig = null;
    window.dispatchEvent(new Event('resize'));

    console.log('Mobile simulation reset');
  }

  getCurrentConfig() {
    return this.currentConfig;
  }
}

export const testTouchGestures = (element: HTMLElement) => {
  const results: Record<string, boolean> = {};

  // Test tap
  results.tap = (() => {
    try {
      const event = new TouchEvent('touchstart', { bubbles: true });
      element.dispatchEvent(event);
      element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
      return true;
    } catch {
      return false;
    }
  })();

  // Test swipe
  results.swipe = (() => {
    try {
      const startEvent = new TouchEvent('touchstart', {
        bubbles: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch],
      });
      const moveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        touches: [{ clientX: 200, clientY: 100 } as Touch],
      });
      const endEvent = new TouchEvent('touchend', { bubbles: true });

      element.dispatchEvent(startEvent);
      element.dispatchEvent(moveEvent);
      element.dispatchEvent(endEvent);
      return true;
    } catch {
      return false;
    }
  })();

  return results;
};

export const measurePerformance = async (testName: string, testFn: () => Promise<void> | void) => {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

  try {
    await testFn();
  } catch (error) {
    console.error(`Test ${testName} failed:`, error);
    throw error;
  }

  const endTime = performance.now();
  const endMemory = (performance as any).memory?.usedJSHeapSize || 0;

  return {
    name: testName,
    duration: endTime - startTime,
    memoryUsed: endMemory - startMemory,
    timestamp: new Date().toISOString(),
  };
};

export const testResponsiveBreakpoints = () => {
  const breakpoints = [320, 375, 414, 768, 1024, 1280, 1920];
  const results: Array<{ width: number; passed: boolean; issues: string[] }> = [];

  breakpoints.forEach(width => {
    // Simulate width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });

    window.dispatchEvent(new Event('resize'));

    const issues: string[] = [];

    // Check for horizontal scroll
    if (document.body.scrollWidth > width) {
      issues.push('Horizontal scroll detected');
    }

    // Check for fixed positioning issues
    const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
    fixedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > width) {
        issues.push(`Fixed element extends beyond viewport: ${el.tagName}`);
      }
    });

    results.push({
      width,
      passed: issues.length === 0,
      issues,
    });
  });

  return results;
};

export const generateAccessibilityReport = () => {
  const issues: string[] = [];

  // Check for alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      issues.push(`Form input ${index + 1} missing label`);
    }
  });

  // Check for heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let currentLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    if (index === 0 && level !== 1) {
      issues.push('Page should start with h1');
    } else if (level > currentLevel + 1) {
      issues.push(`Heading level skipped: ${heading.tagName} after h${currentLevel}`);
    }
    currentLevel = level;
  });

  // Check for focus indicators
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach((element, index) => {
    const styles = getComputedStyle(element, ':focus');
    if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
      issues.push(`Focusable element ${index + 1} missing focus indicator`);
    }
  });

  return {
    passed: issues.length === 0,
    issues,
    totalChecks: images.length + inputs.length + headings.length + focusableElements.length,
  };
};

export const mobileTestSuite = {
  simulator: new MobileTestSimulator(),
  testTouchGestures,
  measurePerformance,
  testResponsiveBreakpoints,
  generateAccessibilityReport,
};

export default mobileTestSuite;
