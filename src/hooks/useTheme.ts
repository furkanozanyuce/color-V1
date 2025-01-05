import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set initial dark mode class
    document.documentElement.classList.toggle('dark', isDark);
  }, []); // Only run once on mount

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dark', newValue);
      return newValue;
    });
  };

  return { isDark, toggleTheme };
};