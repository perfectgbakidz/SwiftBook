import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Appointment, AppointmentStatus } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Phone, 
  Mail, 
  Settings, 
  Bell, 
  ShieldAlert, 
  FileText,
  ChevronRight,
  ExternalLink,
  MapPin,
  Lock,
  Trash2
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    appointments, 
    services, 
    providers, 
    customers, 
    selectedCustomerId, 
    setSelectedCustomerId,
    rescheduleAppointment, 
    cancelAppointment, 
    setActiveView,
    showToast 
  } = useBooking();

  // Sub-tabs: 'overview', 'appointments', 'settings'
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'appointments' | 'settings'>('overview');
  
  // Appointments tab filter: 'upcoming' | 'past' | 'cancelled'
  const [appointmentFilterTab, setAppointmentFilterTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Active client
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const customerAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.customerId === activeCustomer?.id || 
      a.customerEmail.toLowerCase() === activeCustomer?.email.toLowerCase()
    );
  }, [appointments, activeCustomer]);

  const upcomingAppointments = customerAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppointments = customerAppointments.filter(a => a.status === 'completed');
  const cancelledAppointments = customerAppointments.filter(a => a.status === 'cancelled' || a.status === 'no_show');

  const nextAppointment = upcomingAppointments[0] || null;

  // Reschedule Modal State
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<string>('11:00');

  // Cancel Modal State
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');

  // Detail Modal State
  const [detailModalApt, setDetailModalApt] = useState<Appointment | null>(null);

  // Profile Settings Form State
  const [profileName, setProfileName] = useState(activeCustomer?.name || 'Sarah Jenkins');
  const [profileEmail, setProfileEmail] = useState(activeCustomer?.email || 'sarah.jenkins@gmail.com');
  const [profilePhone, setProfilePhone] = useState(activeCustomer?.phone || '+1 (555) 781-3094');
  const [profileTimezone, setProfileTimezone] = useState('America/Los_Angeles (PST)');
  const [reminder24hEmail, setReminder24hEmail] = useState(true);
  const [reminder2hSms, setReminder2hSms] = useState(true);
  const [reminder1hAlert, setReminder1hAlert] = useState(true);

  const handleOpenReschedule = (apt: Appointment) => {
    setRescheduleModalApt(apt);
    const d = new Date(apt.date);
    d.setDate(d.getDate() + 2);
    setNewDate(d.toISOString().split('T')[0]);
    setNewSlot('11:00');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt || !newDate || !newSlot) return;
    rescheduleAppointment(rescheduleModalApt.id, newDate, newSlot);
    setRescheduleModalApt(null);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt) return;
    cancelAppointment(cancelModalApt.id, cancelReason);
    setCancelModalApt(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Customer profile & preferences updated.', 'success');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner & Customer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#0F6CBD] dark:text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {activeCustomer?.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your bookings, review session history, and update reminder alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch Customer Persona */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <span className="text-slate-400">Account:</span>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id} className="dark:bg-slate-800">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveView('book')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Overview, My Appointments, Settings */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'overview'
              ? 'border-[#0F6CBD] text-[#0F6CBD] dark:text-[#38bdf8]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('appointments')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'appointments'
              ? 'border-[#0F6CBD] text-[#0F6CBD] dark:text-[#38bdf8]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Appointments ({customerAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'settings'
              ? 'border-[#0F6CBD] text-[#0F6CBD] dark:text-[#38bdf8]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile & Notifications</span>
        </button>
      </div>

      {/* SUB-VIEW 1: OVERVIEW (5.6) */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Upcoming Sessions
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {upcomingAppointments.length}
              </div>
              <div className="mt-1 text-[11px] text-[#22A06B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All confirmed with reminders</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Completed Visits
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {activeCustomer?.totalBookings}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total lifetime spend: ${activeCustomer?.lifetimeSpend}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Attendance Reliability
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-[#0F6CBD] dark:text-[#38bdf8]">
                {activeCustomer?.noShowCount === 0 ? '100% Punctual' : `${activeCustomer?.noShowCount} Missed`}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Zero penalty rescheduling active
              </span>
            </div>
          </div>

          {/* Next Appointment Highlighted Card (5.6) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Next Scheduled Appointment
            </h2>

            {nextAppointment ? (
              (() => {
                const srv = services.find(s => s.id === nextAppointment.serviceId);
                const prov = providers.find(p => p.id === nextAppointment.providerId);
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-[#0F6CBD]/30 dark:border-[#0F6CBD]/40 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={prov?.avatar}
                          alt={prov?.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                            <span className="font-mono text-[#0F6CBD] dark:text-[#38bdf8] font-bold">
                              {nextAppointment.bookingRef}
                            </span>
                            <span>·</span>
                            <span className="capitalize">{srv?.category}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {srv?.title}
                          </h3>
                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Specialist: <strong>{prov?.name}</strong> ({prov?.title})
                          </div>
                        </div>
                      </div>

                      <span className="px-3 py-1 text-xs font-bold text-[#22A06B] bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-200 dark:border-emerald-800 self-start">
                        Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs text-slate-700 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span>Date: <strong className="font-mono">{nextAppointment.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Time: <strong className="font-mono">{nextAppointment.startTime} – {nextAppointment.endTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Suite 800, 450 Montgomery St</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setCancelModalApt(nextAppointment)}
                        className="px-4 py-2 text-xs font-semibold text-[#D64545] hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        Cancel Appointment
                      </button>
                      <button
                        onClick={() => handleOpenReschedule(nextAppointment)}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reschedule Time Slot</span>
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2">
                <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  You have no upcoming appointments
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ready to schedule your next visit? Explore our catalog and pick an open slot in seconds.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveView('book')}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors"
                  >
                    Book Appointment Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Recent Activity List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('book')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">+ Schedule New Appointment</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveSubTab('appointments')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">View Full History & Receipts</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveSubTab('settings')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">Configure SMS / Email Reminders</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Account Activity
              </h3>
              <div className="space-y-3 text-xs">
                {customerAppointments.slice(0, 3).map(a => (
                  <div key={a.id} className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {services.find(s => s.id === a.serviceId)?.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {a.date} · {a.startTime}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold capitalize text-slate-600 dark:text-slate-300">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY APPOINTMENTS (5.7) */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-6">
          {/* Sub-filter tabs: Upcoming, Past, Cancelled */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setAppointmentFilterTab('upcoming')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                appointmentFilterTab === 'upcoming'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setAppointmentFilterTab('past')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                appointmentFilterTab === 'past'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Past Completed ({pastAppointments.length})
            </button>
            <button
              onClick={() => setAppointmentFilterTab('cancelled')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                appointmentFilterTab === 'cancelled'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Cancelled ({cancelledAppointments.length})
            </button>
          </div>

          {/* List of cards */}
          {(() => {
            const list = appointmentFilterTab === 'upcoming' 
              ? upcomingAppointments 
              : appointmentFilterTab === 'past' 
              ? pastAppointments 
              : cancelledAppointments;

            if (list.length === 0) {
              return (
                <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                  No appointments found under this filter tab.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {list.map(apt => {
                  const srv = services.find(s => s.id === apt.serviceId);
                  const prov = providers.find(p => p.id === apt.providerId);
                  return (
                    <div
                      key={apt.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#0F6CBD] dark:text-[#38bdf8]">
                              {apt.bookingRef}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                              {srv?.title}
                            </h3>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            apt.status === 'confirmed'
                              ? 'text-[#22A06B] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200'
                              : apt.status === 'completed'
                              ? 'text-[#0F6CBD] bg-blue-50 dark:bg-blue-950/40 border border-blue-200'
                              : 'text-[#D64545] bg-rose-50 dark:bg-rose-950/40 border border-rose-200'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-3 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-600">
                          <img
                            src={prov?.avatar}
                            alt={prov?.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-xs">
                            <div className="font-bold text-slate-900 dark:text-white">{prov?.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{prov?.title}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mt-3">
                          <div className="flex items-center gap-1.5 font-mono">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.startTime}–{apt.endTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          ${apt.price}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailModalApt(apt)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                          >
                            Details
                          </button>
                          {apt.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => setCancelModalApt(apt)}
                                className="px-2.5 py-1.5 text-xs font-semibold text-[#D64545] hover:bg-rose-50 rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleOpenReschedule(apt)}
                                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* SUB-VIEW 3: PROFILE AND SETTINGS (5.8) */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Personal Information & Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your credentials and default contact details for appointment sync.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Timezone
                </label>
                <select
                  value={profileTimezone}
                  onChange={e => setProfileTimezone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                >
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>
            </div>

            {/* Notification Reminders Preferences (5.8) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Automated Notification Alerts
              </h4>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminder24hEmail}
                    onChange={e => setReminder24hEmail(e.target.checked)}
                    className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>Send 24-Hour Advance Email Reminder with Preparation Notes</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminder2hSms}
                    onChange={e => setReminder2hSms(e.target.checked)}
                    className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>Send 2-Hour Advance SMS Reminder with 1-Tap Attendance Confirmation</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminder1hAlert}
                    onChange={e => setReminder1hAlert(e.target.checked)}
                    className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>Send 1-Hour Final Traffic & Arrival Alert</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 p-6 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Danger Zone</span>
            </h4>
            <p className="text-xs text-rose-600 dark:text-rose-300">
              Permanently delete your customer profile and remove stored booking history. Active sessions will be cancelled.
            </p>
            <button
              type="button"
              onClick={() => showToast('Account deletion simulated: Data retention protected for demo.', 'info')}
              className="px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-200 bg-white dark:bg-rose-900/40 border border-rose-300 dark:border-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </form>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reschedule Time Slot
              </h3>
              <button onClick={() => setRescheduleModalApt(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Pick a new date and open slot for <strong>{services.find(s => s.id === rescheduleModalApt.serviceId)?.title}</strong>.
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30', '11:00', '13:30', '14:45', '16:00', '17:15'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewSlot(slot)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded-lg border ${
                        newSlot === slot
                          ? 'bg-[#0F6CBD] text-white border-[#0F6CBD]'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-3 py-1.5 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg shadow-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cancel Appointment ({cancelModalApt.bookingRef})
              </h3>
              <button onClick={() => setCancelModalApt(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <div>
                <strong>Policy Warning:</strong> Rescheduling is 100% free anytime. Cancellations within 24 hours of your start time may incur a cancellation fee.
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="Schedule conflict">Schedule conflict</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Booking error">Accidental duplicate booking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="px-3 py-1.5 font-medium text-slate-500"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#D64545] hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Cancel Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT DETAIL MODAL */}
      {detailModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#0F6CBD]">{detailModalApt.bookingRef}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Appointment Details
                </h3>
              </div>
              <button onClick={() => setDetailModalApt(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  {services.find(s => s.id === detailModalApt.serviceId)?.title}
                </div>
                <div className="text-slate-500">
                  Specialist: {providers.find(p => p.id === detailModalApt.providerId)?.name}
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-300">
                  {detailModalApt.date} · {detailModalApt.startTime} – {detailModalApt.endTime}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold capitalize text-slate-900 dark:text-white">{detailModalApt.status}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Location:</span>
                <span className="text-slate-700 dark:text-slate-300">Suite 800, 450 Montgomery St, San Francisco, CA</span>
              </div>

              {detailModalApt.notes && (
                <div>
                  <span className="text-slate-400 block">Client Notes:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{detailModalApt.notes}"</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setDetailModalApt(null)}
                className="px-4 py-2 font-bold text-xs text-white bg-[#0F6CBD] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
