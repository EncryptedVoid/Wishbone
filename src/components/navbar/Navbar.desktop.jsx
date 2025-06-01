import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  Calendar,
  Users,
  Heart,
  Camera,
  ChevronDown,
  Bell,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import ThemeToggle from '../ui/ThemeToggle';
import ColorThemeSelector from '../ui/ColorThemeSelector';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

const NavbarDesktop = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

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
  };

  // Clean navigation - no Home when authenticated, no redundant items
  const navItems = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: User },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/memoirs', label: 'Memoirs', icon: Camera },
  ] : [];

  // User menu items - consolidated Friends and Notifications here
  const userMenuItems = [
    { path: '/friends', label: 'Friends', icon: Users },
    {
      action: () => {},
      label: 'Notifications',
      icon: Bell,
      badge: 3, // You can make this dynamic
      isAction: true
    },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-responsive-lg h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
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
      <div className="max-w-7xl mx-auto px-responsive-lg">
        <div className="flex items-center justify-between h-16">

          {/* Logo using your assets */}
          <motion.div
            className="flex items-center space-x-responsive-sm cursor-pointer"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-medium">
              <img
                src="/assets/logo.png"
                alt="EyeWantIt Logo"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span style={{ display: 'none' }} className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-responsive-xl font-bold text-foreground">
              EyeWantIt
            </span>
          </motion.div>

          {/* Navigation Items - only show when authenticated */}
          {user && (
            <div className="hidden lg:flex items-center space-x-responsive-lg">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center space-x-responsive-sm px-responsive-md py-responsive-sm rounded-lg',
                        'font-medium transition-all duration-200 relative',
                        isActive
                          ? 'text-primary-600 bg-primary-50 shadow-soft'
                          : 'text-foreground hover:text-primary-600 hover:bg-surface'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-responsive-sm">{item.label}</span>

                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                          layoutId="activeIndicator"
                          initial={false}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-responsive-lg">

            {/* Theme Controls */}
            <div className="flex items-center space-x-responsive-sm">
              <ThemeToggle />
              <ColorThemeSelector />
            </div>

            {user ? (
              /* User Menu - Contains Friends, Notifications, Settings */
              <div className="relative" data-user-menu>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    'flex items-center space-x-responsive-sm px-responsive-sm py-responsive-sm rounded-lg',
                    'bg-surface border border-border hover:bg-primary-50 hover:border-primary-200',
                    'transition-all duration-200',
                    userMenuOpen && 'bg-primary-50 border-primary-200'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar
                    name={user.email?.split('@')[0] || 'User'}
                    size="sm"
                    status="online"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-responsive-sm font-medium text-foreground">
                      {user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-responsive-xs text-muted">Online</div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-muted transition-transform duration-200',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-strong z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            name={user.email?.split('@')[0] || 'User'}
                            size="md"
                            status="online"
                          />
                          <div>
                            <div className="font-semibold text-foreground">
                              {user.email?.split('@')[0] || 'User'}
                            </div>
                            <div className="text-responsive-sm text-muted">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item, index) => {
                          const Icon = item.icon;

                          if (item.isAction) {
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  item.action();
                                  setUserMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-responsive-sm text-foreground hover:bg-surface transition-colors duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                  <Badge variant="error" size="sm">
                                    {item.badge}
                                  </Badge>
                                )}
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center space-x-3 px-4 py-3 text-responsive-sm text-foreground hover:bg-surface transition-colors duration-200"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}

                        <div className="border-t border-border my-2"></div>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleAuthClick();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-responsive-sm text-error hover:bg-error/5 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Single Auth Button */
              <Button
                variant="primary"
                size="md"
                onClick={handleAuthClick}
                disabled={loading}
                className="shadow-medium hover:shadow-strong"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Get Started'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarDesktop;