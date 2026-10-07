import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Service, IndustryCategory } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';
import { 
  Search, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Star, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { 
    services, 
    providers, 
    setActiveView, 
    setSelectedBookingServiceId, 
    serviceDetailId, 
    setServiceDetailId 
  } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategory>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'duration'>('popularity');

  const filteredServices = useMemo(() => {
    return services
      .filter(s => {
        const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  const activeDetailService = useMemo(() => {
    if (!serviceDetailId) return null;
    return services.find(s => s.id === serviceDetailId) || null;
  }, [services, serviceDetailId]);

  const handleBookService = (serviceId: string) => {
    setSelectedBookingServiceId(serviceId);
    setServiceDetailId(null);
    setActiveView('book');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
          Catalog & Discovery
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Explore Services & Treatments
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          Browse specialized procedures and consultations across health clinics, salons, executive advisory, and academic mentoring.
        </p>
      </div>

      {/* Filters, Search & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search service title or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'clinic', 'salon', 'consulting', 'tutoring'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-[#0F6CBD] text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration">Shortest Duration</option>
          </select>
        </div>
      </div>

      {/* Services Grid (3 columns on desktop, 1 on mobile) */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No services match your search
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting the category filter to view all available services.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#0F6CBD] bg-[#0F6CBD]/10 rounded-lg hover:bg-[#0F6CBD]/20 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const assignedProviders = providers.filter(p => service.providerIds.includes(p.id));
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="capitalize font-medium text-[#0F6CBD] dark:text-[#38bdf8]">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0F6CBD] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Assigned Provider Avatars */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {assignedProviders.map(p => (
                        <img
                          key={p.id}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {assignedProviders.length} specialist{assignedProviders.length > 1 ? 's' : ''} available
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Price</span>
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                      ${service.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServiceDetailId(service.id)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleBookService(service.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SERVICE DETAIL MODAL */}
      {activeDetailService && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto space-y-6 relative animate-in fade-in duration-150">
            
            <button
              onClick={() => setServiceDetailId(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#0F6CBD] dark:text-[#38bdf8] font-bold uppercase mb-1">
                <span>{activeDetailService.category}</span>
                <span>·</span>
                <span>{activeDetailService.durationMinutes} Minutes</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeDetailService.title}
              </h2>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Description & Clinical Protocol
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeDetailService.description}
              </p>
            </div>

            {activeDetailService.preparationNote && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <div>
                  <strong>Preparation Instructions:</strong> {activeDetailService.preparationNote}
                </div>
              </div>
            )}

            {/* Available Specialists */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Assigned Specialists for this Service
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {providers
                  .filter(p => activeDetailService.providerIds.includes(p.id))
                  .map(prov => (
                    <div
                      key={prov.id}
                      className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center gap-3"
                    >
                      <img
                        src={prov.avatar}
                        alt={prov.name}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">{prov.name}</div>
                        <div className="text-slate-500 dark:text-slate-400">{prov.title}</div>
                        <div className="text-amber-500 font-bold mt-0.5">★ {prov.rating}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase">Total Session Fee</span>
                <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                  ${activeDetailService.price}
                </span>
              </div>

              <button
                onClick={() => handleBookService(activeDetailService.id)}
                className="px-6 py-3 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
