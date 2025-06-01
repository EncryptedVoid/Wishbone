module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // SEMANTIC COLORS - Keep your existing system
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },

      // RESPONSIVE TYPOGRAPHY - These automatically adapt to screen size
      fontSize: {
        'responsive-xs': 'var(--text-xs)',
        'responsive-sm': 'var(--text-sm)',
        'responsive-base': 'var(--text-base)',
        'responsive-lg': 'var(--text-lg)',
        'responsive-xl': 'var(--text-xl)',
        'responsive-2xl': 'var(--text-2xl)',
        'responsive-3xl': 'var(--text-3xl)',
        'responsive-4xl': 'var(--text-4xl)',
        'responsive-5xl': 'var(--text-5xl)',
        'responsive-6xl': 'var(--text-6xl)',
      },

      // RESPONSIVE SPACING - These also automatically adapt
      spacing: {
        'responsive-xs': 'var(--space-xs)',
        'responsive-sm': 'var(--space-sm)',
        'responsive-md': 'var(--space-md)',
        'responsive-lg': 'var(--space-lg)',
        'responsive-xl': 'var(--space-xl)',
        'responsive-2xl': 'var(--space-2xl)',
        'responsive-3xl': 'var(--space-3xl)',
      },

      // COMPONENT HEIGHTS - For consistent button/input sizing
      height: {
        'button-sm': 'var(--size-button-sm)',
        'button-md': 'var(--size-button-md)',
        'button-lg': 'var(--size-button-lg)',
        'input-sm': 'var(--size-input-sm)',
        'input-md': 'var(--size-input-md)',
        'input-lg': 'var(--size-input-lg)',
      },

      // KEEP YOUR EXISTING ANIMATIONS
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        // Add some new professional animations
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
      },

      // KEEP YOUR EXISTING KEYFRAMES + ADD NEW ONES
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // New professional animations
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },

      // CONTAINER SIZES FOR PROFESSIONAL LAYOUTS
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },

      // PROFESSIONAL SHADOWS
      boxShadow: {
        'soft': '0 2px 8px 0 rgb(0 0 0 / 0.05)',
        'medium': '0 4px 12px 0 rgb(0 0 0 / 0.1)',
        'strong': '0 8px 24px 0 rgb(0 0 0 / 0.15)',
        'glow': '0 0 20px 0 rgb(var(--color-primary-500) / 0.3)',
      }
    },
  },
  plugins: [],
}