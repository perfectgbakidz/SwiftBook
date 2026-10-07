import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { INITIAL_FAQS } from '../data/mockData';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutContactFAQ: React.FC<{ initialTab?: 'about' | 'contact' | 'faq' }> = ({ initialTab = 'about' }) => {
  const { setActiveView, showToast } = useBooking();
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'faq'>(initialTab);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    showToast('Your message has been received. Our team will follow up within 2 hours.', 'success');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header and Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD] dark:text-[#38bdf8]">
            Information & Support
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {activeTab === 'about' && 'About Calenova'}
            {activeTab === 'contact' && 'Contact & Location'}
            {activeTab === 'faq' && 'Frequently Asked Questions'}
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['about', 'contact', 'faq'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab === 'faq' ? 'FAQ' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ABOUT SECTION */}
      {activeTab === 'about' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Reinventing Appointment Scheduling for Modern Practices
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Founded with a straightforward mission: eliminate the friction of scheduling appointments and banish costly no-shows. For too long, booking medical consultations, beauty appointments, and executive advisory sessions meant endless phone games, missed confirmations, and awkward rescheduling requests.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Calenova empowers both clients and practitioners with a real-time availability engine, automated 24-hour and 2-hour notification reminders, and a 1-click self-service portal.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="font-mono text-2xl font-bold text-[#0F6CBD]">&lt; 60s</span>
                  <span className="text-xs text-slate-500 block mt-1">Average Booking Speed</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="font-mono text-2xl font-bold text-[#22A06B]">68%</span>
                  <span className="text-xs text-slate-500 block mt-1">No-Show Reduction</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="font-mono text-2xl font-bold text-[#FF7A59]">100%</span>
                  <span className="text-xs text-slate-500 block mt-1">Self-Service Reschedule</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Our Core Pillars
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Punctuality First:</strong> Automated 2h SMS reminders with 1-tap confirmation protect both customer time and practitioner revenue.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Zero-Friction Control:</strong> Clients shouldn't have to call or email to change an appointment when life happens.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Unified Operations:</strong> From single practitioners to multi-room suites, managing staff schedules and CRM notes is effortless.
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setActiveView('book')}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
                >
                  Experience the 60-Second Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT & LOCATION SECTION */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Practice Headquarters & Suites
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0F6CBD] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Address:</strong>
                    <div>450 Montgomery St, Suite 800</div>
                    <div>San Francisco, CA 94104</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0F6CBD] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Concierge Desk:</strong>
                    <div className="font-mono">+1 (555) 382-9000</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0F6CBD] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Email:</strong>
                    <div className="font-mono">concierge@calenova-suites.com</div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Facility Operating Hours</span>
                </div>
                <div className="space-y-1 text-xs text-slate-500 font-mono">
                  <div className="flex justify-between">
                    <span>Monday – Friday:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">08:00 AM – 08:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">09:00 AM – 05:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sunday:</span>
                    <span>Closed (Specialist By Request)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#0F6CBD] mx-auto" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Montgomery Transit Station & Parking Garage
              </div>
              <p className="text-[11px] text-slate-500">
                Convenient valet parking available on Sacramento St. ADA accessible elevators to 8th Floor.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Send a Message to the Concierge
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Have questions regarding custom corporate packages or specialized treatment intake?
              </p>
            </div>

            {messageSent ? (
              <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#22A06B] mx-auto" />
                <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                  Message Dispatched Successfully!
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto">
                  Our front-desk operations team will respond to {contactEmail} within 2 hours.
                </p>
                <button
                  onClick={() => setMessageSent(false)}
                  className="mt-2 text-xs font-semibold text-[#0F6CBD] underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Practice Department
                  </label>
                  <select
                    value={contactSubject}
                    onChange={e => setContactSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  >
                    <option value="General Inquiry">General Concierge Inquiry</option>
                    <option value="Clinic Medical Questions">Clinical & Dermatological Practice</option>
                    <option value="Salon & Hair Design">Salon & Aesthetic Services</option>
                    <option value="Executive Consulting">Executive Strategy Consulting</option>
                    <option value="Academic Tutoring">STEM & Mathematics Tutoring</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="How can our practitioners assist you today?"
                    className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. FAQ ACCORDION SECTION */}
      {activeTab === 'faq' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Everything You Need to Know
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Click any question to view policies, notification mechanics, and booking answers.
            </p>
          </div>

          <div className="space-y-3">
            {INITIAL_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2 mt-8">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Still have questions?
            </h4>
            <p className="text-xs text-slate-500">
              Our support team is available 6 days a week to help with custom bookings and scheduling.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('contact')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] rounded-lg hover:bg-[#0B5394] transition-colors"
              >
                Contact Concierge Desk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
