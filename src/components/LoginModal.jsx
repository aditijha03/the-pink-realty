import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      await login();
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      if (!navigator.onLine || err.message === 'Failed to fetch') {
        setError('Network error. Please check your connection.');
      } else if (err.status === 401) {
        setError('Invalid email or password.');
      } else if (err.status === 403) {
        setError('Access denied.');
      } else if (err.status === 429) {
        const retryAfter = err.retryAfter ? ` Try again in ${err.retryAfter} seconds.` : ' Please try again later.';
        setError(`Too many login attempts.${retryAfter}`);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-surface-2 rounded-full text-text-muted hover:text-text hover:bg-border transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-playfair font-bold text-center text-text mb-2">Admin Login</h2>
          <p className="text-center text-text-muted text-sm mb-8">Sign in to manage properties and enquiries.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-xl border border-red-500/20 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink transition-all" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-button text-white py-3.5 rounded-xl font-medium hover:bg-pink-button-hover transition-colors shadow-soft disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
