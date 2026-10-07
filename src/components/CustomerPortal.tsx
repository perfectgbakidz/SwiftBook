import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Appointment } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Phone, 
  Mail, 
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { 
    appointments, 
    services, 
    providers, 
    customers, 
    selectedCustomerId, 
    setSelectedCustomerId,
    rescheduleAppointment, 
    cancelAppointment, 
    setActiveView 
  } = useBooking();

  // Active client
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Appointments for this customer
  const customerAppointments = appointments.filter(a => 
    a.customerId === activeCustomer?.id || 
    a.customerEmail.toLowerCase() === activeCustomer?.email.toLowerCase()
  );

  const upcomingAppointments = customerAppointments.filter(a => a.status === 'confirmed');
  const pastAppointments = customerAppointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  // Reschedule Modal State
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<string>('11:00');

  // Cancel Modal State
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');

  const handleOpenReschedule = (apt: Appointment) => {
    setRescheduleModalApt(apt);
    // Suggest 2 days in future
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Customer Self-Service Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {activeCustomer?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your scheduled sessions, update reminder preferences, and reschedule with zero phone queues.
          </p>
        </div>

        {/* Switch Persona / Customer dropdown (for testing multiple clients) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Account:</span>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveView('book')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>
      </div>

      {/* Customer Quick Stats / Accountability Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Upcoming Sessions</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {upcomingAppointments.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>SMS/Email reminders active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Completed Visits</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {activeCustomer?.totalBookings}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Lifetime investment: ${activeCustomer?.lifetimeSpend}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Attendance Standing</span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-600">
            {activeCustomer?.noShowCount === 0 ? '100% Punctual' : `${activeCustomer?.noShowCount} missed`}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Zero-penalty rescheduling available &gt;24h
          </div>
        </div>
      </div>

      {/* UPCOMING APPOINTMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Active & Upcoming Appointments</span>
          </h2>
          <span className="text-xs text-slate-500">
            {upcomingAppointments.length} scheduled
          </span>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">
              No active upcoming appointments
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You currently have no scheduled appointments. Ready to plan your next visit?
            </p>
            <button
              onClick={() => setActiveView('book')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>Book in under 60 seconds</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map(apt => {
              const service = services.find(s => s.id === apt.serviceId);
              const provider = providers.find(p => p.id === apt.providerId);
              return (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Zero pill metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                        <span className="font-mono text-indigo-600 font-semibold">{apt.bookingRef}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{service?.category || 'Service'}</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {service?.title || 'Appointment Session'}
                      </h3>
                    </div>

                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  {/* Provider Details */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <img
                      src={provider?.avatar}
                      alt={provider?.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900">{provider?.name}</div>
                      <div className="text-slate-500">{provider?.title}</div>
                    </div>
                  </div>

                  {/* Date, Time & Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium text-slate-900">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium text-slate-900">{apt.startTime} – {apt.endTime}</span>
                    </div>
                  </div>

                  {/* Reminder Indicators */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className={apt.reminders.sms2h ? 'text-indigo-600 font-medium' : 'text-slate-400'}>
                        ✓ 2h SMS Alert
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={apt.reminders.email24h ? 'text-indigo-600 font-medium' : 'text-slate-400'}>
                        ✓ 24h Email Alert
                      </span>
                    </div>

                    <span className="font-mono font-bold text-slate-900">${apt.price}</span>
                  </div>

                  {/* Self-service Actions: Reschedule & Cancel */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setCancelModalApt(apt)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                    <button
                      onClick={() => handleOpenReschedule(apt)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule Slot</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAST & CANCELLED APPOINTMENTS */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          Booking History & Invoices
        </h2>

        {pastAppointments.length === 0 ? (
          <p className="text-xs text-slate-500">No past appointments recorded.</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Reference</th>
                  <th className="py-2.5 px-4 font-semibold">Service</th>
                  <th className="py-2.5 px-4 font-semibold">Specialist</th>
                  <th className="py-2.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {pastAppointments.map(apt => {
                  const srv = services.find(s => s.id === apt.serviceId);
                  const prov = providers.find(p => p.id === apt.providerId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {apt.bookingRef}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        {srv?.title || 'Service'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {prov?.name}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {apt.date} · {apt.startTime}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          apt.status === 'completed' 
                            ? 'text-emerald-700 bg-emerald-50' 
                            : 'text-slate-600 bg-slate-100'
                        }`}>
                          {apt.status}
                        </span>
                        {apt.cancellationReason && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Reason: {apt.cancellationReason}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-medium text-slate-900">
                        ${apt.price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reschedule Appointment
              </h3>
              <button 
                onClick={() => setRescheduleModalApt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select a new date and open time slot for <strong>{services.find(s => s.id === rescheduleModalApt.serviceId)?.title}</strong>. Your original time will be freed immediately.
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose New Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30', '11:00', '13:30', '14:45', '16:00', '17:15'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewSlot(slot)}
                      className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                        newSlot === slot
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Zero reschedule fee applied. Instant confirmation sent via SMS.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs"
                >
                  Confirm New Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Cancel Appointment ({cancelModalApt.bookingRef})
              </h3>
              <button 
                onClick={() => setCancelModalApt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cancellation Policy:</strong> Cancellations made &gt;24 hours in advance incur zero fee. Need a different time? Rescheduling is always free.
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="Schedule conflict">Schedule conflict</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Service no longer required">Service no longer required</option>
                  <option value="Booking error">Accidental duplicate booking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
