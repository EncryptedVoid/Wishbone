import HeroMobile from './Hero.mobile'
import HeroDesktop from './Hero.desktop'
import { useIsMobile } from '../../hooks/useIsMobile'

function Hero() {
  const { isMobile, isLoading } = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? <HeroMobile /> : <HeroDesktop />;
}

export default Hero;