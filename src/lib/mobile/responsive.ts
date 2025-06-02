/**
 * Mobile Optimization for TPQ Baitus Shuffah
 * Implements responsive design utilities and mobile-first optimizations
 */

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  platform: string;
}

class ResponsiveManager {
  private breakpoints: BreakpointConfig = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  private listeners: Array<(deviceInfo: DeviceInfo) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeListeners();
    }
  }

  /**
   * Get current device information
   */
  getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080,
        orientation: 'landscape',
        touchSupport: false,
        platform: 'server'
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < this.breakpoints.md;
    const isTablet = width >= this.breakpoints.md && width < this.breakpoints.lg;
    const isDesktop = width >= this.breakpoints.lg;

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
      touchSupport: 'ontouchstart' in window,
      platform: this.detectPlatform()
    };
  }

  /**
   * Check if current screen matches breakpoint
   */
  isBreakpoint(breakpoint: keyof BreakpointConfig): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= this.breakpoints[breakpoint];
  }

  /**
   * Get responsive classes based on screen size
   */
  getResponsiveClasses(config: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }): string {
    const deviceInfo = this.getDeviceInfo();
    const classes: string[] = [];

    if (config.base) classes.push(config.base);

    if (deviceInfo.screenWidth >= this.breakpoints.sm && config.sm) {
      classes.push(config.sm);
    }
    if (deviceInfo.screenWidth >= this.breakpoints.md && config.md) {
      classes.push(config.md);
    }
    if (deviceInfo.screenWidth >= this.breakpoints.lg && config.lg) {
      classes.push(config.lg);
    }
    if (deviceInfo.screenWidth >= this.breakpoints.xl && config.xl) {
      classes.push(config.xl);
    }

    return classes.join(' ');
  }

  /**
   * Subscribe to device changes
   */
  subscribe(callback: (deviceInfo: DeviceInfo) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Optimize images for mobile
   */
  getOptimizedImageSrc(baseSrc: string, deviceInfo?: DeviceInfo): string {
    const device = deviceInfo || this.getDeviceInfo();
    
    if (device.isMobile) {
      return baseSrc.replace(/\.(jpg|jpeg|png)$/i, '_mobile.$1');
    } else if (device.isTablet) {
      return baseSrc.replace(/\.(jpg|jpeg|png)$/i, '_tablet.$1');
    }
    
    return baseSrc;
  }

  /**
   * Get mobile-optimized grid columns
   */
  getMobileGridCols(desktopCols: number): number {
    const deviceInfo = this.getDeviceInfo();
    
    if (deviceInfo.isMobile) {
      return Math.min(desktopCols, 1);
    } else if (deviceInfo.isTablet) {
      return Math.min(desktopCols, 2);
    }
    
    return desktopCols;
  }

  private initializeListeners(): void {
    const handleResize = () => {
      const deviceInfo = this.getDeviceInfo();
      this.listeners.forEach(callback => callback(deviceInfo));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }

  private detectPlatform(): string {
    if (typeof window === 'undefined') return 'server';
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    if (/android/.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/windows/.test(userAgent)) return 'windows';
    if (/mac/.test(userAgent)) return 'mac';
    if (/linux/.test(userAgent)) return 'linux';
    
    return 'unknown';
  }
}

/**
 * Mobile-specific UI components
 */
export class MobileUIOptimizer {
  /**
   * Get touch-friendly button size
   */
  getTouchButtonSize(size: 'sm' | 'md' | 'lg' = 'md'): string {
    const sizes = {
      sm: 'min-h-[44px] min-w-[44px] px-4 py-2',
      md: 'min-h-[48px] min-w-[48px] px-6 py-3',
      lg: 'min-h-[56px] min-w-[56px] px-8 py-4'
    };
    
    return sizes[size];
  }

  /**
   * Get mobile-optimized spacing
   */
  getMobileSpacing(desktop: string): string {
    const spacingMap: Record<string, string> = {
      'space-x-8': 'space-x-4',
      'space-y-8': 'space-y-4',
      'gap-8': 'gap-4',
      'p-8': 'p-4',
      'm-8': 'm-4',
      'px-8': 'px-4',
      'py-8': 'py-4'
    };
    
    return spacingMap[desktop] || desktop;
  }

  /**
   * Get mobile-optimized text size
   */
  getMobileTextSize(desktop: string): string {
    const textMap: Record<string, string> = {
      'text-6xl': 'text-4xl',
      'text-5xl': 'text-3xl',
      'text-4xl': 'text-2xl',
      'text-3xl': 'text-xl',
      'text-2xl': 'text-lg'
    };
    
    return textMap[desktop] || desktop;
  }

  /**
   * Generate mobile-first responsive classes
   */
  generateResponsiveClass(property: string, values: {
    mobile: string;
    tablet?: string;
    desktop?: string;
  }): string {
    const classes = [values.mobile];
    
    if (values.tablet) {
      classes.push(`md:${values.tablet}`);
    }
    
    if (values.desktop) {
      classes.push(`lg:${values.desktop}`);
    }
    
    return classes.join(' ');
  }
}

/**
 * Performance optimization for mobile
 */
export class MobilePerformanceOptimizer {
  private intersectionObserver?: IntersectionObserver;
  private lazyImages = new Set<HTMLImageElement>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeLazyLoading();
    }
  }

  /**
   * Initialize lazy loading for images
   */
  private initializeLazyLoading(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.intersectionObserver?.unobserve(img);
            this.lazyImages.delete(img);
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );
  }

  /**
   * Add image to lazy loading queue
   */
  addLazyImage(img: HTMLImageElement): void {
    if (this.intersectionObserver) {
      this.lazyImages.add(img);
      this.intersectionObserver.observe(img);
    }
  }

  /**
   * Load image with optimization
   */
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
    }
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources(resources: string[]): void {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(resource)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize animations for mobile
   */
  optimizeAnimations(): void {
    // Reduce animations on low-end devices
    const isLowEndDevice = this.isLowEndDevice();
    
    if (isLowEndDevice) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.classList.add('reduce-motion');
    }
  }

  /**
   * Detect low-end device
   */
  private isLowEndDevice(): boolean {
    // Check for indicators of low-end device
    const connection = (navigator as any).connection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = (navigator as any).deviceMemory || 1;
    
    return (
      hardwareConcurrency <= 2 ||
      deviceMemory <= 2 ||
      (connection && connection.effectiveType === 'slow-2g') ||
      (connection && connection.effectiveType === '2g')
    );
  }
}

/**
 * Touch gesture handler
 */
export class TouchGestureHandler {
  private element: HTMLElement;
  private startX = 0;
  private startY = 0;
  private threshold = 50;

  constructor(element: HTMLElement) {
    this.element = element;
    this.initializeGestures();
  }

  private initializeGestures(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(e: TouchEvent): void {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (!e.changedTouches.length) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > this.threshold) {
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
  }

  protected onSwipeLeft(): void {
    this.element.dispatchEvent(new CustomEvent('swipeleft'));
  }

  protected onSwipeRight(): void {
    this.element.dispatchEvent(new CustomEvent('swiperight'));
  }

  protected onSwipeUp(): void {
    this.element.dispatchEvent(new CustomEvent('swipeup'));
  }

  protected onSwipeDown(): void {
    this.element.dispatchEvent(new CustomEvent('swipedown'));
  }
}

// Export instances
export const responsiveManager = new ResponsiveManager();
export const mobileUIOptimizer = new MobileUIOptimizer();
export const mobilePerformanceOptimizer = new MobilePerformanceOptimizer();

// React hooks for mobile optimization
export const useMobile = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      deviceInfo: responsiveManager.getDeviceInfo()
    };
  }

  const [deviceInfo, setDeviceInfo] = React.useState(responsiveManager.getDeviceInfo());

  React.useEffect(() => {
    const unsubscribe = responsiveManager.subscribe(setDeviceInfo);
    return unsubscribe;
  }, []);

  return {
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    deviceInfo
  };
};
