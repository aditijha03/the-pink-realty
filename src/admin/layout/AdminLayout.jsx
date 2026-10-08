import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink, Sun, Moon, LayoutDashboard, Building, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Helmet } from 'react-helmet-async';

const AdminLayout = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="sr-only">Admin Loading</h1>
        <div className="text-xl text-gray-600 font-medium animate-pulse">Loading Admin...</div>
      </main>
    );
  }
  if (!isAuthenticated) return <Navigate to="/?login=true" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex h-screen font-inter ${theme === 'dark' ? 'bg-[#0A0710] text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <aside className={`w-64 shadow-md ${theme === 'dark' ? 'bg-[#14101C] border-r border-white/10' : 'bg-white'}`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : ''}`}>
          <h2 className="text-2xl font-playfair font-bold text-[#D6246E]">TPR Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
            { path: '/admin/properties', label: 'Properties', icon: <Building className="w-5 h-5" /> },
            { path: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="w-5 h-5" /> }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-300 ${
                (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                  ? 'bg-gradient-to-r from-[#D6246E] to-[#B81D5B] text-white shadow-md' 
                  : `hover:bg-pink-50 hover:text-[#D6246E] ${theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600'}`
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className={`shadow p-4 flex justify-end items-center gap-6 ${theme === 'dark' ? 'bg-[#14101C] border-b border-white/10' : 'bg-white'}`}>
          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative overflow-hidden ${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="Toggle theme"
          >
            <Sun className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
            <Moon className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
          </button>
          
          <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-2 font-medium transition-colors hover:text-[#D6246E] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <ExternalLink className="w-4 h-4" />
            View Site
          </a>
          <button onClick={handleLogout} className="text-[#D6246E] font-medium hover:underline">Logout</button>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
