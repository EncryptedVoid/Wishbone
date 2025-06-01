import { useState, useEffect } from 'react'
import AuthPageMobile from './Auth.mobile'
import AuthPageDesktop from './Auth.desktop'

function AuthPage() {
  const [isMobile, setIsMobile] = useState(false);

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

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Optional: Add a loading state while determining device type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to prevent flash of wrong component
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? <AuthPageMobile /> : <AuthPageDesktop />;
}

export default AuthPage;