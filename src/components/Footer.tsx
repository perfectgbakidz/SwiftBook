import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useBooking();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Logo and Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F6CBD] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                C
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Calenova
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Professional appointment booking & schedule management platform. Built to eliminate missed sessions through automated 2h SMS reminders, under 60-second express bookings, and seamless 1-click self-service rescheduling.
            </p>
            <div className="text-[11px] text-slate-400 pt-1">
              Trusted by multi-disciplinary clinics, salons, strategy consultancies, and academic centers.
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-[#0F6CBD] transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-[#0F6CBD] transition-colors">
                  Services Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('team')} className="hover:text-[#0F6CBD] transition-colors">
                  Certified Specialists
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('book')} className="hover:text-[#0F6CBD] font-semibold transition-colors">
                  Express 4-Step Booking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('sitemap')} className="hover:text-[#FF7A59] transition-colors">
                  Structured Site Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Portals & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('customer-portal')} className="hover:text-[#0F6CBD] transition-colors">
                  Customer Self-Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('provider-portal')} className="hover:text-[#0F6CBD] transition-colors">
                  Staff Schedule Agenda
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="hover:text-[#0F6CBD] transition-colors">
                  Business Administration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faq')} className="hover:text-[#0F6CBD] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-[#0F6CBD] transition-colors">
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info & Working Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Facility & Hours
            </h4>
            <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>450 Montgomery St, Suite 800, San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">+1 (555) 382-9000</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Mon–Fri: 8am–8pm · Sat: 9am–5pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Privacy/Terms */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 Calenova Booking & Operations Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Cancellation Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
