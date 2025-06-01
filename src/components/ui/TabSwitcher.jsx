import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Professional TabSwitcher for EyeWantIt
 *
 * Features:
 * - Smooth animations with proper keyboard navigation
 * - Professional styling with texture and patterns
 * - Better visual feedback and accessibility
 */
const TabSwitcher = React.forwardRef(({
  tabs = [],
  activeTab,
  onTabChange,
  className,
  ...props
}, ref) => {

  // Handle keyboard navigation
  const handleKeyDown = (event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTabChange(tabId);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let nextIndex;

      if (event.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }

      // Skip disabled tabs
      while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
        if (event.key === 'ArrowLeft') {
          nextIndex = nextIndex > 0 ? nextIndex - 1 : tabs.length - 1;
        } else {
          nextIndex = nextIndex < tabs.length - 1 ? nextIndex + 1 : 0;
        }
      }

      if (!tabs[nextIndex]?.disabled) {
        onTabChange(tabs[nextIndex].id);
      }
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center p-1 rounded-2xl',
        'bg-gradient-to-r from-surface/80 to-surface/60',
        'backdrop-blur-sm border border-border/50',
        'shadow-sm',
        // Add subtle texture pattern
        'before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-gradient-to-br before:from-white/10 before:to-transparent',
        'before:opacity-50 before:pointer-events-none',
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
      {...props}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const isDisabled = tab.disabled;

        return (
          <div key={tab.id} className="relative flex-1">
            <motion.button
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              onKeyDown={(e) => !isDisabled && handleKeyDown(e, tab.id)}
              className={cn(
                'relative w-full py-3 px-6 rounded-xl font-semibold text-sm',
                'transition-all duration-300 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive
                  ? 'text-white shadow-lg transform scale-[1.02]'
                  : 'text-muted hover:text-foreground hover:bg-background/50',
                isDisabled ? 'pointer-events-none' : ''
              )}
              whileHover={!isDisabled && !isActive ? {
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              } : {}}
              whileTap={!isDisabled ? {
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              } : {}}
            >
              {/* Active background with gradient */}
              {isActive && (
                <motion.div
                  className={cn(
                    'absolute inset-0 rounded-xl',
                    'bg-gradient-to-r from-primary-500 to-primary-600',
                    'shadow-lg',
                    // Add subtle inner glow
                    'before:absolute before:inset-0 before:rounded-xl',
                    'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
                    'before:opacity-80'
                  )}
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.3
                  }}
                />
              )}

              {/* Tab label */}
              <span className="relative z-10 select-none">
                {tab.label}
              </span>

              {/* Subtle hover effect for inactive tabs */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-background/0 hover:bg-background/30 transition-colors duration-200"
                  whileHover={{ backgroundColor: 'rgba(var(--color-background), 0.3)' }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
});

TabSwitcher.displayName = 'TabSwitcher';

/**
 * TabContent Component - Content container for tab panels
 */
const TabContent = React.forwardRef(({
  activeTab,
  tabId,
  children,
  className,
  ...props
}, ref) => {
  const isActive = activeTab === tabId;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          ref={ref}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tab-${tabId}`}
          className={cn('focus:outline-none', className)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TabContent.displayName = 'TabContent';

export { TabSwitcher, TabContent };
export default TabSwitcher;

/*
USAGE EXAMPLES:

// Basic tab switcher
const [activeTab, setActiveTab] = useState('login');

const tabs = [
  { id: 'login', label: 'Sign In' },
  { id: 'signup', label: 'Sign Up' },
  { id: 'forgot', label: 'Reset Password', disabled: true }
];

<TabSwitcher
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>

// Different variants
<TabSwitcher variant="default" ... />    // Background switches
<TabSwitcher variant="pills" ... />      // Pill-shaped active state
<TabSwitcher variant="underline" ... />  // Underline indicator

// Different sizes
<TabSwitcher size="sm" ... />   // Compact
<TabSwitcher size="md" ... />   // Standard
<TabSwitcher size="lg" ... />   // Large

// With content panels
<div>
  <TabSwitcher
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={setActiveTab}
  />

  <TabContent activeTab={activeTab} tabId="login">
    <LoginForm />
  </TabContent>

  <TabContent activeTab={activeTab} tabId="signup">
    <SignupForm />
  </TabContent>
</div>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Smooth animations with layoutId for natural transitions
- Full keyboard navigation (arrows, enter, space)
- Disabled state support
- Multiple visual variants
- Accessible ARIA attributes
- Professional hover and focus states
- Semantic sizing system integration
*/