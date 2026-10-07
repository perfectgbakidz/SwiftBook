import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { INITIAL_REVIEWS, INITIAL_FAQS } from '../data/mockData';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Bell, 
  RotateCcw, 
  Search,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const HomeLanding: React.FC = () => {
  const { 
    services, 
    providers, 
    setActiveView, 
    setSelectedBookingServiceId, 
    setSelectedBookingProviderId 
  } = useBooking();

  const [searchServiceId, setSearchServiceId] = useState('');
  const [searchDate, setSearchDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const popularServices = services.filter(s => s.popular).slice(0, 4);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchServiceId) {
      setSelectedBookingServiceId(searchServiceId);
    }
    setActiveView('book');
  };

  const handleBookService = (serviceId: string) => {
    setSelectedBookingServiceId(serviceId);
    setActiveView('book');
  };

  const handleBookProvider = (providerId: string) => {
    setSelectedBookingProviderId(providerId);
    setActiveView('book');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F6CBD]/10 text-[#0F6CBD] dark:bg-[#0F6CBD]/20 dark:text-[#38bdf8]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Appointment Scheduling</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Book your appointment in seconds.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Browse verified specialists across clinics, salons, advisory, and tutoring. Pick open time slots, get instant confirmation, and enjoy hassle-free 1-click rescheduling.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('book')}
                  className="px-6 py-3 text-sm font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Now (&lt; 60s)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveView('services')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-xs"
                >
                  View All Services
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#0F6CBD]" />
                  <span>Automated 2h SMS Reminders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#FF7A59]" />
                  <span>Free 24h Rescheduling</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Search Card & Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200 dark:border-slate-700 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Find Earliest Available Slot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select a service and preferred date to check real-time availability.
                  </p>
                </div>

                <form onSubmit={handleQuickSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Choose Service
                    </label>
                    <select
                      value={searchServiceId}
                      onChange={e => setSearchServiceId(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    >
                      <option value="">Any Service / Specialty...</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} (${s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={searchDate}
                      onChange={e => setSearchDate(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Open Appointments</span>
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400">
                    Average booking completion time: <strong>34 seconds</strong>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
            Effortless Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            No mandatory passwords, confusing calendars, or waiting on hold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD] flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Choose Service & Specialist
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Explore transparent pricing, exact session durations, and verified specialist credentials across medical, beauty, consulting, and tutoring practices.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A59]/10 text-[#FF7A59] flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pick Your Exact Time Slot
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Real-time schedule matrix grouped into Morning, Afternoon, and Evening slots. Automatic buffer calculation prevents double-bookings.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#22A06B]/10 text-[#22A06B] flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Get Instant Confirmation & Reminders
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Instant calendar invite (.ics / Google Calendar) + 24-hour email and 2-hour SMS alerts to make sure you never miss an appointment.
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SERVICES */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Popular Services
            </h2>
          </div>
          <button
            onClick={() => setActiveView('services')}
            className="text-xs font-semibold text-[#0F6CBD] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore all services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularServices.map(service => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="capitalize">{service.category}</span>
                  <span className="font-mono tabular-nums">{service.durationMinutes} min</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0F6CBD] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  ${service.price}
                </span>
                <button
                  onClick={() => handleBookService(service.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROVIDERS */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
              Experienced Team
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Featured Specialists
            </h2>
          </div>
          <button
            onClick={() => setActiveView('team')}
            className="text-xs font-semibold text-[#0F6CBD] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all team members</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {providers.map(prov => (
            <div
              key={prov.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all text-center"
            >
              <div>
                <img
                  src={prov.avatar}
                  alt={prov.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-slate-100 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {prov.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {prov.title}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{prov.rating}</span>
                  <span className="text-slate-400 font-normal font-mono">({prov.reviewCount})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleBookProvider(prov.id)}
                  className="w-full py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#0F6CBD] border border-slate-200 dark:border-slate-600 hover:border-[#0F6CBD] rounded-lg transition-colors cursor-pointer"
                >
                  Book with {prov.name.split(' ')[1] || prov.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US (4 BENEFIT TILES) */}
      <section className="bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
              The Calenova Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Built to Eliminate Friction & Missed Appointments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Under 60-Second Booking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                4 streamlined steps with clear time slots. No endless intake forms or forced account creation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#22A06B]/10 text-[#22A06B] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No-Show Reduction
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated 24h email and 2h SMS reminder messages cut client absences by 68%.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A59]/10 text-[#FF7A59] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Self-Service Rescheduling
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Change your booking in 2 taps directly from your customer portal without calling or emailing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure & Reliable
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calendar synchronization, encrypted client details, and strict privacy safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
            Client Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Loved by Clients & Business Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{rev.author}</div>
                  <div className="text-[11px] text-slate-400">{rev.serviceTitle}</div>
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ PREVIEW */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {INITIAL_FAQS.slice(0, 3).map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setActiveView('faq')}
              className="text-xs font-semibold text-[#0F6CBD] hover:underline"
            >
              View All Frequently Asked Questions →
            </button>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-[#0F6CBD] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to schedule your appointment?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Join thousands of clients who enjoy seamless booking, reliable SMS reminders, and zero phone tag.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('book')}
                className="px-8 py-3.5 text-sm font-bold text-[#0F6CBD] bg-white hover:bg-blue-50 rounded-lg transition-colors shadow-lg cursor-pointer"
              >
                Book in Under 60 Seconds
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
