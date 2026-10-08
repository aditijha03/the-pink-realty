import React, { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  // Start visible if already in viewport (avoids flash on above-the-fold content)
  const [isVisible, setIsVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if already in viewport on mount — if so, show immediately (no flash)
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (alreadyVisible) {
      // Small rAF delay so the CSS transition still fires (gives a gentle fade-in)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
          setInitialized(true);
        });
      });
    } else {
      setInitialized(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'left':  return 'translateX(-24px)';
      case 'right': return 'translateX(24px)';
      case 'down':  return 'translateY(-24px)';
      case 'up':
      default:      return 'translateY(20px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        // No transition until initialized — prevents the invisible-flash on SSR/hydration
        transitionDuration: initialized ? '550ms' : '0ms',
        transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
