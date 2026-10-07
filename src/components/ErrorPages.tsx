import React from 'react';
import { useBooking } from '../context/BookingContext';
import { AlertCircle, WifiOff, Home, RotateCcw } from 'lucide-react';

export const ErrorPages: React.FC<{ type?: '404' | '500' }> = ({ type = '404' }) => {
  const { setActiveView, showToast } = useBooking();

  if (type === '500') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-[#D64545] rounded-full flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Network Connection Error
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          We encountered a temporary connection glitch while synchronizing calendar slots. Your data is safe.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <button
            onClick={() => {
              showToast('Reconnected to booking server', 'success');
              setActiveView('book');
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-[#0F6CBD] rounded-full flex items-center justify-center mx-auto font-mono text-2xl font-bold">
        404
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        The requested scheduling URL or route does not exist. Please return to the homepage or open your appointment portal.
      </p>
      <div className="pt-2 flex justify-center gap-2">
        <button
          onClick={() => setActiveView('home')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
