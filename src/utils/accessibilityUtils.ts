
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

export const addKeyboardNavigation = (
  elements: NodeListOf<HTMLElement>,
  options: {
    wrap?: boolean;
    vertical?: boolean;
    onEnter?: (element: HTMLElement, index: number) => void;
  } = {}
) => {
  const { wrap = true, vertical = false, onEnter } = options;
  let currentIndex = 0;

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        currentIndex = wrap && index === elements.length - 1 ? 0 : Math.min(index + 1, elements.length - 1);
        elements[currentIndex].focus();
        break;
      
      case prevKey:
        e.preventDefault();
        currentIndex = wrap && index === 0 ? elements.length - 1 : Math.max(index - 1, 0);
        elements[currentIndex].focus();
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        onEnter?.(elements[index], index);
        break;
      
      case 'Home':
        e.preventDefault();
        currentIndex = 0;
        elements[currentIndex].focus();
        break;
      
      case 'End':
        e.preventDefault();
        currentIndex = elements.length - 1;
        elements[currentIndex].focus();
        break;
    }
  };

  elements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '-1');
    element.addEventListener('keydown', (e) => handleKeyDown(e, index));
    element.addEventListener('focus', () => {
      currentIndex = index;
    });
  });

  return () => {
    elements.forEach(element => {
      element.removeEventListener('keydown', handleKeyDown as any);
    });
  };
};

export const addSkipLink = (targetId: string, text: string = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return () => {
    document.body.removeChild(skipLink);
  };
};

export const checkColorContrast = (foreground: string, background: string): number => {
  // Simplified contrast ratio calculation
  const getLuminance = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const addLandmarks = () => {
  // Add main landmark if not present
  const main = document.querySelector('main');
  if (!main) {
    const content = document.querySelector('#root > div');
    if (content) {
      content.setAttribute('role', 'main');
    }
  }

  // Add navigation landmark
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }
};

export const addAriaLabels = (element: HTMLElement, config: Record<string, string>) => {
  Object.entries(config).forEach(([selector, label]) => {
    const elements = element.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', label);
      }
    });
  });
};

export const addLiveRegion = (id: string, priority: 'polite' | 'assertive' = 'polite') => {
  const existing = document.getElementById(id);
  if (existing) return existing;

  const liveRegion = document.createElement('div');
  liveRegion.id = id;
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  
  document.body.appendChild(liveRegion);
  return liveRegion;
};

export const updateLiveRegion = (id: string, message: string) => {
  const region = document.getElementById(id);
  if (region) {
    region.textContent = message;
  }
};

export const makeCarouselAccessible = (carousel: HTMLElement) => {
  const slides = carousel.querySelectorAll('[data-slide]');
  const prevButton = carousel.querySelector('[data-prev]') as HTMLButtonElement;
  const nextButton = carousel.querySelector('[data-next]') as HTMLButtonElement;
  let currentSlide = 0;

  // Add ARIA attributes
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Image carousel');
  
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
  });

  // Update button states
  const updateButtons = () => {
    if (prevButton) {
      prevButton.disabled = currentSlide === 0;
      prevButton.setAttribute('aria-label', 'Previous slide');
    }
    if (nextButton) {
      nextButton.disabled = currentSlide === slides.length - 1;
      nextButton.setAttribute('aria-label', 'Next slide');
    }
  };

  updateButtons();

  return { updateButtons };
};
