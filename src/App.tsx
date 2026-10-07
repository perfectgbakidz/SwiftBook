/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomeLanding } from './components/HomeLanding';
import { ServicesPage } from './components/ServicesPage';
import { TeamPage } from './components/TeamPage';
import { AboutContactFAQ } from './components/AboutContactFAQ';
import { BookingFunnel } from './components/BookingFunnel';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ProviderPortal } from './components/ProviderPortal';
import { AdminHub } from './components/AdminHub';
import { SiteMapView } from './components/SiteMapView';
import { ComponentShowcase } from './components/ComponentShowcase';
import { ErrorPages } from './components/ErrorPages';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, toast } = useBooking();

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#0F172A] text-[#1F2937] dark:text-[#E5E7EB] flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Public Pages */}
        {activeView === 'home' && <HomeLanding />}
        {activeView === 'services' && <ServicesPage />}
        {activeView === 'team' && <TeamPage />}
        {activeView === 'contact' && <AboutContactFAQ initialTab="contact" />}
        {activeView === 'about' && <AboutContactFAQ initialTab="about" />}
        {activeView === 'faq' && <AboutContactFAQ initialTab="faq" />}
        {activeView === 'book' && <BookingFunnel />}
        {activeView === 'components' && <ComponentShowcase />}
        {activeView === 'sitemap' && <SiteMapView />}
        {activeView === '404' && <ErrorPages type="404" />}
        {activeView === '500' && <ErrorPages type="500" />}

        {/* Customer Portal */}
        {activeView === 'customer-portal' && <CustomerDashboard />}

        {/* Staff / Provider Portal */}
        {activeView === 'provider-portal' && <ProviderPortal />}

        {/* Business Admin Hub (Dashboard, Calendar, Appointments, Services, Staff, CRM, Reports, Settings) */}
        {activeView.startsWith('admin-') && <AdminHub />}
      </main>

      <Footer />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Persistent Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 dark:border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#22A06B] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#0F6CBD] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />}
          <div className="flex-1 text-xs leading-relaxed font-medium">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
