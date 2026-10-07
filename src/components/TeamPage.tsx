import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Provider, IndustryCategory } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';
import { 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Phone, 
  Mail, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { 
    providers, 
    services, 
    setActiveView, 
    setSelectedBookingProviderId 
  } = useBooking();

  const [categoryFilter, setCategoryFilter] = useState<IndustryCategory>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [activeModalProvider, setActiveModalProvider] = useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchRating = p.rating >= minRating;
      return matchCat && matchRating;
    });
  }, [providers, categoryFilter, minRating]);

  const handleBookWithProvider = (providerId: string) => {
    setSelectedBookingProviderId(providerId);
    setActiveModalProvider(null);
    setActiveView('book');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
          Practitioners & Specialists
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Our Certified Providers
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          Experienced professionals committed to punctuality, personalized care, and verified outcomes.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'clinic', 'salon', 'consulting', 'tutoring'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all capitalize ${
                categoryFilter === cat
                  ? 'bg-[#0F6CBD] text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Specialists' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Min Rating:</span>
          <select
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
          >
            <option value={0}>Any Rating</option>
            <option value={4.9}>4.9+ Stars</option>
            <option value={4.95}>4.95+ Stars</option>
          </select>
        </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredProviders.map(prov => {
          const provServices = services.filter(s => prov.servicesOffered.includes(s.id));
          return (
            <div
              key={prov.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={prov.avatar}
                  alt={prov.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#0F6CBD] dark:text-[#38bdf8]">
                      {prov.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prov.rating}</span>
                      <span className="text-slate-400 font-normal font-mono">({prov.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {prov.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{prov.title}</div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {prov.bio}
                  </p>
                </div>
              </div>

              {/* Service Badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Offered Services:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {provServices.map(s => (
                    <span
                      key={s.id}
                      className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Next slot: Tomorrow 10:00 AM</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalProvider(prov)}
                    className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleBookWithProvider(prov.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
                  >
                    Book with {prov.name.split(' ')[1] || prov.name}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* PROVIDER PROFILE MODAL */}
      {activeModalProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto space-y-6 relative animate-in fade-in duration-150">
            
            <button
              onClick={() => setActiveModalProvider(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={activeModalProvider.avatar}
                alt={activeModalProvider.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeModalProvider.name}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400">{activeModalProvider.title}</div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{activeModalProvider.rating} rating</span>
                  <span className="text-slate-400 font-normal font-mono">({activeModalProvider.reviewCount} verified client reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Professional Bio & Credentials
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalProvider.bio}
              </p>
            </div>

            {/* Weekly Working Days */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Weekly Working Days
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(activeModalProvider.workingHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className={`p-2 rounded-lg border text-center ${
                      hours.isWorking
                        ? 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-100/50 dark:bg-slate-800/40 border-transparent text-slate-400'
                    }`}
                  >
                    <div className="font-bold capitalize">{day.slice(0, 3)}</div>
                    <div className="font-mono text-[10px]">
                      {hours.isWorking ? `${hours.start}–${hours.end}` : 'Off'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Client Reviews */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recent Client Testimonials
              </h4>
              <div className="space-y-2 text-xs">
                {INITIAL_REVIEWS.slice(0, 2).map(r => (
                  <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{r.author}</span>
                      <span className="text-amber-500">★ {r.rating}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalProvider(null)}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => handleBookWithProvider(activeModalProvider.id)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Book Appointment with {activeModalProvider.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
