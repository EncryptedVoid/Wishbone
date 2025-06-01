import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  Users,
  Heart,
  Camera,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import ThemeToggle from '../ui/ThemeToggle';
import ColorThemeSelector from '../ui/ColorThemeSelector';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

const NavbarMobile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleAuthClick = async () => {
    if (user) {
      try {
        await supabase.auth.signOut();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      navigate('/auth');
    }
    setMenuOpen(false);
  };

  // Clean navigation items
  const navItems = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: User, description: 'Your overview' },
    { path: '/wishlist', label: 'Wishlist', icon: Heart, description: 'Manage wishes' },
    { path: '/events', label: 'Events', icon: Calendar, description: 'Upcoming events' },
    { path: '/friends', label: 'Friends', icon: Users, description: 'Your network' },
    { path: '/memoirs', label: 'Memoirs', icon: Camera, description: 'Photo memories' },
    { path: '/settings', label: 'Settings', icon: Settings, description: 'Account settings' },
  ] : [];

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-responsive-md h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-strong border-b border-border/80'
            : 'bg-background/90 backdrop-blur-sm border-b border-border/50'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="px-responsive-md">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <motion.div
              className="flex items-center space-x-responsive-sm cursor-pointer"
              onClick={() => navigate(user ? '/dashboard' : '/')}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-medium">
                <img
                  src="/assets/logo.png"
                  alt="EyeWantIt Logo"
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span style={{ display: 'none' }} className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-responsive-lg font-bold text-foreground">
                EyeWantIt
              </span>
            </motion.div>

            {/* Right Section */}
            <div className="flex items-center space-x-responsive-sm">

              {/* Theme Controls - Always visible */}
              <div className="flex items-center space-x-responsive-xs">
                <ThemeToggle className="scale-90" />
                <ColorThemeSelector className="scale-90" />
              </div>

              {/* Menu Button */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-foreground hover:bg-surface transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 bottom-0 bg-background border-t border-border z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">

                {/* User Info (if authenticated) */}
                {user && (
                  <motion.div
                    className="p-responsive-lg bg-gradient-to-r from-primary-50 to-surface border-b border-border"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-responsive-md">
                      <Avatar
                        name={user.email?.split('@')[0] || 'User'}
                        size="lg"
                        status="online"
                      />
                      <div className="flex-1">
                        <div className="text-responsive-lg font-semibold text-foreground">
                          Welcome back!
                        </div>
                        <div className="text-responsive-sm text-muted">
                          {user.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-responsive-xs text-muted mt-1">
                          {user.email}
                        </div>
                      </div>
                      {/* Notifications badge in corner */}
                      <div className="relative">
                        <Bell className="w-6 h-6 text-muted" />
                        <Badge
                          variant="error"
                          size="sm"
                          className="absolute -top-1 -right-1 w-4 h-4 text-xs"
                        >
                          3
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 py-responsive-md">
                  {navItems.length > 0 ? (
                    navItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      const delay = 0.15 + (index * 0.05);

                      return (
                        <motion.div
                          key={item.path}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay }}
                        >
                          <Link
                            to={item.path}
                            className={cn(
                              'flex items-center justify-between px-responsive-lg py-responsive-md',
                              'transition-all duration-200 group',
                              isActive
                                ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-500'
                                : 'text-foreground hover:bg-surface hover:text-primary-600'
                            )}
                            onClick={() => setMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-responsive-md">
                              <Icon className={cn(
                                'w-5 h-5 transition-colors duration-200',
                                isActive ? 'text-primary-600' : 'text-muted group-hover:text-primary-500'
                              )} />
                              <div>
                                <div className="text-responsive-base font-medium">
                                  {item.label}
                                </div>
                                <div className="text-responsive-xs text-muted">
                                  {item.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {isActive && (
                                <motion.div
                                  className="w-2 h-2 bg-primary-500 rounded-full mr-2"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                              )}
                              <ChevronRight className={cn(
                                'w-4 h-4 transition-transform duration-200',
                                'text-muted group-hover:text-primary-500 group-hover:translate-x-1'
                              )} />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    /* Show options for non-authenticated users */
                    <motion.div
                      className="px-responsive-lg py-responsive-xl text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-responsive-lg font-semibold text-foreground mb-responsive-sm">
                        Welcome to EyeWantIt
                      </div>
                      <div className="text-responsive-sm text-muted">
                        Sign in to access your dashboard, wishlists, and more.
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Auth Section */}
                <motion.div
                  className="border-t border-border p-responsive-lg bg-surface/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {user ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAuthClick}
                      className="w-full text-error border-error/20 hover:bg-error/5"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAuthClick}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        'Get Started'
                      )}
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMobile;