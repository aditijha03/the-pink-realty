import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

let initialLoadHandled = false;

export default function IntroLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const location = useLocation();
  const hasStarted = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Only run on the initial mount of the app
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    const isSSR = typeof window === 'undefined';
    if (isSSR) return;

    const wasInitialLoad = !initialLoadHandled;
    initialLoadHandled = true;

    if (!wasInitialLoad) return;

    const config = siteConfig.introLoader || { mode: 'always', routes: ['/'] };

    if (config.mode === 'off') return;
    if (!config.routes.includes(location.pathname)) return;
    if (location.pathname.startsWith('/admin')) return;
    if (config.mode === 'session' && sessionStorage.getItem('introSeen')) return;

    // Show the loader
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Fallback checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let isSlow = false;
    if (connection) {
      if (connection.saveData) isSlow = true;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') isSlow = true;
    }

    const needsFallback = prefersReducedMotion || isSlow;
    setUseFallback(needsFallback);

    let maxTimeout;
    let playCheckTimeout;

    if (needsFallback) {
      maxTimeout = setTimeout(() => setIsFading(true), 600);
    } else {
      maxTimeout = setTimeout(() => setIsFading(true), 3200);

      playCheckTimeout = setTimeout(() => {
        if (videoRef.current && videoRef.current.currentTime === 0) {
          setUseFallback(true);
          setIsFading(true);
        }
      }, 1000);
    }

    const handleInteraction = () => {
      setIsFading(true);
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      clearTimeout(maxTimeout);
      clearTimeout(playCheckTimeout);
      document.body.style.overflow = '';
    };
  }, []); // Run only once when the component mounts globally

  // Handle the fade out logic
  useEffect(() => {
    if (isFading && isVisible) {
      const t = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
        if (siteConfig.introLoader?.mode === 'session') {
          sessionStorage.setItem('introSeen', 'true');
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isFading, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 bg-[#000] ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="sr-only">Loading The Pink Realty</span>
      
      {!useFallback ? (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          preload="auto"
          poster="/intro/logo-poster.webp"
          onEnded={() => setIsFading(true)}
          onError={() => {
            setUseFallback(true);
            setTimeout(() => setIsFading(true), 600);
          }}
          className="max-w-[90vw] max-h-[60vh] object-contain mix-blend-screen"
          width={1280}
          height={720}
          aria-hidden="true"
        >
          <source src="/intro/logo-intro.webm" type="video/webm" />
          <source src="/intro/logo-intro.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/intro/logo-poster.webp"
          alt=""
          width={1280}
          height={720}
          className="max-w-[90vw] max-h-[60vh] object-contain mix-blend-screen"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => setIsFading(true)}
        className="absolute bottom-6 right-6 px-4 py-2 text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-pink rounded"
      >
        Skip
      </button>
    </div>
  );
}
