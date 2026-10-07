import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { DayOfWeek, AppointmentStatus } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  User, 
  Star, 
  Phone, 
  Mail, 
  Settings2, 
  Check, 
  Coffee,
  CalendarCheck2
} from 'lucide-react';

export const ProviderPortal: React.FC = () => {
  const { 
    providers, 
    selectedStaffId, 
    setSelectedStaffId, 
    appointments, 
    services, 
    updateAppointmentStatus, 
    updateProviderWorkingHours 
  } = useBooking();

  const activeProvider = providers.find(p => p.id === selectedStaffId) || providers[0];
  const [activeTab, setActiveTab] = useState<'schedule' | 'availability'>('schedule');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('2026-10-07'); // Default to today

  // Filter provider's appointments
  const providerAppointments = appointments.filter(a => a.providerId === activeProvider.id);
  const dayAppointments = providerAppointments
    .filter(a => a.date === selectedDayFilter)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedTodayCount = dayAppointments.filter(a => a.status === 'completed').length;
  const noShowCount = providerAppointments.filter(a => a.status === 'no_show').length;

  const handleWorkingHourChange = (
    day: DayOfWeek, 
    field: 'isWorking' | 'start' | 'end' | 'breakStart' | 'breakEnd', 
    val: any
  ) => {
    const current = activeProvider.workingHours[day];
    const updated = { ...current, [field]: val };
    updateProviderWorkingHours(activeProvider.id, day, updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Provider Header & Persona Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <img
            src={activeProvider.avatar}
            alt={activeProvider.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-0.5">
              <span>Practitioner Workspace</span>
              <span className="text-slate-300">·</span>
              <span className="capitalize">{activeProvider.category}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeProvider.name}
            </h1>
            <p className="text-xs text-slate-600">
              {activeProvider.title}
            </p>
          </div>
        </div>

        {/* Switch Practitioner */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <span className="text-slate-400">Switch Staff:</span>
            <select
              value={selectedStaffId}
              onChange={e => setSelectedStaffId(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.title.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Agenda
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'availability'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shift Hours & Breaks
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Appointments Today</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {dayAppointments.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {completedTodayCount} completed
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Client Satisfaction</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-600 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>{activeProvider.rating}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Across {activeProvider.reviewCount} reviews
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Cleanup Buffer</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-600">
            {activeProvider.bufferMinutes}m
          </div>
          <span className="text-[11px] text-slate-500">
            Auto-padded between sessions
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Missed No-Shows</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-rose-600">
            {noShowCount}
          </div>
          <span className="text-[11px] text-slate-500">
            Low 1.8% rate with SMS alerts
          </span>
        </div>
      </div>

      {/* TAB 1: SCHEDULE VIEW */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Date Selector Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Agenda Date:</span>
              <input
                type="date"
                value={selectedDayFilter}
                onChange={e => setSelectedDayFilter(e.target.value)}
                className="text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDayFilter('2026-10-07')}
                className={`px-3 py-1 text-xs font-medium rounded-md border ${
                  selectedDayFilter === '2026-10-07'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Today (Oct 7)
              </button>
              <button
                onClick={() => setSelectedDayFilter('2026-10-08')}
                className={`px-3 py-1 text-xs font-medium rounded-md border ${
                  selectedDayFilter === '2026-10-08'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tomorrow (Oct 8)
              </button>
            </div>
          </div>

          {/* Timeline / Appointment Cards */}
          {dayAppointments.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
              <CalendarCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">
                No sessions booked on {selectedDayFilter}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active appointments scheduled. You can check upcoming days or review your shift availability settings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map(apt => {
                const service = services.find(s => s.id === apt.serviceId);
                return (
                  <div
                    key={apt.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    {/* Time & Client details */}
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 rounded-lg p-3 text-center min-w-[70px] shrink-0 border border-slate-200">
                        <span className="block text-xs font-mono font-bold text-slate-900">
                          {apt.startTime}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-500">
                          to {apt.endTime}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-0.5">
                          <span className="font-mono text-indigo-600 font-semibold">{apt.bookingRef}</span>
                          <span aria-hidden="true">·</span>
                          <span>{service?.durationMinutes} min</span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {service?.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1 font-medium text-slate-900">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.customerPhone}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 italic">
                            "{apt.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Provider Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-end md:self-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold capitalize self-start sm:self-auto ${
                        apt.status === 'confirmed' 
                          ? 'text-indigo-700 bg-indigo-50 border border-indigo-200' 
                          : apt.status === 'in_progress'
                          ? 'text-amber-800 bg-amber-50 border border-amber-200'
                          : apt.status === 'completed'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : apt.status === 'no_show'
                          ? 'text-rose-700 bg-rose-50 border border-rose-200'
                          : 'text-slate-600 bg-slate-100'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>

                      {/* Action triggers */}
                      <div className="flex items-center gap-1.5">
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Play className="w-3 h-3 text-amber-600" />
                            <span>Start</span>
                          </button>
                        )}

                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Complete</span>
                          </button>
                        )}

                        {apt.status !== 'completed' && apt.status !== 'no_show' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'no_show')}
                            title="Flag client as no-show"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>No-Show</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AVAILABILITY & WORKING HOURS BUILDER */}
      {activeTab === 'availability' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span>Weekly Shift Hours & Lunch Breaks</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Configure your working shifts and break times. The booking engine automatically restricts clients from reserving slots outside of these windows.
            </p>
          </div>

          <div className="space-y-3">
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[]).map(day => {
              const schedule = activeProvider.workingHours[day];
              return (
                <div
                  key={day}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    schedule.isWorking 
                      ? 'bg-white border-slate-200' 
                      : 'bg-slate-50 border-slate-200/60 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.isWorking}
                        onChange={e => handleWorkingHourChange(day, 'isWorking', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                    <span className="text-xs font-semibold capitalize text-slate-900">
                      {day}
                    </span>
                  </div>

                  {schedule.isWorking ? (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      {/* Shift hours */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-medium">Shift:</span>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={e => handleWorkingHourChange(day, 'start', e.target.value)}
                          className="font-mono text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={e => handleWorkingHourChange(day, 'end', e.target.value)}
                          className="font-mono text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                      </div>

                      {/* Lunch Break */}
                      <div className="flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-medium">Break:</span>
                        <input
                          type="time"
                          value={schedule.breakStart || '12:30'}
                          onChange={e => handleWorkingHourChange(day, 'breakStart', e.target.value)}
                          className="font-mono text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={schedule.breakEnd || '13:30'}
                          onChange={e => handleWorkingHourChange(day, 'breakEnd', e.target.value)}
                          className="font-mono text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">
                      Scheduled Off / Unavailable for Booking
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
