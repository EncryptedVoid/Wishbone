// utils/performanceUtils.js
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hardware capability detection and performance settings
 */
export class PerformanceManager {
  constructor() {
    this.capabilities = this.detectCapabilities();
    this.settings = this.getOptimalSettings();
  }

  detectCapabilities() {
    const capabilities = {
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4,
      connection: this.getConnectionSpeed(),
      isLowEnd: false,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      supportsWebP: this.supportsWebP(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Determine if device is low-end
    capabilities.isLowEnd = (
      capabilities.cores <= 2 ||
      capabilities.memory <= 2 ||
      capabilities.connection === 'slow'
    );

    return capabilities;
  }

  getConnectionSpeed() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    return 'fast';
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  getOptimalSettings() {
    const { isLowEnd, isMobile, reducedMotion } = this.capabilities;

    return {
      // Animation settings
      enableAnimations: !reducedMotion && !isLowEnd,
      animationDuration: isLowEnd ? 150 : isMobile ? 200 : 300,
      staggerDelay: isLowEnd ? 0.02 : 0.05,
      enableParallax: !isLowEnd && !isMobile,
      enableBlur: !isLowEnd,

      // Rendering settings
      maxVisibleItems: isLowEnd ? 20 : isMobile ? 50 : 100,
      enableVirtualization: isLowEnd || isMobile,
      imageQuality: isLowEnd ? 'low' : 'high',
      enableImageLazyLoading: true,

      // Interaction settings
      debounceDelay: isLowEnd ? 300 : 150,
      throttleDelay: isLowEnd ? 100 : 50,
      enableRippleEffect: !isLowEnd,

      // Memory management
      enableComponentCaching: !isLowEnd,
      maxCacheSize: isLowEnd ? 50 : 200,
      enablePreload: !isLowEnd && this.capabilities.connection === 'fast'
    };
  }
}

// Singleton instance
export const performanceManager = new PerformanceManager();

/**
 * Optimized animation variants based on hardware capabilities
 */
export const getOptimizedVariants = () => {
  const { enableAnimations, animationDuration, staggerDelay, enableBlur } = performanceManager.settings;

  if (!enableAnimations) {
    return {
      container: { initial: {}, animate: {}, exit: {} },
      item: { initial: {}, animate: {}, exit: {} }
    };
  }

  return {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          duration: animationDuration / 1000
        }
      },
      exit: { opacity: 0 }
    },
    item: {
      initial: {
        opacity: 0,
        y: performanceManager.capabilities.isLowEnd ? 10 : 20
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: performanceManager.capabilities.isLowEnd ? "tween" : "spring",
          duration: animationDuration / 1000,
          ...(performanceManager.capabilities.isLowEnd ? {} : {
            stiffness: 300,
            damping: 30
          })
        }
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: (animationDuration * 0.7) / 1000 }
      },
      hover: enableBlur ? {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      } : {},
      tap: { scale: 0.98 }
    }
  };
};

/**
 * Optimized search with memoization and early returns
 */
export class OptimizedSearch {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = performanceManager.settings.maxCacheSize;
  }

  search(items, query) {
    if (!query || query.trim().length === 0) return items;

    const normalizedQuery = query.toLowerCase().trim();

    // Check cache first
    const cacheKey = `${normalizedQuery}_${items.length}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Early return for short queries on large datasets
    if (normalizedQuery.length < 2 && items.length > 100) {
      return items;
    }

    const results = this.performSearch(items, normalizedQuery);

    // Cache results with LRU eviction
    this.addToCache(cacheKey, results);

    return results;
  }

  performSearch(items, query) {
    const results = [];
    const queryTerms = query.split(' ').filter(term => term.length > 0);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let score = 0;
      let matches = 0;

      // Check name (highest priority)
      if (item.name.toLowerCase().includes(query)) {
        score += 10;
        matches++;
      }

      // Check individual terms in name
      for (const term of queryTerms) {
        if (item.name.toLowerCase().includes(term)) {
          score += 5;
          matches++;
        }
      }

      // Check description (medium priority)
      if (item.description && item.description.toLowerCase().includes(query)) {
        score += 3;
        matches++;
      }

      // Check tags (lower priority, but still valuable)
      for (const tag of item.categoryTags) {
        if (tag.toLowerCase().includes(query)) {
          score += 2;
          matches++;
          break; // Only count tags once per item
        }
      }

      // Only include items with matches
      if (matches > 0) {
        results.push({ ...item, searchScore: score });
      }

      // Early break for performance on large datasets
      if (results.length >= performanceManager.settings.maxVisibleItems) {
        break;
      }
    }

    // Sort by relevance score
    return results
      .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0))
      .map(({ searchScore, ...item }) => item);
  }

  addToCache(key, value) {
    // Simple LRU cache implementation
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clearCache() {
    this.cache.clear();
  }
}

/**
 * Optimized debounce hook with cleanup
 */
export const useOptimizedDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay || performanceManager.settings.debounceDelay);
  }, [delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Optimized throttle hook
 */
export const useOptimizedThrottle = (callback, delay) => {
  const lastCallRef = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    const throttleDelay = delay || performanceManager.settings.throttleDelay;

    if (timeSinceLastCall >= throttleDelay) {
      lastCallRef.current = now;
      callbackRef.current(...args);
    }
  }, [delay]);
};

/**
 * Memoized filter function for better performance
 */
export const useOptimizedFilter = (items, filters, activeCollection) => {
  return useMemo(() => {
    let filteredItems = items;

    // Apply collection filter first (most selective)
    if (activeCollection !== 'all') {
      filteredItems = filteredItems.filter(item => item.collectionId === activeCollection);
    }

    // Apply other filters
    if (filters.category) {
      filteredItems = filteredItems.filter(item =>
        item.categoryTags.includes(filters.category)
      );
    }

    if (filters.minDesireScore) {
      const minScore = parseInt(filters.minDesireScore);
      filteredItems = filteredItems.filter(item => item.desireScore >= minScore);
    }

    if (filters.status) {
      switch (filters.status) {
        case 'available':
          filteredItems = filteredItems.filter(item => !item.isDibbed);
          break;
        case 'dibbed':
          filteredItems = filteredItems.filter(item => item.isDibbed);
          break;
        case 'private':
          filteredItems = filteredItems.filter(item => item.isPrivate);
          break;
        case 'public':
          filteredItems = filteredItems.filter(item => !item.isPrivate);
          break;
      }
    }

    return filteredItems;
  }, [items, filters, activeCollection]);
};

/**
 * Virtual scrolling hook for large lists
 */
export const useVirtualScrolling = (items, containerHeight = 600, itemHeight = 200) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { enableVirtualization, maxVisibleItems } = performanceManager.settings;

  // Always call the throttled scroll handler (hooks must be called unconditionally)
  const onScrollThrottled = useOptimizedThrottle((e) => {
    setScrollTop(e.target.scrollTop);
  }, 16); // ~60fps

  // Return early if virtualization is not needed, but after all hooks are called
  if (!enableVirtualization || items.length <= maxVisibleItems) {
    return {
      visibleItems: items,
      startIndex: 0,
      endIndex: items.length,
      totalHeight: items.length * itemHeight,
      offsetY: 0,
      onScroll: () => {} // Return no-op function when virtualization is disabled
    };
  }

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    virtualIndex: startIndex + index
  }));

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
    onScroll: onScrollThrottled
  };
};

/**
 * Optimized image loading with WebP support and lazy loading
 */
export const useOptimizedImage = (src, alt) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const optimizedSrc = useMemo(() => {
    if (!src) return '';

    const { supportsWebP, imageQuality } = performanceManager.capabilities;
    let optimizedUrl = src;

    // Add WebP format if supported
    if (supportsWebP && !src.includes('.webp')) {
      optimizedUrl = src.replace(/\.(jpg|jpeg|png)/, '.webp');
    }

    // Add quality parameter for services that support it
    if (imageQuality === 'low' && (src.includes('unsplash') || src.includes('cloudinary'))) {
      optimizedUrl += optimizedUrl.includes('?') ? '&q=60' : '?q=60';
    }

    return optimizedUrl;
  }, [src]);

  useEffect(() => {
    if (!optimizedSrc) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setError(true);
      // Fallback to original src if optimized version fails
      if (optimizedSrc !== src) {
        img.src = src;
      }
    };
    img.src = optimizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [optimizedSrc, src]);

  return {
    src: error ? src : optimizedSrc,
    loaded,
    error,
    imgRef
  };
};

export default {
  performanceManager,
  getOptimizedVariants,
  OptimizedSearch,
  useOptimizedDebounce,
  useOptimizedThrottle,
  useOptimizedFilter,
  useVirtualScrolling,
  useOptimizedImage
};