import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const [displayKey, setDisplayKey] = useState(pathname);
  const [phase, setPhase] = useState('enter'); // 'exit' | 'enter'

  useEffect(() => {
    if (pathname === displayKey) return;

    // 1. Fade out current page
    setPhase('exit');

    const timer = setTimeout(() => {
      // 2. Swap page + fade in
      setDisplayKey(pathname);
      setPhase('enter');
    }, 200); // matches CSS exit duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      key={displayKey}
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 220ms ease, transform 220ms ease',
      }}
    >
      {children}
    </div>
  );
}
