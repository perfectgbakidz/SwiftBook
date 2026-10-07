import { 
  Provider, 
  Service, 
  Appointment, 
  Customer, 
  BusinessSettings, 
  SiteMapNode, 
  ReminderNotification 
} from '../types';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: 'Calenova Multi-Practice & Studio Suites',
  industry: 'Multi-Disciplinary Booking Hub (Clinics, Salons, Advisory, Tutoring)',
  email: 'concierge@calenova-suites.com',
  phone: '+1 (555) 382-9000',
  address: '450 Montgomery St, Suite 800, San Francisco, CA',
  timezone: 'America/Los_Angeles (PST)',
  minAdvanceBookingHours: 2,
  maxAdvanceBookingDays: 45,
  cancellationWindowHours: 24,
  automatedReminders: {
    send24hEmail: true,
    send2hSms: true,
    customSmsTemplate: 'Calenova Reminder: Your appointment with {provider} is scheduled for {time} on {date}. Reply YES to confirm or tap {reschedule_link} to reschedule.',
    customEmailTemplate: 'Hi {customer_name}, this is a friendly reminder for your upcoming session for {service_name} with {provider}. Please arrive 5 minutes early. Manage or reschedule anytime before {cancellation_deadline}.'
  }
};

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Dr. Elena Rostova',
    title: 'Lead Dermatologist & Aesthetic Physician',
    category: 'clinic',
    email: 'dr.elena@calenova-suites.com',
    phone: '+1 (555) 492-1001',
    avatar: '/src/assets/images/provider_avatar_elena_1791368757434.jpg',
    bio: 'Board-certified clinical specialist with 12+ years in medical dermatology, preventive skin health, and non-invasive corrective therapies.',
    rating: 4.96,
    reviewCount: 142,
    bufferMinutes: 15,
    servicesOffered: ['srv-clinic-1', 'srv-clinic-2', 'srv-clinic-3'],
    workingHours: {
      monday: { isWorking: true, start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30' },
      tuesday: { isWorking: true, start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30' },
      wednesday: { isWorking: true, start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30' },
      thursday: { isWorking: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      friday: { isWorking: true, start: '09:00', end: '16:00', breakStart: '12:30', breakEnd: '13:30' },
      saturday: { isWorking: false, start: '10:00', end: '15:00' },
      sunday: { isWorking: false, start: '10:00', end: '14:00' }
    }
  },
  {
    id: 'prov-2',
    name: 'Marcus Vance',
    title: 'Master Stylist & Creative Director',
    category: 'salon',
    email: 'marcus@calenova-suites.com',
    phone: '+1 (555) 492-1002',
    avatar: '/src/assets/images/provider_avatar_marcus_1791368780892.jpg',
    bio: 'Editorial session stylist specializing in sculptural scissor work, restorative treatments, and signature textured finishes.',
    rating: 4.92,
    reviewCount: 218,
    bufferMinutes: 10,
    servicesOffered: ['srv-salon-1', 'srv-salon-2', 'srv-salon-3'],
    workingHours: {
      monday: { isWorking: false, start: '10:00', end: '18:00' },
      tuesday: { isWorking: true, start: '10:00', end: '19:00', breakStart: '14:00', breakEnd: '15:00' },
      wednesday: { isWorking: true, start: '10:00', end: '19:00', breakStart: '14:00', breakEnd: '15:00' },
      thursday: { isWorking: true, start: '10:00', end: '20:00', breakStart: '14:00', breakEnd: '15:00' },
      friday: { isWorking: true, start: '10:00', end: '20:00', breakStart: '14:00', breakEnd: '15:00' },
      saturday: { isWorking: true, start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      sunday: { isWorking: false, start: '10:00', end: '16:00' }
    }
  },
  {
    id: 'prov-3',
    name: 'Sophia Chen',
    title: 'Principal Business Strategy Advisor',
    category: 'consulting',
    email: 'sophia.chen@calenova-suites.com',
    phone: '+1 (555) 492-1003',
    avatar: '/src/assets/images/provider_avatar_sophia_1791368795098.jpg',
    bio: 'Former Tier-1 management consultant guiding Series A–C founders and enterprise leads on go-to-market scaling, pricing architecture, and operational turnaround.',
    rating: 4.98,
    reviewCount: 95,
    bufferMinutes: 15,
    servicesOffered: ['srv-consult-1', 'srv-consult-2'],
    workingHours: {
      monday: { isWorking: true, start: '08:30', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      tuesday: { isWorking: true, start: '08:30', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      wednesday: { isWorking: true, start: '08:30', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      thursday: { isWorking: true, start: '08:30', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      friday: { isWorking: true, start: '08:30', end: '15:00', breakStart: '12:00', breakEnd: '13:00' },
      saturday: { isWorking: false, start: '09:00', end: '13:00' },
      sunday: { isWorking: false, start: '09:00', end: '13:00' }
    }
  },
  {
    id: 'prov-4',
    name: 'David Miller',
    title: 'Senior STEM & Mathematics Instructor',
    category: 'tutoring',
    email: 'david.miller@calenova-suites.com',
    phone: '+1 (555) 492-1004',
    avatar: '/src/assets/images/provider_avatar_david_1791368822191.jpg',
    bio: 'Stanford graduate and competitive contest coach with 9 years preparing students for AP Calculus BC, Linear Algebra, and high-stakes collegiate assessments.',
    rating: 4.94,
    reviewCount: 168,
    bufferMinutes: 10,
    servicesOffered: ['srv-tutor-1', 'srv-tutor-2'],
    workingHours: {
      monday: { isWorking: true, start: '13:00', end: '20:30', breakStart: '16:30', breakEnd: '17:00' },
      tuesday: { isWorking: true, start: '13:00', end: '20:30', breakStart: '16:30', breakEnd: '17:00' },
      wednesday: { isWorking: true, start: '13:00', end: '20:30', breakStart: '16:30', breakEnd: '17:00' },
      thursday: { isWorking: true, start: '13:00', end: '20:30', breakStart: '16:30', breakEnd: '17:00' },
      friday: { isWorking: true, start: '13:00', end: '19:00', breakStart: '16:00', breakEnd: '16:30' },
      saturday: { isWorking: true, start: '10:00', end: '16:00', breakStart: '12:30', breakEnd: '13:00' },
      sunday: { isWorking: false, start: '10:00', end: '15:00' }
    }
  }
];

export const INITIAL_SERVICES: Service[] = [
  // Clinic
  {
    id: 'srv-clinic-1',
    title: 'Comprehensive Dermatological Assessment',
    category: 'clinic',
    description: 'Full-body dermoscopic skin exam, diagnostic mapping of irregular lesions, and personalized prescription care plan.',
    durationMinutes: 45,
    price: 185,
    bufferAfterMinutes: 15,
    providerIds: ['prov-1'],
    popular: true,
    preparationNote: 'Please avoid heavy facial makeup and arrive 5 minutes before scheduled intake.'
  },
  {
    id: 'srv-clinic-2',
    title: 'Medical Acne & Skin Barrier Restoration',
    category: 'clinic',
    description: 'Targeted clinical extraction, gentle ultrasonic pore cleansing, and medical-grade barrier peptide infusion.',
    durationMinutes: 60,
    price: 210,
    bufferAfterMinutes: 15,
    providerIds: ['prov-1'],
    preparationNote: 'Discontinue active retinol/tretinoin use 48 hours prior to treatment.'
  },
  {
    id: 'srv-clinic-3',
    title: 'Express Spot Check & Follow-Up Consultation',
    category: 'clinic',
    description: 'Focused review of specific skin concerns, lab result interpretations, or prescription adjustments.',
    durationMinutes: 20,
    price: 95,
    bufferAfterMinutes: 10,
    providerIds: ['prov-1'],
    preparationNote: 'Have relevant previous lab records or prescription history available.'
  },

  // Salon
  {
    id: 'srv-salon-1',
    title: 'Bespoke Scissor Haircut & Blow-Dry',
    category: 'salon',
    description: 'Precision scissor cut customized to bone structure and hair growth patterns, followed by scalp massage and luxury blowout.',
    durationMinutes: 60,
    price: 120,
    bufferAfterMinutes: 10,
    providerIds: ['prov-2'],
    popular: true,
    preparationNote: 'No special prep needed. Feel free to bring inspiration photos or references.'
  },
  {
    id: 'srv-salon-2',
    title: 'Organic Botanical Scalp Therapy & Conditioning',
    category: 'salon',
    description: 'Deep exfoliating botanical scalp peel, steam mist infusion, and intensive bond-repair mask.',
    durationMinutes: 45,
    price: 95,
    bufferAfterMinutes: 10,
    providerIds: ['prov-2'],
    preparationNote: 'Recommended as an add-on or standalone treatment for compromised scalp health.'
  },
  {
    id: 'srv-salon-3',
    title: 'Executive Beard Sculpt & Hot Towel Treatment',
    category: 'salon',
    description: 'Straight razor perimeter line work, organic beard oil conditioning, and soothing eucalyptus hot towel compress.',
    durationMinutes: 30,
    price: 65,
    bufferAfterMinutes: 5,
    providerIds: ['prov-2']
  },

  // Consulting
  {
    id: 'srv-consult-1',
    title: 'Commercial Strategy & Revenue Model Review',
    category: 'consulting',
    description: 'Deep-dive session dissecting your current unit economics, customer acquisition funnel, and scalable pricing tiers.',
    durationMinutes: 60,
    price: 320,
    bufferAfterMinutes: 15,
    providerIds: ['prov-3'],
    popular: true,
    preparationNote: 'Please share your pitch deck or high-level P&L overview 24h prior to the session.'
  },
  {
    id: 'srv-consult-2',
    title: 'Operational Diagnostic & Team Workflow Audit',
    category: 'consulting',
    description: 'Targeted audit to identify bottlenecks in executive dispatch, delivery cadence, and tooling redundancy.',
    durationMinutes: 90,
    price: 450,
    bufferAfterMinutes: 20,
    providerIds: ['prov-3']
  },

  // Tutoring
  {
    id: 'srv-tutor-1',
    title: '1-on-1 AP Calculus & Advanced Mathematics Mentoring',
    category: 'tutoring',
    description: 'Rigorous conceptual deconstruction, proof methodologies, and strategic problem-solving for differential & integral calculus.',
    durationMinutes: 60,
    price: 110,
    bufferAfterMinutes: 10,
    providerIds: ['prov-4'],
    popular: true,
    preparationNote: 'Submit current syllabus topics or practice exam problem sets in advance.'
  },
  {
    id: 'srv-tutor-2',
    title: 'SAT / ACT Math Speed & Accuracy Mastery',
    category: 'tutoring',
    description: 'Timed diagnostic sprint review, common trap identification, and mental shortcut techniques.',
    durationMinutes: 45,
    price: 85,
    bufferAfterMinutes: 10,
    providerIds: ['prov-4']
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1 (555) 781-3094',
    totalBookings: 6,
    lifetimeSpend: 890,
    noShowCount: 0,
    notes: 'Prefers quiet sessions. Sensitive to tea tree oil products.'
  },
  {
    id: 'cust-2',
    name: 'Liam Sterling',
    email: 'liam.sterling@outlook.com',
    phone: '+1 (555) 892-4112',
    totalBookings: 4,
    lifetimeSpend: 620,
    noShowCount: 0,
    notes: 'Regular Tuesday afternoon client. Extremely punctual.'
  },
  {
    id: 'cust-3',
    name: 'Amina Al-Mansoor',
    email: 'amina.m@almansoor.tech',
    phone: '+1 (555) 604-9821',
    totalBookings: 8,
    lifetimeSpend: 2480,
    noShowCount: 0,
    notes: 'Executive strategy advisory client. Prefers calendar invites with Zoom links.'
  },
  {
    id: 'cust-4',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@berkeley.edu',
    phone: '+1 (555) 319-5487',
    totalBookings: 12,
    lifetimeSpend: 1320,
    noShowCount: 1,
    notes: 'Calculus BC student. Had 1 emergency cancellation last semester.'
  },
  {
    id: 'cust-5',
    name: 'Claire Dupont',
    email: 'cdupont@designcollective.io',
    phone: '+1 (555) 442-8819',
    totalBookings: 3,
    lifetimeSpend: 360,
    noShowCount: 0,
    notes: 'Hair styling and conditioning client. Prefers afternoon slots.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Today's appointments (2026-10-07)
  {
    id: 'apt-101',
    bookingRef: 'CNV-7401',
    customerId: 'cust-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@gmail.com',
    customerPhone: '+1 (555) 781-3094',
    serviceId: 'srv-clinic-1',
    providerId: 'prov-1',
    date: '2026-10-07',
    startTime: '10:00',
    endTime: '10:45',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: true },
    notes: 'Annual routine spot check on forearm.',
    price: 185,
    createdAt: '2026-10-01T14:20:00Z'
  },
  {
    id: 'apt-102',
    bookingRef: 'CNV-7402',
    customerId: 'cust-2',
    customerName: 'Liam Sterling',
    customerEmail: 'liam.sterling@outlook.com',
    customerPhone: '+1 (555) 892-4112',
    serviceId: 'srv-salon-1',
    providerId: 'prov-2',
    date: '2026-10-07',
    startTime: '11:30',
    endTime: '12:30',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: false },
    notes: 'Textured trim and neckline taper.',
    price: 120,
    createdAt: '2026-10-03T09:15:00Z'
  },
  {
    id: 'apt-103',
    bookingRef: 'CNV-7403',
    customerId: 'cust-3',
    customerName: 'Amina Al-Mansoor',
    customerEmail: 'amina.m@almansoor.tech',
    customerPhone: '+1 (555) 604-9821',
    serviceId: 'srv-consult-1',
    providerId: 'prov-3',
    date: '2026-10-07',
    startTime: '14:00',
    endTime: '15:00',
    status: 'in_progress',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: true },
    notes: 'Q4 B2B SaaS pricing model restructure.',
    price: 320,
    createdAt: '2026-10-04T11:45:00Z'
  },
  {
    id: 'apt-104',
    bookingRef: 'CNV-7404',
    customerId: 'cust-4',
    customerName: 'Ethan Brooks',
    customerEmail: 'ethan.brooks@berkeley.edu',
    customerPhone: '+1 (555) 319-5487',
    serviceId: 'srv-tutor-1',
    providerId: 'prov-4',
    date: '2026-10-07',
    startTime: '15:30',
    endTime: '16:30',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: false },
    notes: 'Preparation for Multivariable optimization exam.',
    price: 110,
    createdAt: '2026-10-05T18:00:00Z'
  },

  // Tomorrow's appointments (2026-10-08)
  {
    id: 'apt-105',
    bookingRef: 'CNV-7405',
    customerId: 'cust-5',
    customerName: 'Claire Dupont',
    customerEmail: 'cdupont@designcollective.io',
    customerPhone: '+1 (555) 442-8819',
    serviceId: 'srv-salon-2',
    providerId: 'prov-2',
    date: '2026-10-08',
    startTime: '10:30',
    endTime: '11:15',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: false },
    notes: 'Dry scalp botanical remedy.',
    price: 95,
    createdAt: '2026-10-05T10:00:00Z'
  },
  {
    id: 'apt-106',
    bookingRef: 'CNV-7406',
    customerId: 'cust-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@gmail.com',
    customerPhone: '+1 (555) 781-3094',
    serviceId: 'srv-clinic-2',
    providerId: 'prov-1',
    date: '2026-10-08',
    startTime: '14:30',
    endTime: '15:30',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: false },
    notes: 'Follow up barrier treatment.',
    price: 210,
    createdAt: '2026-10-04T16:20:00Z'
  },

  // Future appointments (2026-10-10, 2026-10-12)
  {
    id: 'apt-107',
    bookingRef: 'CNV-7407',
    customerId: 'cust-3',
    customerName: 'Amina Al-Mansoor',
    customerEmail: 'amina.m@almansoor.tech',
    customerPhone: '+1 (555) 604-9821',
    serviceId: 'srv-consult-2',
    providerId: 'prov-3',
    date: '2026-10-12',
    startTime: '10:00',
    endTime: '11:30',
    status: 'confirmed',
    reminders: { email24h: true, sms2h: true, emailSent: false, smsSent: false },
    notes: 'Executive workflow mapping session.',
    price: 450,
    createdAt: '2026-10-06T12:00:00Z'
  },

  // Past appointments
  {
    id: 'apt-091',
    bookingRef: 'CNV-7301',
    customerId: 'cust-1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@gmail.com',
    customerPhone: '+1 (555) 781-3094',
    serviceId: 'srv-clinic-3',
    providerId: 'prov-1',
    date: '2026-09-22',
    startTime: '11:00',
    endTime: '11:20',
    status: 'completed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: true },
    notes: 'Prescription renewal completed successfully.',
    price: 95,
    createdAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'apt-092',
    bookingRef: 'CNV-7302',
    customerId: 'cust-2',
    customerName: 'Liam Sterling',
    customerEmail: 'liam.sterling@outlook.com',
    customerPhone: '+1 (555) 892-4112',
    serviceId: 'srv-salon-3',
    providerId: 'prov-2',
    date: '2026-09-25',
    startTime: '15:00',
    endTime: '15:30',
    status: 'completed',
    reminders: { email24h: true, sms2h: true, emailSent: true, smsSent: true },
    notes: 'Beard trim completed.',
    price: 65,
    createdAt: '2026-09-20T14:15:00Z'
  },
  {
    id: 'apt-093',
    bookingRef: 'CNV-7303',
    customerId: 'cust-4',
    customerName: 'Ethan Brooks',
    customerEmail: 'ethan.brooks@berkeley.edu',
    customerPhone: '+1 (555) 319-5487',
    serviceId: 'srv-tutor-2',
    providerId: 'prov-4',
    date: '2026-09-28',
    startTime: '16:00',
    endTime: '16:45',
    status: 'cancelled',
    reminders: { email24h: true, sms2h: false, emailSent: true, smsSent: false },
    notes: 'Cancelled due to college midterms.',
    cancellationReason: 'Academic conflict with midterm schedule.',
    price: 85,
    createdAt: '2026-09-22T08:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: ReminderNotification[] = [
  {
    id: 'notif-1',
    appointmentId: 'apt-101',
    recipient: 'Sarah Jenkins (+1 555-781-3094)',
    type: 'sms_2h',
    sentAt: '2026-10-07 08:00 AM',
    status: 'delivered',
    channel: 'SMS',
    previewText: 'Calenova Reminder: Dr. Elena Rostova appointment at 10:00 AM today. Confirmed.'
  },
  {
    id: 'notif-2',
    appointmentId: 'apt-101',
    recipient: 'sarah.jenkins@gmail.com',
    type: 'email_24h',
    sentAt: '2026-10-06 10:00 AM',
    status: 'delivered',
    channel: 'Email',
    previewText: 'Reminder: Comprehensive Dermatological Assessment tomorrow at 10:00 AM.'
  },
  {
    id: 'notif-3',
    appointmentId: 'apt-103',
    recipient: 'Amina Al-Mansoor (+1 555-604-9821)',
    type: 'sms_2h',
    sentAt: '2026-10-07 12:00 PM',
    status: 'delivered',
    channel: 'SMS',
    previewText: 'Calenova Reminder: Commercial Strategy review with Sophia Chen at 2:00 PM today.'
  }
];

/**
 * Requirement 2: Complete Structured Site Map Hierarchy Data
 * Represents the structured hierarchy for the booking management application
 * covering the dashboard, navigation, and core management views.
 */
export const SITE_MAP_HIERARCHY: SiteMapNode[] = [
  {
    id: 'sm-guest-portal',
    title: 'Customer & Guest Facing Experience',
    path: '/book',
    roles: ['guest', 'customer'],
    category: 'Customer Booking Experience',
    description: 'Frictionless, frictionless multi-step discovery and booking flow optimized for completion under 60 seconds.',
    features: [
      'Multi-industry service catalog filtering (Clinics, Salons, Consulting, Tutoring)',
      'Provider portfolio & verified ratings overview',
      'Instant real-time availability slot matrix',
      'Express 4-step booking funnel',
      'Automated SMS & Email reminder opt-in'
    ],
    subnodes: [
      {
        title: 'Step 1: Service Catalog & Add-ons',
        description: 'Browse categorized services with clear duration, transparent pricing, and preparation guidelines.'
      },
      {
        title: 'Step 2: Specialist / Provider Match',
        description: 'Choose any available specialist or pick a dedicated provider based on credentials and client reviews.'
      },
      {
        title: 'Step 3: Calendar & Dynamic Slot Selector',
        description: 'Select date and time slot categorized into Morning, Afternoon, and Evening with smart buffer safety.'
      },
      {
        title: 'Step 4: Contact & Instant Confirmation',
        description: 'Input contact credentials, configure notification channels, add custom intake notes, and receive booking ID.'
      }
    ]
  },
  {
    id: 'sm-customer-dashboard',
    title: 'Customer Self-Service Portal',
    path: '/customer-portal',
    roles: ['customer'],
    category: 'Customer Booking Experience',
    description: 'Empowers clients to self-manage bookings, reducing administrative support calls and no-shows.',
    features: [
      'Upcoming appointments overview with live countdown',
      'One-click self-service rescheduling engine',
      'Cancellation workflow with policy guidance',
      'Reminder preferences manager (24h Email, 2h SMS toggles)',
      'Digital receipts & past appointment records'
    ],
    subnodes: [
      {
        title: 'Active Bookings Timeline',
        description: 'View upcoming dates, provider details, service locations, and directions.'
      },
      {
        title: 'Instant Reschedule Modal',
        description: 'Pick a new time slot without cancelling the existing booking, auto-updating provider schedules.'
      },
      {
        title: 'Appointment History & Notes',
        description: 'Reference previous consultations, treatment dates, and specialist notes.'
      }
    ]
  },
  {
    id: 'sm-provider-portal',
    title: 'Staff & Provider Daily Agenda',
    path: '/provider-portal',
    roles: ['staff'],
    category: 'Staff & Provider Flow',
    description: 'Focused practitioner cockpit to view daily schedules, manage clients, and report session outcomes.',
    features: [
      'Chronological daily timeline & appointment cards',
      'One-tap status updates (In Progress, Completed, No-Show)',
      'Client intake notes and preparation history',
      'Individual working hours & emergency block times',
      'Provider personal performance and client feedback ratings'
    ],
    subnodes: [
      {
        title: 'Daily & Weekly Dispatch Timeline',
        description: 'Clear chronological view of booked slots, breaks, and buffer intervals.'
      },
      {
        title: 'Appointment Execution Controls',
        description: 'Record session completion, add clinical/service notes, or flag client no-shows.'
      },
      {
        title: 'Shift & Availability Controls',
        description: 'Adjust personal working days, shift start/end times, and lunch breaks.'
      }
    ]
  },
  {
    id: 'sm-admin-calendar',
    title: 'Operations Master Calendar & Dispatch',
    path: '/admin/calendar',
    roles: ['admin'],
    category: 'Business Administration',
    description: 'High-density multi-view business calendar for managing appointments across all staff and rooms.',
    features: [
      'Day, Week, and Month matrix views',
      'Staff filter and service category filter',
      'Color-coded appointment statuses (Confirmed, Active, Completed, Cancelled)',
      'Click to inspect appointment drawer with reschedule & refund actions',
      'Manual phone/walk-in appointment creation'
    ],
    subnodes: [
      {
        title: 'Multi-Staff Week Grid',
        description: 'Simultaneous column view of all active practitioners side-by-side.'
      },
      {
        title: 'Appointment Inspector Drawer',
        description: 'Detailed customer info, payment status, reminder logs, and one-click edit.'
      }
    ]
  },
  {
    id: 'sm-admin-services',
    title: 'Services & Pricing Catalog Management',
    path: '/admin/services',
    roles: ['admin'],
    category: 'Business Administration',
    description: 'Centralized catalog to define services, session durations, pricing, buffer times, and provider assignments.',
    features: [
      'Create, edit, and archive service offerings',
      'Configure exact duration minutes and cleanup buffer periods',
      'Assign eligible providers and assign categories',
      'Preparation instructions and intake guidance'
    ],
    subnodes: [
      {
        title: 'Service Builder & Editor',
        description: 'Adjust prices, buffers, and descriptions with immediate live booking sync.'
      },
      {
        title: 'Category Organization',
        description: 'Structure offerings into clinics, salons, advisory, and tutoring suites.'
      }
    ]
  },
  {
    id: 'sm-admin-staff',
    title: 'Staff Roster & Working Hours Matrix',
    path: '/admin/staff',
    roles: ['admin'],
    category: 'Business Administration',
    description: 'Comprehensive roster management for team members, business hours, shift breaks, and utilization.',
    features: [
      'Staff profiles, specialties, and bios',
      'Weekly shift schedule builder (start, end, lunch break per day)',
      'Buffer time customization per provider',
      'Assigned service permissions',
      'Individual provider utilization rate tracking'
    ],
    subnodes: [
      {
        title: 'Shift Roster Builder',
        description: 'Toggle working days on/off and configure granular hour windows.'
      },
      {
        title: 'Provider Qualifications & Skills',
        description: 'Bind specific services to verified team members.'
      }
    ]
  },
  {
    id: 'sm-admin-crm',
    title: 'Customer Directory & Retention CRM',
    path: '/admin/customers',
    roles: ['admin'],
    category: 'Business Administration',
    description: 'Unified customer database tracking booking frequency, lifetime value, no-show history, and VIP notes.',
    features: [
      'Searchable customer table with contact information',
      'Lifetime spend and total completed appointments',
      'No-show counter with risk flagging',
      'Internal team notes and customer preferences',
      'Direct "Book Appointment" trigger for walk-in/phone clients'
    ],
    subnodes: [
      {
        title: 'Client Profile Drawer',
        description: 'Full historical log of past visits, upcoming bookings, and private practitioner notes.'
      }
    ]
  },
  {
    id: 'sm-admin-reports',
    title: 'Analytics, Reports & No-Show Reduction',
    path: '/admin/reports',
    roles: ['admin'],
    category: 'Business Administration',
    description: 'Business intelligence dashboard highlighting revenue, booking volume, peak utilization, and no-show metrics.',
    features: [
      'Revenue metrics and average booking value',
      'No-Show reduction rate monitor (demonstrating impact of SMS/Email triggers)',
      'Peak booking hour distribution matrix',
      'Staff performance and appointment load breakdown',
      'Cancellation reason analytics'
    ],
    subnodes: [
      {
        title: 'Revenue & Volume Trends',
        description: 'Visual breakdown of monthly earnings and completed appointments.'
      },
      {
        title: 'No-Show Audit Matrix',
        description: 'Comparison of reminder delivery vs client attendance confirmation.'
      }
    ]
  },
  {
    id: 'sm-admin-settings',
    title: 'Business Policies & Automated Reminder Rules',
    path: '/admin/settings',
    roles: ['admin'],
    category: 'System & Automation',
    description: 'Global business controls, booking advance rules, and SMS/Email automated reminder configuration.',
    features: [
      'Business profile details (address, timezone, contact)',
      'Booking window constraints (min advance notice, max advance horizon)',
      'Cancellation policy threshold (e.g. 24 hours)',
      'Automated 24h Email reminder trigger & template editor',
      'Automated 2h SMS reminder trigger & template editor',
      'Live notification log inspector'
    ],
    subnodes: [
      {
        title: 'Automated Reminders Engine',
        description: 'Configure SMS & email copy with dynamic merge tags ({provider}, {time}, {date}).'
      },
      {
        title: 'Policy & Safety Rules',
        description: 'Lock slots to prevent last-minute cancellations within the safety window.'
      }
    ]
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Sarah Jenkins',
    rating: 5,
    date: '3 days ago',
    comment: 'The booking was literally done in 40 seconds. Dr. Elena was exceptionally thorough and the 2h SMS reminder prevented me from forgetting my appointment on a chaotic workday!',
    serviceTitle: 'Comprehensive Dermatological Assessment'
  },
  {
    id: 'rev-2',
    author: 'Liam Sterling',
    rating: 5,
    date: '1 week ago',
    comment: 'Marcus provides unmatched precision. Being able to reschedule directly from the customer portal without playing phone tag is pure bliss.',
    serviceTitle: 'Bespoke Scissor Haircut & Blow-Dry'
  },
  {
    id: 'rev-3',
    author: 'Amina Al-Mansoor',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Sophia restructured our SaaS pricing roadmap in a single focused session. Instant calendar invite with .ics download made sync effortless.',
    serviceTitle: 'Commercial Strategy & Revenue Model Review'
  }
];

export const INITIAL_FAQS = [
  {
    question: 'How fast can I book an appointment?',
    answer: 'With Calenova, you can complete your booking in under 60 seconds across 4 simple steps: choose your service, pick a specialist, select your time slot, and confirm your details. No mandatory passwords or phone calls needed.'
  },
  {
    question: 'How do reminders work to prevent missed appointments?',
    answer: 'You will receive an automated 24-hour advance confirmation email with location and preparation guidelines, followed by a 2-hour SMS reminder before your scheduled session. If plans change, 1-tap rescheduling is always available.'
  },
  {
    question: 'Can I reschedule or cancel without calling?',
    answer: 'Yes! Customers have full self-service control via their portal. You can reschedule to any open slot up to 24 hours prior to your appointment with zero penalty fees.'
  },
  {
    question: 'How do providers manage their working shifts and buffer times?',
    answer: 'Practitioners have their own dedicated portal to toggle working days, set custom shift start/end hours, define lunch breaks, and configure automated buffer times between sessions to prevent overlap.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Absolutely. We practice strict data privacy, zero unauthorized marketing, and secure booking credentials with immediate calendar sync (.ics, Google Calendar, Apple Calendar).'
  }
];

export const INITIAL_TIMEOFF_BLOCKS = [
  {
    id: 'to-1',
    providerId: 'prov-1',
    title: 'Dermatology Medical Conference',
    date: '2026-10-14',
    allDay: true
  },
  {
    id: 'to-2',
    providerId: 'prov-2',
    title: 'Studio Equipment Maintenance',
    date: '2026-10-15',
    allDay: false,
    startTime: '14:00',
    endTime: '17:00'
  }
];

