import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { UserRole } from '../types';
import { 
  Network, 
  RotateCcw, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  Calendar, 
  Bell, 
  Search, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeView, 
    setActiveView, 
    resetDemoData, 
    darkMode, 
    toggleDarkMode,
    setAuthModalOpen,
    setAuthMode,
    customers,
    selectedCustomerId
  } = useBooking();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'guest') {
      setActiveView('home');
    } else if (newRole === 'customer') {
      setActiveView('customer-portal');
    } else if (newRole === 'staff') {
      setActiveView('provider-portal');
    } else if (newRole === 'admin') {
      setActiveView('admin-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('home')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F6CBD] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#0F6CBD] transition-colors">
              Calenova
            </span>
          </button>
        </div>

        {/* Center: Public Nav Links (Section 4) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveView('home')}
            className={`transition-colors py-1 ${
              activeView === 'home' 
                ? 'text-[#0F6CBD] dark:text-[#38bdf8] font-bold border-b-2 border-[#0F6CBD]' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveView('services')}
            className={`transition-colors py-1 ${
              activeView === 'services' 
                ? 'text-[#0F6CBD] dark:text-[#38bdf8] font-bold border-b-2 border-[#0F6CBD]' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => setActiveView('team')}
            className={`transition-colors py-1 ${
              activeView === 'team' 
                ? 'text-[#0F6CBD] dark:text-[#38bdf8] font-bold border-b-2 border-[#0F6CBD]' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Team
          </button>

          <button
            onClick={() => setActiveView('contact')}
            className={`transition-colors py-1 ${
              activeView === 'contact' 
                ? 'text-[#0F6CBD] dark:text-[#38bdf8] font-bold border-b-2 border-[#0F6CBD]' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Contact
          </button>

          <button
            onClick={() => setActiveView('components')}
            className={`flex items-center gap-1.5 transition-colors py-1 ${
              activeView === 'components' 
                ? 'text-[#0F6CBD] font-bold border-b-2 border-[#0F6CBD]' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>UI Library</span>
          </button>

          <button
            onClick={() => setActiveView('sitemap')}
            className={`flex items-center gap-1.5 transition-colors py-1 ${
              activeView === 'sitemap' 
                ? 'text-[#FF7A59] font-bold border-b-2 border-[#FF7A59]' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Site Map</span>
          </button>
        </nav>

        {/* Right: Actions, Dark Mode, Role Switcher, Login, Book Now */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            {(['guest', 'customer', 'staff', 'admin'] as const).map(r => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-all capitalize ${
                  role === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Login text button */}
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0F6CBD] px-2 py-1"
          >
            Login
          </button>

          {/* Book Now primary button */}
          <button
            onClick={() => setActiveView('book')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            Book Now
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Role Context Bar & Dashboard Shortcut */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-[#38bdf8]">
              Role:
            </span>
            <span className="text-white font-medium capitalize">
              {role === 'guest' && 'Guest Visitor (Public Experience)'}
              {role === 'customer' && `Customer: ${activeCustomer?.name}`}
              {role === 'staff' && 'Practitioner / Staff Schedule Cockpit'}
              {role === 'admin' && 'Business Owner & Admin'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {role === 'customer' && (
              <button
                onClick={() => setActiveView('customer-portal')}
                className="text-[#38bdf8] hover:underline"
              >
                Open Customer Portal →
              </button>
            )}
            {role === 'staff' && (
              <button
                onClick={() => setActiveView('provider-portal')}
                className="text-[#38bdf8] hover:underline"
              >
                Open Staff Agenda →
              </button>
            )}
            {role === 'admin' && (
              <button
                onClick={() => setActiveView('admin-dashboard')}
                className="text-[#38bdf8] hover:underline"
              >
                Open Admin Hub →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#0F6CBD]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('services');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#0F6CBD]"
            >
              Services
            </button>
            <button
              onClick={() => {
                setActiveView('team');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#0F6CBD]"
            >
              Team
            </button>
            <button
              onClick={() => {
                setActiveView('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#0F6CBD]"
            >
              Contact & Location
            </button>
            <button
              onClick={() => {
                setActiveView('sitemap');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#0F6CBD]"
            >
              Structured Site Map
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Switch User Role:</div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(['guest', 'customer', 'staff', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold capitalize border ${
                    role === r
                      ? 'bg-[#0F6CBD] text-white border-[#0F6CBD]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
