// useIsMobile.js - Custom hook for mobile detection
import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // Check screen width
      const screenWidth = window.innerWidth;

      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));

      // Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Combine checks: mobile if screen is small OR it's a mobile device OR has touch and small screen
      const isMobileView = screenWidth < 1024 || isMobileDevice || (hasTouchScreen && screenWidth < 1280);

      setIsMobile(isMobileView);
    };

    // Check on initial load
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Small delay to prevent flash of wrong component
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', checkDevice);
      clearTimeout(timer);
    };
  }, []);

  return { isMobile, isLoading };
}