// utils/aggressivePerformanceUtils.js
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Ultra-lightweight performance manager
 */
class UltraPerformanceManager {
  constructor() {
    this.settings = this.getMinimalSettings();
  }

  getMinimalSettings() {
    const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      enableAnimations: !reducedMotion && !isLowEnd,
      animationDuration: isLowEnd ? 0 : (isMobile ? 150 : 200),
      staggerDelay: 0, // Disable stagger for performance
      maxVisibleItems: isLowEnd ? 10 : 20,
      debounceDelay: isLowEnd ? 500 : 300,
      enableVirtualization: true,
      enableBlur: false, // Disable blur effects
      enableComplexAnimations: false // Disable complex animations
    };
  }
}

export const ultraPerformanceManager = new UltraPerformanceManager();

/**
 * Minimal animation variants
 */
export const getMinimalVariants = () => {
  if (!ultraPerformanceManager.settings.enableAnimations) {
    return {
      container: {},
      item: {}
    };
  }

  return {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } }
    },
    item: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.1 } }
    }
  };
};

/**
 * Ultra-fast search with minimal allocations
 */
export class UltraFastSearch {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 20; // Much smaller cache
  }

  search(items, query) {
    if (!query?.trim()) return items;

    const normalizedQuery = query.toLowerCase().trim();

    // Very aggressive early returns
    if (normalizedQuery.length < 2) return items;
    if (items.length === 0) return items;

    // Check cache
    if (this.cache.has(normalizedQuery)) {
      return this.cache.get(normalizedQuery);
    }

    // Simple, fast search - just check name
    const results = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.name.toLowerCase().includes(normalizedQuery)) {
        results.push(item);
        // Limit results for performance
        if (results.length >= ultraPerformanceManager.settings.maxVisibleItems) {
          break;
        }
      }
    }

    // Simple cache management
    if (this.cache.size >= this.maxCacheSize) {
      this.cache.clear();
    }
    this.cache.set(normalizedQuery, results);

    return results;
  }
}

/**
 * Minimal debounce
 */
export const useMinimalDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

/**
 * Simplified virtual scrolling
 */
export const useSimpleVirtualScrolling = (items, itemHeight = 200) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 600;

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return useMemo(() => {
    if (items.length <= ultraPerformanceManager.settings.maxVisibleItems) {
      return {
        visibleItems: items,
        totalHeight: items.length * itemHeight,
        offsetY: 0,
        onScroll: () => {}
      };
    }

    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;
    const endIndex = Math.min(startIndex + visibleCount, items.length);

    return {
      visibleItems: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
      onScroll
    };
  }, [items, scrollTop, itemHeight, onScroll]);
};

/**
 * Optimized filter hook with minimal re-renders
 */
export const useUltraFastFilter = (items, filters, activeCollection) => {
  return useMemo(() => {
    // Apply filters in most selective order
    let filtered = items;

    // Collection filter first (most selective)
    if (activeCollection !== 'all') {
      filtered = filtered.filter(item => item.collectionId === activeCollection);
    }

    // Other filters
    if (filters.status === 'available') {
      filtered = filtered.filter(item => !item.isDibbed);
    } else if (filters.status === 'dibbed') {
      filtered = filtered.filter(item => item.isDibbed);
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.categoryTags.includes(filters.category));
    }

    if (filters.minDesireScore) {
      const minScore = parseInt(filters.minDesireScore);
      filtered = filtered.filter(item => item.desireScore >= minScore);
    }

    // Limit results for performance
    return filtered.slice(0, ultraPerformanceManager.settings.maxVisibleItems * 2);
  }, [items, filters, activeCollection]);
};

export default {
  ultraPerformanceManager,
  getMinimalVariants,
  UltraFastSearch,
  useMinimalDebounce,
  useSimpleVirtualScrolling,
  useUltraFastFilter
};