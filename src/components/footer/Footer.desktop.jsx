import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Logo from '../../components/ui/Logo';

const FooterDesktop = () => {
  return (
    <footer className="bg-surface/50 dark:bg-surface/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 items-center">
          {/* Left - Branding & Copyright */}
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText={false} />
            <div>
              <div className="font-semibold text-foreground">EyeWantIt</div>
              <div className="text-sm text-muted">
                © {new Date().getFullYear()} All rights reserved
              </div>
            </div>
          </div>

          {/* Center - Version */}
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              <span className="text-sm font-medium">v0.6.2</span>
            </div>
          </div>

          {/* Right - Developer */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 text-muted">
              <span className="text-sm">Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span className="text-sm">by</span>
              <a
                href="https://ashiq.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
              >
                Ashiq Gazi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDesktop;