import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import NavbarDesktop from './Navbar.desktop';
import NavbarMobile from './Navbar.mobile';

function Navbar() {
  const { isMobile, isLoading } = useIsMobile();

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
}

export default Navbar;