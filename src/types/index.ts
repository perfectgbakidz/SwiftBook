export type UserRole = 'guest' | 'customer' | 'staff' | 'admin';

export type IndustryCategory = 'all' | 'clinic' | 'salon' | 'consulting' | 'tutoring';

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  serviceTitle: string;
}

export interface TimeOffBlock {
  id: string;
  providerId: string;
  title: string;
  date: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
}

export interface WorkingDay {
  isWorking: boolean;
  start: string; // "09:00"
  end: string;   // "17:00"
  breakStart?: string; // "13:00"
  breakEnd?: string;   // "14:00"
}

export interface Provider {
  id: string;
  name: string;
  title: string;
  category: IndustryCategory;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  rating: number;
  reviewCount: number;
  bufferMinutes: number;
  servicesOffered: string[]; // service IDs
  workingHours: Record<DayOfWeek, WorkingDay>;
}

export interface Service {
  id: string;
  title: string;
  category: IndustryCategory;
  description: string;
  durationMinutes: number;
  price: number;
  bufferAfterMinutes: number;
  providerIds: string[];
  popular?: boolean;
  preparationNote?: string;
}

export interface Appointment {
  id: string;
  bookingRef: string; // e.g. "CNV-9241"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  providerId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "10:00"
  endTime: string;   // "10:45"
  status: AppointmentStatus;
  reminders: {
    email24h: boolean;
    sms2h: boolean;
    emailSent: boolean;
    smsSent: boolean;
  };
  notes?: string;
  price: number;
  createdAt: string;
  cancellationReason?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings: number;
  lifetimeSpend: number;
  noShowCount: number;
  notes?: string;
}

export interface ReminderNotification {
  id: string;
  appointmentId: string;
  recipient: string;
  type: 'email_24h' | 'sms_2h' | 'confirmation' | 'rescheduled';
  sentAt: string;
  status: 'delivered' | 'pending';
  channel: 'SMS' | 'Email';
  previewText: string;
}

export interface BusinessSettings {
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  minAdvanceBookingHours: number; // e.g., 2 hours
  maxAdvanceBookingDays: number;  // e.g., 60 days
  cancellationWindowHours: number; // e.g., 24 hours
  automatedReminders: {
    send24hEmail: boolean;
    send2hSms: boolean;
    customSmsTemplate: string;
    customEmailTemplate: string;
  };
}

export interface SiteMapNode {
  id: string;
  title: string;
  path: string;
  roles: UserRole[];
  category: 'Customer Booking Experience' | 'Staff & Provider Flow' | 'Business Administration' | 'System & Automation';
  description: string;
  features: string[];
  subnodes?: {
    title: string;
    description: string;
  }[];
}
