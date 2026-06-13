import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default: dark mode. Read from localStorage if available.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bg-realty-theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
      // No preference saved → default to dark
      return true;
    } catch {
      return true;
    }
  });

  // Sync localStorage and <html> class whenever theme changes
  useEffect(() => {
    try {
      localStorage.setItem('bg-realty-theme', isDarkMode ? 'dark' : 'light');
    } catch { /* ignore storage errors */ }

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
