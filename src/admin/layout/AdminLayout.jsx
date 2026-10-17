import React, { useState } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink, Sun, Moon, LayoutDashboard, Building, MessageSquare, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Helmet } from 'react-helmet-async';

const AdminLayout = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className={`flex flex-col md:flex-row h-[100dvh] font-inter overflow-hidden ${theme === 'dark' ? 'bg-[#0A0710] text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      {/* Mobile Top Header */}
      <div className={`md:hidden p-4 shadow-sm flex justify-between items-center z-40 relative ${theme === 'dark' ? 'bg-[#14101C] border-b border-white/10' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 -ml-1 text-[#D6246E]" aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-xl font-playfair font-bold text-[#D6246E]">TPR Admin</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={toggleTheme} 
            aria-label="Toggle theme" 
            title="Toggle theme"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer" 
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#D6246E] hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
            title="View Site"
            aria-label="View Site"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button 
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop static, Mobile overlay */}
      <aside className={`
        fixed md:static inset-y-0 top-0 bottom-0 left-0 z-50 w-72 sm:w-80 md:w-64 h-full max-h-screen overflow-hidden flex-shrink-0 shadow-2xl md:shadow-md flex flex-col
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' ? 'bg-[#14101C] border-r border-white/10' : 'bg-white'}
      `}>
        <div className={`p-4 border-b flex justify-between items-center shrink-0 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-2xl font-playfair font-bold text-[#D6246E]">TPR Admin</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden p-1.5 rounded-lg text-[#D6246E] hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors" 
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto flex-1 min-h-0">
          {[
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />, exact: true },
            { path: '/admin/properties', label: 'Properties', icon: <Building className="w-5 h-5 flex-shrink-0" /> },
            { path: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="w-5 h-5 flex-shrink-0" /> }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                  ? 'bg-gradient-to-r from-[#D6246E] to-[#B81D5B] text-white shadow-md' 
                  : `hover:bg-pink-50 hover:text-[#D6246E] ${theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600'}`
              }`}
            >
              {item.icon}
              <span className="text-base">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer - Guaranteed visible across all mobile screen sizes */}
        <div className={`p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t shrink-0 w-full bg-inherit ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold transition-all duration-300 hover:bg-red-50 hover:text-red-600 text-red-500 dark:text-red-400 active:scale-[0.98] ${theme === 'dark' ? 'hover:bg-red-500/10' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <main className="flex-1 overflow-y-auto w-full flex flex-col relative z-0">
        <header className={`hidden md:flex shadow p-4 justify-end items-center gap-6 ${theme === 'dark' ? 'bg-[#14101C] border-b border-white/10' : 'bg-white'}`}>
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
        </header>
        <div className="p-4 md:p-6 pb-20 md:pb-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
