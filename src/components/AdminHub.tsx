import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Appointment, Service, Provider, AppointmentStatus, IndustryCategory } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Layers, 
  BarChart3, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Bell,
  Download,
  CalendarCheck2,
  Lock,
  ChevronRight,
  SlidersHorizontal,
  LayoutDashboard
} from 'lucide-react';

export const AdminHub: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    appointments, 
    services, 
    providers, 
    customers, 
    settings, 
    notifications,
    timeOffBlocks,
    addTimeOffBlock,
    removeTimeOffBlock,
    saveService, 
    deleteService, 
    saveSettings,
    updateAppointmentStatus,
    triggerManualReminder,
    rescheduleAppointment,
    bookAppointment,
    showToast
  } = useBooking();

  // Active Admin Sub-tab
  const currentSubTab = activeView.startsWith('admin-') ? activeView : 'admin-dashboard';

  // Calendar State
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [calendarDate, setCalendarDate] = useState<string>('2026-10-07');
  const [calendarStaffFilter, setCalendarStaffFilter] = useState<string>('all');
  const [inspectedAppointment, setInspectedAppointment] = useState<Appointment | null>(null);

  // Time off modal state
  const [showTimeOffModal, setShowTimeOffModal] = useState<boolean>(false);
  const [timeOffProviderId, setTimeOffProviderId] = useState<string>(providers[0]?.id || '');
  const [timeOffDate, setTimeOffDate] = useState<string>('2026-10-14');
  const [timeOffTitle, setTimeOffTitle] = useState<string>('Staff Training / Leave');

  // Manual Walk-in Booking Modal State
  const [showManualBookingModal, setShowManualBookingModal] = useState<boolean>(false);
  const [manualClientName, setManualClientName] = useState<string>('');
  const [manualClientEmail, setManualClientEmail] = useState<string>('');
  const [manualClientPhone, setManualClientPhone] = useState<string>('');
  const [manualServiceId, setManualServiceId] = useState<string>(services[0]?.id || '');
  const [manualProviderId, setManualProviderId] = useState<string>(providers[0]?.id || '');
  const [manualTime, setManualTime] = useState<string>('14:00');

  // Service Edit/Add Modal
  const [serviceModal, setServiceModal] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState<boolean>(false);

  // CRM Search & Inspected Customer Drawer
  const [crmSearch, setCrmSearch] = useState<string>('');
  const [inspectedCustomer, setInspectedCustomer] = useState<any | null>(null);

  // Appointments Table Filters (5.11)
  const [aptSearch, setAptSearch] = useState<string>('');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [aptProviderFilter, setAptProviderFilter] = useState<string>('all');

  // Settings State
  const [localSettings, setLocalSettings] = useState(settings);

  // Filtered Appointments for Calendar
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchStaff = calendarStaffFilter === 'all' || a.providerId === calendarStaffFilter;
      const matchDate = calendarViewMode === 'day' ? a.date === calendarDate : true;
      return matchStaff && matchDate;
    });
  }, [appointments, calendarStaffFilter, calendarDate, calendarViewMode]);

  // Appointments for Table View (5.11)
  const tableAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = a.customerName.toLowerCase().includes(aptSearch.toLowerCase()) || 
                            a.bookingRef.toLowerCase().includes(aptSearch.toLowerCase());
      const matchesStatus = aptStatusFilter === 'all' || a.status === aptStatusFilter;
      const matchesProvider = aptProviderFilter === 'all' || a.providerId === aptProviderFilter;
      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [appointments, aptSearch, aptStatusFilter, aptProviderFilter]);

  // Analytics Metrics Calculation
  const totalRevenue = useMemo(() => {
    return appointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed' || a.status === 'in_progress')
      .reduce((sum, a) => sum + a.price, 0);
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    return appointments.filter(a => a.date === '2026-10-07');
  }, [appointments]);

  const completedCount = useMemo(() => {
    return appointments.filter(a => a.status === 'completed').length;
  }, [appointments]);

  const noShowCount = useMemo(() => {
    return appointments.filter(a => a.status === 'no_show').length;
  }, [appointments]);

  const noShowRate = useMemo(() => {
    const totalFinished = completedCount + noShowCount;
    if (totalFinished === 0) return '1.8%';
    return `${((noShowCount / totalFinished) * 100).toFixed(1)}%`;
  }, [completedCount, noShowCount]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['BookingRef,Customer,Email,Phone,Service,Specialist,Date,Time,Status,Price\n'];
    const rows = appointments.map(a => {
      const s = services.find(srv => srv.id === a.serviceId)?.title || 'Service';
      const p = providers.find(prov => prov.id === a.providerId)?.name || 'Provider';
      return `"${a.bookingRef}","${a.customerName}","${a.customerEmail}","${a.customerPhone}","${s}","${p}","${a.date}","${a.startTime}","${a.status}","$${a.price}"\n`;
    });
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calenova_Appointments_${calendarDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Appointments exported to CSV', 'success');
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceModal) return;
    saveService(serviceModal);
    setServiceModal(null);
  };

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      serviceId: manualServiceId,
      providerId: manualProviderId,
      date: calendarDate,
      startTime: manualTime,
      customerName: manualClientName,
      customerEmail: manualClientEmail,
      customerPhone: manualClientPhone,
      reminderEmail: true,
      reminderSms: true,
      notes: 'Admin manual walk-in / phone booking'
    });
    setShowManualBookingModal(false);
    setManualClientName('');
    setManualClientEmail('');
    setManualClientPhone('');
  };

  const handleSaveSettingsForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
  };

  const handleAddTimeOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimeOffBlock({
      providerId: timeOffProviderId,
      title: timeOffTitle,
      date: timeOffDate,
      allDay: true
    });
    setShowTimeOffModal(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#0F6CBD] dark:text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Operations Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Business Administration
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-provider calendars, appointment tables, services catalog, and no-show reminder automation.
          </p>
        </div>

        {/* Navigation Sub-Tabs matching 5.9-5.16 */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'admin-calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'admin-appointments', label: 'Appointments', icon: Clock },
            { id: 'admin-services', label: 'Services', icon: Layers },
            { id: 'admin-staff', label: 'Staff & Roster', icon: Users },
            { id: 'admin-customers', label: 'Customers CRM', icon: Users },
            { id: 'admin-reports', label: 'Analytics', icon: BarChart3 },
            { id: 'admin-settings', label: 'Settings', icon: SettingsIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: ADMIN DASHBOARD (5.9) */}
      {currentSubTab === 'admin-dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Today's Appointments
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {todayAppointments.length}
              </div>
              <span className="text-[11px] text-[#22A06B] mt-1 block">
                {todayAppointments.filter(a => a.status === 'confirmed').length} confirmed
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Active Bookings
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-[#0F6CBD] dark:text-[#38bdf8]">
                {appointments.filter(a => a.status === 'confirmed').length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across 4 active providers
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Monthly Revenue
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                ${totalRevenue}
              </div>
              <span className="text-[11px] text-[#22A06B] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +14.2% MoM
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Total Customers
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {customers.length}
              </div>
              <span className="text-[11px] text-[#0F6CBD] mt-1 block">
                100% verified profiles
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Cancellation Rate
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-emerald-600">
                {noShowRate}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Low 1.8% with 2h SMS alerts
              </span>
            </div>
          </div>

          {/* Today's Schedule List with Status Chips & Quick Actions (5.9) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Master Schedule (Oct 7, 2026)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct dispatch with one-click Confirm, Complete, or Cancel actions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowManualBookingModal(true)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Quick Booking</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {todayAppointments.map(apt => {
                const srv = services.find(s => s.id === apt.serviceId);
                const prov = providers.find(p => p.id === apt.providerId);
                return (
                  <div
                    key={apt.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-xl text-center font-mono min-w-[70px]">
                        <span className="block font-bold text-slate-900 dark:text-white">{apt.startTime}</span>
                        <span className="block text-[10px] text-slate-400">{apt.endTime}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-mono text-[#0F6CBD] font-bold">{apt.bookingRef}</span>
                          <span>·</span>
                          <span>{srv?.title}</span>
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                          {apt.customerName}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Specialist: <strong>{prov?.name}</strong> · {apt.customerPhone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        apt.status === 'confirmed'
                          ? 'text-[#22A06B] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200'
                          : apt.status === 'in_progress'
                          ? 'text-[#F5A623] bg-amber-50 dark:bg-amber-950/40 border border-amber-200'
                          : apt.status === 'completed'
                          ? 'text-[#0F6CBD] bg-blue-50 dark:bg-blue-950/40 border border-blue-200'
                          : 'text-[#D64545] bg-rose-50 dark:bg-rose-950/40 border border-rose-200'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>

                      {/* Quick action triggers */}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#22A06B] hover:bg-emerald-700 rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => setInspectedAppointment(apt)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ADMIN CALENDAR (5.10) */}
      {currentSubTab === 'admin-calendar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Date:</span>
                <input
                  type="date"
                  value={calendarDate}
                  onChange={e => setCalendarDate(e.target.value)}
                  className="font-mono text-xs px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Provider:</span>
                <select
                  value={calendarStaffFilter}
                  onChange={e => setCalendarStaffFilter(e.target.value)}
                  className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Providers ({providers.length})</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setCalendarDate('2026-10-07')}
                className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTimeOffModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50"
              >
                + Block Time Off
              </button>
              <button
                onClick={() => setShowManualBookingModal(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
              >
                + Walk-in Booking
              </button>
            </div>
          </div>

          {/* Time Off Blocks Display */}
          {timeOffBlocks.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#F5A623]" />
                <span>
                  <strong>Active Time Off Blocks:</strong> {timeOffBlocks.map(b => `${b.title} (${b.date})`).join(' · ')}
                </span>
              </div>
            </div>
          )}

          {/* Appointments Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Schedule Dispatch ({filteredAppointments.length} Bookings)
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22A06B]"></span> Confirmed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0F6CBD]"></span> Completed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D64545]"></span> Cancelled</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No appointments scheduled for this date & filter.
                </div>
              ) : (
                filteredAppointments.map(apt => (
                  <div
                    key={apt.id}
                    onClick={() => setInspectedAppointment(apt)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white min-w-[70px]">
                        {apt.startTime}–{apt.endTime}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{apt.customerName}</div>
                        <div className="text-slate-500">{services.find(s => s.id === apt.serviceId)?.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                        apt.status === 'confirmed' ? 'text-[#22A06B] bg-emerald-50' : 'text-slate-600 bg-slate-100'
                      }`}>
                        {apt.status}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">${apt.price}</span>
                      <span className="text-[#0F6CBD] font-semibold">Inspect →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ADMIN APPOINTMENTS TABLE (5.11) */}
      {currentSubTab === 'admin-appointments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference code or client..."
                value={aptSearch}
                onChange={e => setAptSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={aptStatusFilter}
                onChange={e => setAptStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-Show</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                {tableAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#0F6CBD]">{apt.bookingRef}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{apt.customerName}</td>
                    <td className="py-3 px-4">{services.find(s => s.id === apt.serviceId)?.title}</td>
                    <td className="py-3 px-4">{providers.find(p => p.id === apt.providerId)?.name}</td>
                    <td className="py-3 px-4 font-mono">{apt.date} · {apt.startTime}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                        apt.status === 'confirmed' ? 'text-[#22A06B] bg-emerald-50' : 'text-slate-600 bg-slate-100'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-right text-slate-900 dark:text-white">${apt.price}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectedAppointment(apt)}
                        className="text-[#0F6CBD] hover:underline font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SERVICES CATALOG (5.12) */}
      {currentSubTab === 'admin-services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Services Catalog Management
            </h2>
            <button
              onClick={() => {
                setIsNewService(true);
                setServiceModal({
                  id: `srv-${Date.now()}`,
                  title: '',
                  category: 'clinic',
                  description: '',
                  durationMinutes: 45,
                  price: 150,
                  bufferAfterMinutes: 15,
                  providerIds: [providers[0].id]
                });
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => (
              <div
                key={srv.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#0F6CBD]">{srv.category}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{srv.title}</h3>
                  </div>
                  <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">${srv.price}</span>
                </div>
                <p className="text-xs text-slate-500">{srv.description}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">{srv.durationMinutes}m (+{srv.bufferAfterMinutes}m buffer)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsNewService(false);
                        setServiceModal(srv);
                      }}
                      className="text-[#0F6CBD] font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(srv.id)}
                      className="text-[#D64545] font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: STAFF & ROSTER (5.13) */}
      {currentSubTab === 'admin-staff' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Staff Team & Availability Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {providers.map(prov => (
              <div
                key={prov.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={prov.avatar}
                    alt={prov.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{prov.name}</h3>
                    <div className="text-xs text-slate-500">{prov.title}</div>
                    <div className="text-xs text-amber-500 font-bold mt-1">★ {prov.rating} ({prov.reviewCount} reviews)</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                  <span>Buffer: <strong className="font-mono">{prov.bufferMinutes}m</strong></span>
                  <button
                    onClick={() => {
                      setActiveView('provider-portal');
                    }}
                    className="text-[#0F6CBD] font-bold hover:underline"
                  >
                    Manage Shift Hours →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: CUSTOMER CRM (5.14) */}
      {currentSubTab === 'admin-customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Directory ({customers.length} Clients)
            </h2>
            <input
              type="text"
              placeholder="Search customers..."
              value={crmSearch}
              onChange={e => setCrmSearch(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Visits</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">No-Show Flag</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                {customers
                  .filter(c => c.name.toLowerCase().includes(crmSearch.toLowerCase()))
                  .map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{cust.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{cust.email} · {cust.phone}</td>
                      <td className="py-3 px-4 font-mono">{cust.totalBookings}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${cust.lifetimeSpend}</td>
                      <td className="py-3 px-4">
                        {cust.noShowCount === 0 ? (
                          <span className="text-[#22A06B] font-bold">Punctual</span>
                        ) : (
                          <span className="text-[#D64545] font-bold">{cust.noShowCount} missed</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectedCustomer(cust)}
                          className="text-[#0F6CBD] font-bold hover:underline"
                        >
                          View CRM
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 7: ANALYTICS & REPORTS (5.15) */}
      {currentSubTab === 'admin-reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Operations Intelligence & No-Show Reduction
            </h2>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Analytics Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Platform Volume</span>
              <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">${totalRevenue}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">No-Show Reduction Rate</span>
              <div className="text-2xl font-bold font-mono mt-1 text-[#22A06B]">68% Reduced</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Average Session Fee</span>
              <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
                ${appointments.length > 0 ? Math.round(totalRevenue / appointments.length) : 0}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Booking Speed Average</span>
              <div className="text-2xl font-bold font-mono mt-1 text-[#0F6CBD]">34s</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: SETTINGS & POLICIES (5.16) */}
      {currentSubTab === 'admin-settings' && (
        <form onSubmit={handleSaveSettingsForm} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Automated Reminders & Booking Rules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  24-Hour Advance Email Reminder Template
                </label>
                <textarea
                  rows={3}
                  value={localSettings.automatedReminders.customEmailTemplate}
                  onChange={e => setLocalSettings(prev => ({
                    ...prev,
                    automatedReminders: { ...prev.automatedReminders, customEmailTemplate: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  2-Hour Advance SMS Reminder Template
                </label>
                <textarea
                  rows={3}
                  value={localSettings.automatedReminders.customSmsTemplate}
                  onChange={e => setLocalSettings(prev => ({
                    ...prev,
                    automatedReminders: { ...prev.automatedReminders, customSmsTemplate: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg shadow-xs"
              >
                Save Settings & Templates
              </button>
            </div>
          </div>
        </form>
      )}

      {/* INSPECT APPOINTMENT DRAWER */}
      {inspectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#0F6CBD]">{inspectedAppointment.bookingRef}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Appointment Details</h3>
              </div>
              <button onClick={() => setInspectedAppointment(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
                <div><strong>Client:</strong> {inspectedAppointment.customerName} ({inspectedAppointment.customerPhone})</div>
                <div><strong>Service:</strong> {services.find(s => s.id === inspectedAppointment.serviceId)?.title}</div>
                <div><strong>Specialist:</strong> {providers.find(p => p.id === inspectedAppointment.providerId)?.name}</div>
                <div className="font-mono"><strong>Time:</strong> {inspectedAppointment.date} at {inspectedAppointment.startTime}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  triggerManualReminder(inspectedAppointment.id, 'SMS');
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#0F6CBD] bg-[#0F6CBD]/10 rounded-lg"
              >
                Dispatch 2h SMS
              </button>
              {inspectedAppointment.status !== 'completed' && (
                <button
                  onClick={() => {
                    updateAppointmentStatus(inspectedAppointment.id, 'completed');
                    setInspectedAppointment(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#22A06B] rounded-lg"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TIME OFF MODAL */}
      {showTimeOffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Block Provider Time Off</h3>
              <button onClick={() => setShowTimeOffModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddTimeOffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Provider</label>
                <select
                  value={timeOffProviderId}
                  onChange={e => setTimeOffProviderId(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700"
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={timeOffDate}
                  onChange={e => setTimeOffDate(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason / Description</label>
                <input
                  type="text"
                  value={timeOffTitle}
                  onChange={e => setTimeOffTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTimeOffModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#0F6CBD] rounded-lg"
                >
                  Save Time Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK WALK-IN BOOKING MODAL */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Walk-in / Phone Booking</h3>
              <button onClick={() => setShowManualBookingModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={manualClientName}
                  onChange={e => setManualClientName(e.target.value)}
                  placeholder="Client name"
                  className="w-full p-2 border rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Client Email</label>
                  <input
                    type="email"
                    required
                    value={manualClientEmail}
                    onChange={e => setManualClientEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Client Phone</label>
                  <input
                    type="tel"
                    required
                    value={manualClientPhone}
                    onChange={e => setManualClientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Service</label>
                  <select
                    value={manualServiceId}
                    onChange={e => setManualServiceId(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Provider</label>
                  <select
                    value={manualProviderId}
                    onChange={e => setManualProviderId(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700"
                  >
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Start Time</label>
                <input
                  type="time"
                  value={manualTime}
                  onChange={e => setManualTime(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="px-3 py-1.5 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#0F6CBD] rounded-lg"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE EDIT/ADD MODAL */}
      {serviceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewService ? 'Add Service' : 'Edit Service'}
              </h3>
              <button onClick={() => setServiceModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={serviceModal.title}
                  onChange={e => setServiceModal({ ...serviceModal, title: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={serviceModal.category}
                    onChange={e => setServiceModal({ ...serviceModal, category: e.target.value as any })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700"
                  >
                    <option value="clinic">Clinic</option>
                    <option value="salon">Salon</option>
                    <option value="consulting">Consulting</option>
                    <option value="tutoring">Tutoring</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={serviceModal.price}
                    onChange={e => setServiceModal({ ...serviceModal, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={serviceModal.durationMinutes}
                    onChange={e => setServiceModal({ ...serviceModal, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Buffer After (Min)</label>
                  <input
                    type="number"
                    value={serviceModal.bufferAfterMinutes}
                    onChange={e => setServiceModal({ ...serviceModal, bufferAfterMinutes: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg dark:bg-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceModal.description}
                  onChange={e => setServiceModal({ ...serviceModal, description: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModal(null)}
                  className="px-3 py-1.5 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#0F6CBD] rounded-lg"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRM CLIENT PROFILE DRAWER */}
      {inspectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer CRM Profile</h3>
              <button onClick={() => setInspectedCustomer(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{inspectedCustomer.name}</div>
                <div className="font-mono text-slate-500">{inspectedCustomer.email} · {inspectedCustomer.phone}</div>
                <div className="text-slate-500 pt-1">
                  Total Visits: <strong>{inspectedCustomer.totalBookings}</strong> · Lifetime Spend: <strong>${inspectedCustomer.lifetimeSpend}</strong>
                </div>
              </div>

              <div>
                <span className="font-semibold block mb-1">Private Client Notes:</span>
                <p className="p-2 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 italic">
                  {inspectedCustomer.notes || 'No private notes logged for this customer.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedCustomer(null)}
                className="px-4 py-2 font-bold text-xs text-white bg-[#0F6CBD] rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
