import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Service, 
  Provider, 
  Appointment, 
  Customer, 
  BusinessSettings, 
  ReminderNotification,
  AppointmentStatus,
  DayOfWeek,
  WorkingDay
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_PROVIDERS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface BookingContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  serviceDetailId: string | null;
  setServiceDetailId: (id: string | null) => void;
  selectedBookingServiceId: string | null;
  setSelectedBookingServiceId: (id: string | null) => void;
  selectedBookingProviderId: string | null;
  setSelectedBookingProviderId: (id: string | null) => void;
  services: Service[];
  providers: Provider[];
  appointments: Appointment[];
  customers: Customer[];
  settings: BusinessSettings;
  notifications: ReminderNotification[];
  timeOffBlocks: any[];
  addTimeOffBlock: (block: any) => void;
  removeTimeOffBlock: (id: string) => void;
  selectedStaffId: string;
  setSelectedStaffId: (id: string) => void;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Actions
  bookAppointment: (data: {
    serviceId: string;
    providerId: string;
    date: string;
    startTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
    reminderEmail: boolean;
    reminderSms: boolean;
    status?: AppointmentStatus;
  }) => Appointment;
  rescheduleAppointment: (appointmentId: string, newDate: string, newStartTime: string) => boolean;
  cancelAppointment: (appointmentId: string, reason?: string) => boolean;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  saveService: (service: Service) => void;
  deleteService: (id: string) => void;
  updateProviderWorkingHours: (providerId: string, day: DayOfWeek, workingDay: WorkingDay) => void;
  saveSettings: (settings: BusinessSettings) => void;
  triggerManualReminder: (appointmentId: string, channel: 'SMS' | 'Email') => void;
  resetDemoData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');
  const [activeView, setActiveView] = useState<string>('home'); // Default to home landing page (5.1)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('calenova_dark') === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [serviceDetailId, setServiceDetailId] = useState<string | null>(null);
  const [selectedBookingServiceId, setSelectedBookingServiceId] = useState<string | null>(null);
  const [selectedBookingProviderId, setSelectedBookingProviderId] = useState<string | null>(null);

  const [timeOffBlocks, setTimeOffBlocks] = useState<any[]>(() => {
    const saved = localStorage.getItem('calenova_timeoff');
    return saved ? JSON.parse(saved) : [
      { id: 'to-1', providerId: 'prov-1', title: 'Medical Conference', date: '2026-10-14', allDay: true },
      { id: 'to-2', providerId: 'prov-2', title: 'Studio Maintenance', date: '2026-10-15', allDay: false, startTime: '14:00', endTime: '17:00' }
    ];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('calenova_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem('calenova_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('calenova_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('calenova_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('calenova_settings');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
  });

  const [notifications, setNotifications] = useState<ReminderNotification[]>(() => {
    const saved = localStorage.getItem('calenova_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>('prov-1');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('calenova_dark', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addTimeOffBlock = (block: any) => {
    setTimeOffBlocks(prev => [...prev, { ...block, id: `to-${Date.now()}` }]);
    showToast('Time-off block created.', 'success');
  };

  const removeTimeOffBlock = (id: string) => {
    setTimeOffBlocks(prev => prev.filter(b => b.id !== id));
    showToast('Time-off block removed.', 'info');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('calenova_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('calenova_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('calenova_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('calenova_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('calenova_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('calenova_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper to calculate end time from start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, mins] = startTime.split(':').map(Number);
    const totalMins = hours * 60 + mins + durationMinutes;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const bookAppointment = (data: {
    serviceId: string;
    providerId: string;
    date: string;
    startTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
    reminderEmail: boolean;
    reminderSms: boolean;
  }): Appointment => {
    const service = services.find(s => s.id === data.serviceId);
    const duration = service ? service.durationMinutes : 45;
    const price = service ? service.price : 100;
    const endTime = calculateEndTime(data.startTime, duration);
    const newRef = `CNV-${Math.floor(1000 + Math.random() * 9000)}`;

    // Match or create customer
    let existingCust = customers.find(c => c.email.toLowerCase() === data.customerEmail.toLowerCase());
    let customerId = existingCust ? existingCust.id : `cust-${Date.now()}`;

    if (existingCust) {
      setCustomers(prev => prev.map(c => 
        c.id === existingCust!.id 
          ? { ...c, totalBookings: c.totalBookings + 1, lifetimeSpend: c.lifetimeSpend + price }
          : c
      ));
    } else {
      const newCustomer: Customer = {
        id: customerId,
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        totalBookings: 1,
        lifetimeSpend: price,
        noShowCount: 0,
        notes: data.notes || 'First booking via online guest portal.'
      };
      setCustomers(prev => [...prev, newCustomer]);
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingRef: newRef,
      customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      serviceId: data.serviceId,
      providerId: data.providerId,
      date: data.date,
      startTime: data.startTime,
      endTime,
      status: 'confirmed',
      reminders: {
        email24h: data.reminderEmail,
        sms2h: data.reminderSms,
        emailSent: data.reminderEmail,
        smsSent: data.reminderSms
      },
      notes: data.notes,
      price,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Create confirmation notifications
    if (data.reminderEmail) {
      const emailNotif: ReminderNotification = {
        id: `notif-${Date.now()}-em`,
        appointmentId: newAppointment.id,
        recipient: data.customerEmail,
        type: 'confirmation',
        sentAt: 'Just now',
        status: 'delivered',
        channel: 'Email',
        previewText: `Confirmed: ${service?.title} with ${providers.find(p => p.id === data.providerId)?.name} on ${data.date} at ${data.startTime}. Ref: ${newRef}`
      };
      setNotifications(prev => [emailNotif, ...prev]);
    }

    if (data.reminderSms) {
      const smsNotif: ReminderNotification = {
        id: `notif-${Date.now()}-sms`,
        appointmentId: newAppointment.id,
        recipient: data.customerPhone,
        type: 'confirmation',
        sentAt: 'Just now',
        status: 'delivered',
        channel: 'SMS',
        previewText: `Calenova: Appointment confirmed with ${providers.find(p => p.id === data.providerId)?.name} on ${data.date} at ${data.startTime}. Ref: ${newRef}`
      };
      setNotifications(prev => [smsNotif, ...prev]);
    }

    showToast(`Appointment confirmed! Booking Ref: ${newRef}`, 'success');
    return newAppointment;
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newStartTime: string): boolean => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return false;

    const service = services.find(s => s.id === apt.serviceId);
    const duration = service ? service.durationMinutes : 45;
    const newEndTime = calculateEndTime(newStartTime, duration);

    setAppointments(prev => prev.map(a => 
      a.id === appointmentId 
        ? { ...a, date: newDate, startTime: newStartTime, endTime: newEndTime, status: 'confirmed' }
        : a
    ));

    // Add notification
    const reschedNotif: ReminderNotification = {
      id: `notif-${Date.now()}-resched`,
      appointmentId,
      recipient: apt.customerPhone || apt.customerEmail,
      type: 'rescheduled',
      sentAt: 'Just now',
      status: 'delivered',
      channel: 'SMS',
      previewText: `Calenova Update: Your appointment (${apt.bookingRef}) was rescheduled to ${newDate} at ${newStartTime}.`
    };
    setNotifications(prev => [reschedNotif, ...prev]);

    showToast(`Appointment ${apt.bookingRef} successfully rescheduled to ${newDate} at ${newStartTime}!`, 'success');
    return true;
  };

  const cancelAppointment = (appointmentId: string, reason?: string): boolean => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return false;

    setAppointments(prev => prev.map(a => 
      a.id === appointmentId 
        ? { ...a, status: 'cancelled', cancellationReason: reason || 'Cancelled by client' }
        : a
    ));

    showToast(`Appointment ${apt.bookingRef} has been cancelled.`, 'info');
    return true;
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        if (status === 'no_show') {
          // increment customer's no show count
          setCustomers(cList => cList.map(c => 
            c.id === a.customerId ? { ...c, noShowCount: c.noShowCount + 1 } : c
          ));
        }
        return { ...a, status };
      }
      return a;
    }));
    showToast(`Status updated to: ${status.replace('_', ' ')}`, 'success');
  };

  const saveService = (updatedService: Service) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === updatedService.id);
      if (exists) {
        return prev.map(s => s.id === updatedService.id ? updatedService : s);
      }
      return [...prev, updatedService];
    });
    showToast(`Service "${updatedService.title}" saved.`, 'success');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Service removed from catalog.', 'info');
  };

  const updateProviderWorkingHours = (providerId: string, day: DayOfWeek, workingDay: WorkingDay) => {
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          workingHours: {
            ...p.workingHours,
            [day]: workingDay
          }
        };
      }
      return p;
    }));
    showToast(`Updated schedule for ${day}`, 'success');
  };

  const saveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    showToast('Business settings and reminder rules updated.', 'success');
  };

  const triggerManualReminder = (appointmentId: string, channel: 'SMS' | 'Email') => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    const notif: ReminderNotification = {
      id: `notif-${Date.now()}`,
      appointmentId,
      recipient: channel === 'SMS' ? apt.customerPhone : apt.customerEmail,
      type: channel === 'SMS' ? 'sms_2h' : 'email_24h',
      sentAt: 'Just now',
      status: 'delivered',
      channel,
      previewText: `Manual Dispatch (${channel}): Reminder for appointment ${apt.bookingRef} on ${apt.date} at ${apt.startTime}.`
    };

    setNotifications(prev => [notif, ...prev]);
    showToast(`Manual ${channel} reminder dispatched to ${apt.customerName}!`, 'success');
  };

  const resetDemoData = () => {
    setServices(INITIAL_SERVICES);
    setProviders(INITIAL_PROVIDERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_BUSINESS_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    showToast('Platform reset to initial demo state.', 'info');
  };

  return (
    <BookingContext.Provider
      value={{
        role,
        setRole,
        activeView,
        setActiveView,
        darkMode,
        toggleDarkMode,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        serviceDetailId,
        setServiceDetailId,
        selectedBookingServiceId,
        setSelectedBookingServiceId,
        selectedBookingProviderId,
        setSelectedBookingProviderId,
        timeOffBlocks,
        addTimeOffBlock,
        removeTimeOffBlock,
        services,
        providers,
        appointments,
        customers,
        settings,
        notifications,
        selectedStaffId,
        setSelectedStaffId,
        selectedCustomerId,
        setSelectedCustomerId,
        toast,
        showToast,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        saveService,
        deleteService,
        updateProviderWorkingHours,
        saveSettings,
        triggerManualReminder,
        resetDemoData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
