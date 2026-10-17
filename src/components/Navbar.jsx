import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronDown, Menu, X, Sun, Moon, Key } from 'lucide-react';
import EnquireModal from './EnquireModal';
import LoginModal from './LoginModal';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setIsLoginModalOpen(true);
      // Clean up the URL without reloading the page
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search]);

  const navLinks = [
    { name: 'Home' },
    { name: 'About us' },
    { name: 'Services' },
    { name: 'Property List' },
    { name: 'Contact us' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b flex items-center h-24 md:h-28 ${
          isScrolled 
            ? 'bg-[#0A0710]/95 backdrop-blur-[12px] border-white/10 shadow-lg' 
            : 'bg-[#0A0710]/90 backdrop-blur-[12px] border-white/5'
        }`}
      >
        <div className="max-w-[1600px] w-full mx-auto px-6 xl:px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center h-full py-1 md:py-1.5 z-50">
            <img 
              src="/logo.webp" 
              alt="The Pink Realty Logo" 
              width="180"
              height="94"
              className="h-full w-auto object-contain transition-all duration-300 origin-left"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const path = link.name === 'Home' ? '/' : `/${link.name.toLowerCase().replace(/ /g, '-')}`;
              const isActive = currentPath === path;
              return (
                <Link
                  key={link.name}
                  to={path}
                  className={`relative group flex items-center gap-1 text-[15px] font-medium transition-colors ${isActive ? 'text-pink active' : 'text-slate-200 hover:text-white'}`}
                >
                  <span>{link.name}</span>
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-pink to-pink-hover transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="relative p-2 rounded-full transition-colors text-slate-300 hover:bg-white/10 hover:text-pink overflow-hidden w-9 h-9 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
              <Moon className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-pink-button hover:bg-pink-button-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-soft"
            >
              Enquire Now
            </button>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="flex p-2 text-slate-400 hover:text-pink transition-colors ml-1"
              title="Admin Login"
            >
              <Key className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Mobile Menu Toggle & Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden z-50">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2 text-slate-400 hover:text-pink transition-colors"
              title="Admin Login"
            >
              <Key className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={toggleTheme}
              className="relative p-2 rounded-full transition-colors text-slate-300 hover:bg-white/10 hover:text-pink overflow-hidden w-9 h-9 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
              <Moon className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            </button>
            <button 
              className="p-2 text-white hover:text-pink transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="text-white w-6 h-6" />
              ) : (
                <Menu className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Nav */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0A0710] border-l border-white/10 z-40 transition-transform duration-300 lg:hidden flex flex-col pt-28 px-6 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full invisible'
        }`}
        {...(!isMobileMenuOpen ? { inert: true } : {})}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex flex-col gap-6 text-xl font-heading text-white">
          {navLinks.map((link) => {
            const path = link.name === 'Home' ? '/' : `/${link.name.toLowerCase().replace(/ /g, '-')}`;
            const isActive = currentPath === path;
            return (
              <Link
                key={link.name}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between border-b border-white/10 pb-4 transition-colors ${isActive ? 'text-pink' : 'text-slate-200 hover:text-pink'}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsModalOpen(true);
          }}
          className="mt-8 bg-pink-button text-white py-4 rounded-xl font-medium w-full shadow-soft"
        >
          Enquire Now
        </button>
      </div>

      <EnquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
