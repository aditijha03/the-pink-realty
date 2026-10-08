const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Simple in-memory cache
const memoryCache = new Map();

function showToast(message) {
  if (typeof window === 'undefined' || !document) return;
  const div = document.createElement('div');
  div.textContent = message;
  Object.assign(div.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#ef4444', // red-500
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    zIndex: '9999',
    fontFamily: 'system-ui, sans-serif',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  });
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

export const apiFetch = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const skipCache = options.skipCache === true;
  // Admin pages never use public cache, handled by endpoint names
  const isCacheableGet = method === 'GET' && 
                         (endpoint === '/auth/me' || endpoint.startsWith('/public/properties'));

  if (isCacheableGet && !skipCache && memoryCache.has(endpoint)) {
    const cached = memoryCache.get(endpoint);
    const ttl = endpoint.startsWith('/public/properties') ? 15000 : Infinity; // 15 seconds TTL
    const age = Date.now() - cached.timestamp;
    
    if (age < ttl) {
      if (cached.error) throw cached.error;
      
      // SWR: Revalidate in background if older than 5 seconds
      if (endpoint.startsWith('/public/properties') && age > 5000) {
        // Run fetch in background
        apiFetch(endpoint, { ...options, skipCache: true }).then(newData => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('swr-update', { detail: { endpoint, data: newData } }));
          }
        }).catch(() => {});
      }
      return cached.data;
    } else {
      memoryCache.delete(endpoint);
    }
  }

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 429) {
    showToast('Too many requests. Please try again later.');
  }

  if (response.status === 401 && endpoint !== '/auth/me') {
    if (typeof window !== 'undefined' && !window.location.search.includes('login=true')) {
      window.location.href = '/?login=true';
    }
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (err) {
      console.error('Failed to parse JSON response:', err);
      data = { message: 'Invalid JSON response from server' };
    }
  } else {
    const textData = await response.text();
    if (endpoint !== '/auth/me') {
      console.warn('Non-JSON response received:', textData);
    }
    data = { message: textData || 'Invalid response from server' };
  }

  if (!response.ok) {
    if (endpoint === '/auth/me' && response.status === 401) {
      const error = new Error('Not logged in');
      error.status = 401;
      error.quiet = true;
      memoryCache.set(endpoint, { data: null, error, timestamp: Date.now() });
      throw error;
    }
    const error = new Error(data?.message || data?.error || 'Something went wrong');
    error.status = response.status;
    error.retryAfter = response.headers.get('Retry-After');
    throw error;
  }

  // Cache only successful responses and never empty lists
  if (isCacheableGet) {
    const isEmptyList = Array.isArray(data) && data.length === 0;
    if (!isEmptyList) {
      memoryCache.set(endpoint, { data, timestamp: Date.now() });
    }
  }

  // Cache invalidation and Cross-tab sync
  if (method !== 'GET') {
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/logout')) {
      memoryCache.delete('/auth/me');
    }
    if (endpoint.startsWith('/admin')) {
      // Clear local memory cache
      for (const key of memoryCache.keys()) {
        if (key.startsWith('/public/properties')) memoryCache.delete(key);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('properties-updated', Date.now().toString());
      }
    }
  }

  return data;
};
