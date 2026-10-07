import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Service, Provider, IndustryCategory } from '../types';
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Download,
  AlertCircle,
  Timer,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const BookingFunnel: React.FC = () => {
  const { 
    services, 
    providers, 
    appointments, 
    bookAppointment, 
    setActiveView, 
    setRole, 
    triggerManualReminder,
    selectedBookingServiceId,
    setSelectedBookingServiceId,
    selectedBookingProviderId,
    setSelectedBookingProviderId
  } = useBooking();

  // 5 Step flow: 1=Service, 2=Provider, 3=Date&Time, 4=Details, 5=Review, 6=Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Selections
  const [categoryFilter, setCategoryFilter] = useState<IndustryCategory>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(selectedBookingServiceId || '');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(selectedBookingProviderId || 'any');
  
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Step 4 contact details
  const [customerName, setCustomerName] = useState<string>('Sarah Jenkins');
  const [customerEmail, setCustomerEmail] = useState<string>('sarah.jenkins@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+1 (555) 781-3094');
  const [notes, setNotes] = useState<string>('');
  const [createAccount, setCreateAccount] = useState<boolean>(true);
  const [reminderEmail, setReminderEmail] = useState<boolean>(true);
  const [reminderSms, setReminderSms] = useState<boolean>(true);

  // Step 5 terms checkbox
  const [termsAgreed, setTermsAgreed] = useState<boolean>(true);

  // Mobile summary open toggle
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState<boolean>(false);

  // Completed booking reference
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Sync external pre-selections
  useEffect(() => {
    if (selectedBookingServiceId) {
      setSelectedServiceId(selectedBookingServiceId);
      setSelectedBookingServiceId(null);
    }
    if (selectedBookingProviderId) {
      setSelectedProviderId(selectedBookingProviderId);
      setSelectedBookingProviderId(null);
    }
  }, [selectedBookingServiceId, selectedBookingProviderId]);

  // Stopwatch timer
  useEffect(() => {
    let interval: any = null;
    if (timerActive && currentStep < 6) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, currentStep]);

  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  const filteredServices = useMemo(() => {
    if (categoryFilter === 'all') return services;
    return services.filter(s => s.category === categoryFilter);
  }, [services, categoryFilter]);

  const eligibleProviders = useMemo(() => {
    if (!selectedService) return providers;
    return providers.filter(p => selectedService.providerIds.includes(p.id));
  }, [providers, selectedService]);

  const effectiveProvider = useMemo(() => {
    if (selectedProviderId !== 'any') {
      return providers.find(p => p.id === selectedProviderId);
    }
    return eligibleProviders[0] || providers[0];
  }, [selectedProviderId, eligibleProviders, providers]);

  // Generate available time slots
  const availableSlots = useMemo(() => {
    if (!selectedDate || !effectiveProvider || !selectedService) return [];

    const dateObj = new Date(selectedDate + 'T12:00:00');
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayOfWeek = dayNames[dateObj.getDay()];

    const schedule = effectiveProvider.workingHours[dayOfWeek];
    if (!schedule || !schedule.isWorking) {
      return [];
    }

    const [startH, startM] = schedule.start.split(':').map(Number);
    const [endH, endM] = schedule.end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    let breakStartMins = -1;
    let breakEndMins = -1;
    if (schedule.breakStart && schedule.breakEnd) {
      const [bsh, bsm] = schedule.breakStart.split(':').map(Number);
      const [beh, bem] = schedule.breakEnd.split(':').map(Number);
      breakStartMins = bsh * 60 + bsm;
      breakEndMins = beh * 60 + bem;
    }

    const bookedForProvider = appointments.filter(a => 
      a.providerId === effectiveProvider.id && 
      a.date === selectedDate && 
      a.status !== 'cancelled'
    );

    const slots: { time: string; period: 'morning' | 'afternoon' | 'evening'; available: boolean }[] = [];
    const duration = selectedService.durationMinutes;

    for (let current = startMins; current + duration <= endMins; current += 30) {
      const slotEnd = current + duration;
      const overlapsBreak = (current < breakEndMins && slotEnd > breakStartMins);

      const currentH = Math.floor(current / 60);
      const currentM = current % 60;
      const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;

      const overlapsBooking = bookedForProvider.some(apt => {
        const [aStartH, aStartM] = apt.startTime.split(':').map(Number);
        const [aEndH, aEndM] = apt.endTime.split(':').map(Number);
        const aStart = aStartH * 60 + aStartM;
        const aEnd = aEndH * 60 + aEndM;
        return (current < aEnd && slotEnd > aStart);
      });

      const period = currentH < 12 ? 'morning' : currentH < 17 ? 'afternoon' : 'evening';

      if (!overlapsBreak && !overlapsBooking) {
        slots.push({ time: timeStr, period, available: true });
      }
    }

    return slots;
  }, [selectedDate, effectiveProvider, selectedService, appointments]);

  const handleConfirmFinalBooking = () => {
    if (!selectedService || !effectiveProvider || !selectedTimeSlot) return;

    setTimerActive(false);

    const newBooking = bookAppointment({
      serviceId: selectedService.id,
      providerId: effectiveProvider.id,
      date: selectedDate,
      startTime: selectedTimeSlot,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      reminderEmail,
      reminderSms
    });

    setConfirmedBooking(newBooking);
    setCurrentStep(6);
  };

  const handleDownloadICS = () => {
    if (!confirmedBooking || !selectedService || !effectiveProvider) return;
    const [h, m] = confirmedBooking.startTime.split(':').map(Number);
    const dateFormatted = confirmedBooking.date.replace(/-/g, '');
    const startTimeFormatted = `${dateFormatted}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Calenova//Appointment Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${selectedService.title} with ${effectiveProvider.name}`,
      `DESCRIPTION:Booking Reference: ${confirmedBooking.bookingRef}\\nService: ${selectedService.title}\\nSpecialist: ${effectiveProvider.name}`,
      `LOCATION:Calenova Suites, 450 Montgomery St, SF`,
      `DTSTART:${startTimeFormatted}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calenova-${confirmedBooking.bookingRef}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Funnel Header with Progress Stepper */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#0F6CBD] dark:text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Step Express Booking Flow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentStep === 1 && '1. Select Your Service'}
              {currentStep === 2 && '2. Choose Specialist'}
              {currentStep === 3 && '3. Pick Date & Time'}
              {currentStep === 4 && '4. Your Details'}
              {currentStep === 5 && '5. Review & Confirm'}
              {currentStep === 6 && 'Appointment Confirmed!'}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-[#0F6CBD]/10 dark:bg-[#0F6CBD]/20 border border-[#0F6CBD]/20 px-3 py-1.5 rounded-lg text-xs self-start sm:self-auto font-mono">
            <Timer className="w-4 h-4 text-[#0F6CBD] animate-pulse" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              Elapsed: <strong className="font-bold text-[#0F6CBD]">{elapsedSeconds}s</strong> / Goal: &lt; 60s
            </span>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        {currentStep <= 5 && (
          <div className="mt-5 grid grid-cols-5 gap-2 text-xs font-semibold">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Provider' },
              { num: 3, label: 'Date/Time' },
              { num: 4, label: 'Details' },
              { num: 5, label: 'Confirm' }
            ].map(step => (
              <div 
                key={step.num}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                  currentStep === step.num 
                    ? 'border-[#0F6CBD] text-[#0F6CBD] dark:text-[#38bdf8]' 
                    : currentStep > step.num 
                    ? 'border-[#22A06B] text-[#22A06B]' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  currentStep === step.num 
                    ? 'bg-[#0F6CBD] text-white' 
                    : currentStep > step.num 
                    ? 'bg-[#22A06B] text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="hidden sm:inline truncate">{step.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Steps on Left, Sticky Live Summary Panel on Right */}
      {currentStep <= 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE STEP CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: SERVICE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-5">
                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(['all', 'clinic', 'salon', 'consulting', 'tutoring'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all capitalize ${
                        categoryFilter === cat
                          ? 'bg-[#0F6CBD] text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'all' ? 'All Services' : cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredServices.map(service => {
                    const isSelected = selectedServiceId === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0F6CBD] bg-[#0F6CBD]/5 ring-2 ring-[#0F6CBD]/20 dark:bg-[#0F6CBD]/10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span className="capitalize">{service.category}</span>
                            <span className="font-mono">{service.durationMinutes} min</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
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
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-[#0F6CBD] text-white' : 'border border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={!selectedServiceId}
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Choose Provider</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROVIDER SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Any Available Specialist */}
                  <div
                    onClick={() => setSelectedProviderId('any')}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      selectedProviderId === 'any'
                        ? 'border-[#0F6CBD] bg-[#0F6CBD]/5 ring-2 ring-[#0F6CBD]/20 dark:bg-[#0F6CBD]/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] flex items-center justify-center font-bold shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Any Available Specialist
                        </h3>
                        {selectedProviderId === 'any' && <Check className="w-4 h-4 text-[#0F6CBD]" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Fastest option. Automatically assigns the first available verified practitioner.
                      </p>
                    </div>
                  </div>

                  {/* Dedicated Providers */}
                  {eligibleProviders.map(prov => {
                    const isSelected = selectedProviderId === prov.id;
                    return (
                      <div
                        key={prov.id}
                        onClick={() => setSelectedProviderId(prov.id)}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-[#0F6CBD] bg-[#0F6CBD]/5 ring-2 ring-[#0F6CBD]/20 dark:bg-[#0F6CBD]/10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={prov.avatar}
                          alt={prov.name}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {prov.name}
                            </h3>
                            {isSelected && <Check className="w-4 h-4 text-[#0F6CBD]" />}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{prov.title}</div>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{prov.rating}</span>
                            <span className="text-slate-400 font-normal">({prov.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Date & Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DATE & TIME SELECTOR */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left: Date Picker */}
                  <div className="md:col-span-5 space-y-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => {
                        setSelectedDate(e.target.value);
                        setSelectedTimeSlot('');
                      }}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />

                    {/* Quick Next Days */}
                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] text-slate-400 block">Upcoming Quick Days:</span>
                      {[0, 1, 2, 3].map(offset => {
                        const d = new Date();
                        d.setDate(d.getDate() + offset);
                        const iso = d.toISOString().split('T')[0];
                        const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                          <button
                            key={offset}
                            type="button"
                            onClick={() => {
                              setSelectedDate(iso);
                              setSelectedTimeSlot('');
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                              selectedDate === iso
                                ? 'bg-[#0F6CBD] text-white font-bold'
                                : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <span>{label}</span>
                            <span className="font-mono text-[11px] opacity-75">{iso}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Time Slots Grid */}
                  <div className="md:col-span-7 space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Open Time Slots
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Timezone: Pacific Time (US & Canada, GMT-7)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#0F6CBD]">
                        {availableSlots.length} available
                      </span>
                    </div>

                    {availableSlots.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No available slots for this date. Please select another date.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(['morning', 'afternoon', 'evening'] as const).map(period => {
                          const periodSlots = availableSlots.filter(s => s.period === period);
                          if (periodSlots.length === 0) return null;
                          return (
                            <div key={period}>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 capitalize">
                                {period}
                              </span>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {periodSlots.map(slot => (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    onClick={() => setSelectedTimeSlot(slot.time)}
                                    className={`py-2 px-2 text-xs font-mono font-semibold rounded-lg border transition-all ${
                                      selectedTimeSlot === slot.time
                                        ? 'bg-[#0F6CBD] text-white border-[#0F6CBD] shadow-xs'
                                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-[#0F6CBD]'
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!selectedTimeSlot}
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Your Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: YOUR DETAILS */}
            {currentStep === 4 && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address * (For Confirmation & 24h Reminder)
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Phone * (For 2h SMS Attendance Confirmation)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Intake Notes / Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Any preparation details or questions for your provider..."
                      className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>
                </div>

                {/* Optional Account Creation */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={e => setCreateAccount(e.target.checked)}
                      className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                    />
                    <span>Save information to Customer Portal for 1-click future bookings</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!customerName || !customerEmail || !customerPhone}
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Review & Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {currentStep === 5 && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Final Review & Agreement
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Please review your appointment summary before final confirmation.
                  </p>
                </div>

                {/* Review Matrix */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="text-slate-400 block">Service</span>
                    <strong className="text-slate-900 dark:text-white">{selectedService?.title}</strong>
                    <div className="text-slate-500 mt-0.5">{selectedService?.durationMinutes} min session</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="text-slate-400 block">Specialist</span>
                    <strong className="text-slate-900 dark:text-white">{effectiveProvider?.name}</strong>
                    <div className="text-slate-500 mt-0.5">{effectiveProvider?.title}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="text-slate-400 block">Date & Time</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{selectedDate}</strong>
                    <div className="text-slate-500 font-mono mt-0.5">{selectedTimeSlot} (PST)</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="text-slate-400 block">Client Contact</span>
                    <strong className="text-slate-900 dark:text-white">{customerName}</strong>
                    <div className="text-slate-500 font-mono mt-0.5">{customerPhone}</div>
                  </div>
                </div>

                {/* Cancellation Policy Warning */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                  <div>
                    <strong>Cancellation & Rescheduling Policy:</strong> You may cancel or reschedule at no charge up to 24 hours prior to your scheduled time via the Customer Portal. Late cancellations may incur a standard fee.
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={e => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>
                    I confirm my appointment details and agree to Calenova's Booking Terms and Automated Notification Reminders.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  >
                    ← Back to Details
                  </button>
                  <button
                    disabled={!termsAgreed}
                    onClick={handleConfirmFinalBooking}
                    className="px-8 py-3 text-sm font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: LIVE BOOKING SUMMARY PANEL (Sticky Desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Booking Summary
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Real-time Sync
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Selected Service:</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedService ? selectedService.title : <span className="text-slate-400 font-normal italic">None selected yet</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Specialist:</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {effectiveProvider ? effectiveProvider.name : 'Any Available Specialist'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Time:</span>
                  <div className="font-mono font-medium text-slate-900 dark:text-white mt-0.5">
                    {selectedDate} {selectedTimeSlot ? `at ${selectedTimeSlot}` : '(Slot pending)'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Location:</span>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Suite 800, 450 Montgomery St, SF
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Due:</span>
                <span className="font-mono text-xl font-bold text-[#0F6CBD] dark:text-[#38bdf8]">
                  ${selectedService ? selectedService.price : 0}
                </span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* STEP 6: SUCCESS SCREEN */
        confirmedBooking && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Animated Checkmark Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-[#22A06B] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
                Appointment Successfully Booked!
              </h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Completed in {elapsedSeconds} seconds. A confirmation email and calendar invitation have been dispatched to <strong>{confirmedBooking.customerEmail}</strong>.
              </p>
              <div className="inline-block font-mono font-bold text-sm bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 px-4 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-xs">
                Reference Code: {confirmedBooking.bookingRef}
              </div>
            </div>

            {/* Appointment Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={effectiveProvider?.avatar}
                    alt={effectiveProvider?.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedService?.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      With {effectiveProvider?.name} ({effectiveProvider?.title})
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-slate-900 dark:text-white">
                  ${confirmedBooking.price}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Date</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmedBooking.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Time</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmedBooking.startTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedService?.durationMinutes} min</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="text-[#22A06B] font-bold">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Add to Calendar & Simulate Reminders */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Next Actions & Calendar Sync
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleDownloadICS}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download iCal (.ics)</span>
                </button>

                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedService?.title || 'Appointment')}&dates=${confirmedBooking.date.replace(/-/g, '')}T${confirmedBooking.startTime.replace(':', '')}00Z/${confirmedBooking.date.replace(/-/g, '')}T${confirmedBooking.endTime.replace(':', '')}00Z&details=${encodeURIComponent('Calenova Ref: ' + confirmedBooking.bookingRef)}&location=${encodeURIComponent('450 Montgomery St, SF')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  onClick={() => triggerManualReminder(confirmedBooking.id, 'SMS')}
                  className="px-4 py-2 text-xs font-semibold text-[#0F6CBD] bg-[#0F6CBD]/10 hover:bg-[#0F6CBD]/20 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Test 2h SMS Reminder Alert</span>
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedServiceId('');
                  setSelectedTimeSlot('');
                  setElapsedSeconds(0);
                  setTimerActive(true);
                }}
                className="text-xs font-semibold text-[#0F6CBD] hover:underline"
              >
                ← Book Another Appointment
              </button>

              <button
                onClick={() => {
                  setRole('customer');
                  setActiveView('customer-portal');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-sm"
              >
                View in Customer Portal
              </button>
            </div>
          </div>
        )
      )}

    </div>
  );
};
