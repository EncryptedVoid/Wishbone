import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // light | dark
  const [colorTheme, setColorTheme] = useState('blue'); // blue | purple | green
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';

    setTheme(savedTheme);
    setColorTheme(savedColorTheme);

    // Apply to document
    applyTheme(savedTheme, savedColorTheme);
    setIsLoading(false);
  }, []);

  const applyTheme = (newTheme, newColorTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    root.setAttribute('data-color-theme', newColorTheme);

    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', newTheme === 'dark' ? '#1e293b' : '#ffffff');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, colorTheme);
  };

  const changeColorTheme = (newColorTheme) => {
    setColorTheme(newColorTheme);
    localStorage.setItem('colorTheme', newColorTheme);
    applyTheme(theme, newColorTheme);
  };

  const value = {
    theme,
    colorTheme,
    toggleTheme,
    changeColorTheme,
    isLoading,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};