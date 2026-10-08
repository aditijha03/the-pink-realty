import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (signal) => {
    try {
      const { apiFetch } = await import('../lib/api');
      await apiFetch('/auth/me', { signal });
      setIsAuthenticated(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setIsAuthenticated(false);
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    // Only check auth immediately if on an admin route
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      checkAuth(controller.signal);
    } else {
      setLoading(false);
    }
    
    return () => controller.abort();
  }, []);

  const login = async () => {
    await checkAuth();
  };

  const logout = async () => {
    try {
      const { apiFetch } = await import('../lib/api');
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
