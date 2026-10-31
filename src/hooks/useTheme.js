import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    try {
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
  }, []);

  return { theme: 'dark', setTheme: () => {} };
}
