import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import FooterDesktop from './Footer.desktop';
import FooterMobile from './Footer.mobile';


function Footer() {
  const { isMobile, isLoading } = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? <FooterMobile /> : <FooterDesktop />;
}

export default Footer;