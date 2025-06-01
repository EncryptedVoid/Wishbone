import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Logo from '../../components/ui/Logo';

const FooterMobile = () => {
  return (
    <footer className="bg-surface/50 dark:bg-surface/30 border-t border-border">
      <div className="px-4 py-6 space-y-4">
        {/* Top Row - Branding & Version */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size="sm" showText={false} />
            <div>
              <div className="font-semibold text-foreground text-sm">EyeWantIt</div>
              <div className="text-xs text-muted">
                © {new Date().getFullYear()}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
            <span className="text-xs font-medium">v0.6.2</span>
          </div>
        </div>

        {/* Bottom Row - Developer */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-muted">
            <span className="text-xs">Made with</span>
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
              <Heart className="w-3 h-3 text-red-500 fill-current" />
            </motion.div>
            <span className="text-xs">by</span>
            <a
              href="https://ashiq.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
            >
              Ashiq Gazi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMobile;