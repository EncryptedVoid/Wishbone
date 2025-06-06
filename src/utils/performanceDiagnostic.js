// utils/performanceDiagnostic.js
import React, { useRef, useEffect, useState } from 'react';

/**
 * Performance Diagnostic Tool
 * This will help us identify the REAL bottlenecks
 */

// 1. RENDER TIMING DIAGNOSTIC
export const useRenderTiming = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    renderCount.current += 1;

    console.log(`🔍 ${componentName} Render #${renderCount.current}: ${timeSinceLastRender.toFixed(2)}ms`);

    if (timeSinceLastRender > 16.67) { // Slower than 60fps
      console.warn(`⚠️ ${componentName} SLOW RENDER: ${timeSinceLastRender.toFixed(2)}ms`);
    }

    lastRenderTime.current = now;
  });

  return renderCount.current;
};

// 2. RE-RENDER CAUSE DETECTOR
export const useWhyDidYouRender = (name, props) => {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const changedProps = {};
      Object.keys(props).forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`🔄 ${name} re-rendered due to:`, changedProps);
      }
    }
    previousProps.current = props;
  });
};

// 3. MEMORY LEAK DETECTOR
export const useMemoryMonitor = (componentName) => {
  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usedMB = (usedJSHeapSize / 1024 / 1024).toFixed(2);
        const totalMB = (totalJSHeapSize / 1024 / 1024).toFixed(2);

        console.log(`💾 ${componentName} Memory: ${usedMB}MB / ${totalMB}MB`);

        if (usedJSHeapSize / jsHeapSizeLimit > 0.9) {
          console.error(`💥 ${componentName} HIGH MEMORY USAGE: ${usedMB}MB`);
        }
      }
    };

    const interval = setInterval(checkMemory, 5000);
    return () => clearInterval(interval);
  }, [componentName]);
};

// 4. BUNDLE SIZE ANALYZER
export const analyzeBundleImpact = () => {
  const scripts = Array.from(document.scripts);
  const totalSize = scripts.reduce((total, script) => {
    if (script.src) {
      // This is an approximation - you'd need actual bundle analysis
      return total + (script.src.length * 10); // Rough estimate
    }
    return total;
  }, 0);

  console.log(`📦 Estimated bundle impact: ${(totalSize / 1024).toFixed(2)}KB`);
};

// 5. COMPONENT PROFILER
export const ProfiledComponent = ({ name, children, threshold = 16 }) => {
  const startTime = useRef();
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    startTime.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    setRenderTime(duration);

    if (duration > threshold) {
      console.warn(`🐌 ${name} SLOW COMPONENT: ${duration.toFixed(2)}ms`);
    }
  });

  return (
    <div data-component={name} data-render-time={renderTime}>
      {children}
    </div>
  );
};

// 6. REAL BOTTLENECK DETECTOR
export const useBottleneckDetector = () => {
  const [bottlenecks, setBottlenecks] = useState([]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const slowEntries = entries.filter(entry => entry.duration > 50);

      if (slowEntries.length > 0) {
        setBottlenecks(prev => [...prev, ...slowEntries]);
        console.group('🔥 PERFORMANCE BOTTLENECKS DETECTED');
        slowEntries.forEach(entry => {
          console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
        });
        console.groupEnd();
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });

    return () => observer.disconnect();
  }, []);

  return bottlenecks;
};

// 7. DIAGNOSTIC WISHLIST COMPONENT
export const DiagnosticWishlist = ({ children, ...props }) => {
  const renderCount = useRenderTiming('DiagnosticWishlist');
  useWhyDidYouRender('DiagnosticWishlist', props);
  useMemoryMonitor('DiagnosticWishlist');
  const bottlenecks = useBottleneckDetector();

  useEffect(() => {
    // Check if WishCard is the culprit
    const wishCards = document.querySelectorAll('[data-component*="WishCard"]');
    if (wishCards.length > 10) {
      console.warn(`⚠️ TOO MANY WISH CARDS: ${wishCards.length} (consider virtualization)`);
    }

    // Check for layout thrashing
    const elementsWithTransforms = document.querySelectorAll('[style*="transform"]');
    if (elementsWithTransforms.length > 20) {
      console.warn(`⚠️ TOO MANY TRANSFORMS: ${elementsWithTransforms.length} (layout thrashing risk)`);
    }

    // Check for expensive CSS
    const elementsWithBlur = document.querySelectorAll('[class*="blur"], [style*="blur"]');
    if (elementsWithBlur.length > 5) {
      console.warn(`⚠️ TOO MANY BLUR EFFECTS: ${elementsWithBlur.length} (GPU intensive)`);
    }

    // Check bundle size
    analyzeBundleImpact();
  }, []);

  // Performance warning overlay
  if (renderCount > 10 && bottlenecks.length > 5) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 9999,
          fontSize: '14px'
        }}>
          🚨 PERFORMANCE CRISIS: {renderCount} renders, {bottlenecks.length} bottlenecks detected!
        </div>
        {children}
      </div>
    );
  }

  return children;
};

// 8.