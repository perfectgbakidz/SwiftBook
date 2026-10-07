import React, { useState } from 'react';
import { Button, IconButton } from './ui/Actions';
import { TextInput, Select, Textarea, Checkbox, Toggle, TimeSlotChip } from './ui/Forms';
import { AlertBanner, Modal, ConfirmDialog, Spinner, SkeletonLoader, EmptyState } from './ui/Feedback';
import { StatusBadge, Avatar, RatingStars, StatCard, Breadcrumbs } from './ui/Display';
import { DataTable, BarChart } from './ui/Data';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  Trash2, 
  Bell, 
  Search, 
  Mail, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  // Showcase Interactive State
  const [btnLoading, setBtnLoading] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('10:00');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'actions' | 'forms' | 'feedback' | 'display' | 'data'>('all');

  // Sample Table Data
  const sampleTableData = [
    { id: '1', ref: 'CNV-1001', client: 'Sarah Jenkins', service: 'Dermatology Assessment', date: '2026-10-07', status: 'confirmed', price: 185 },
    { id: '2', ref: 'CNV-1002', client: 'Liam Sterling', service: 'Precision Haircut', date: '2026-10-07', status: 'completed', price: 120 },
    { id: '3', ref: 'CNV-1003', client: 'Amina Al-Mansoor', service: 'Strategy Audit', date: '2026-10-08', status: 'pending', price: 320 },
    { id: '4', ref: 'CNV-1004', client: 'Ethan Brooks', service: 'Calculus Tutoring', date: '2026-10-09', status: 'cancelled', price: 110 },
    { id: '5', ref: 'CNV-1005', client: 'Claire Dupont', service: 'Scalp Conditioning', date: '2026-10-10', status: 'no_show', price: 95 },
  ];

  const chartData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 19 },
    { label: 'Thu', value: 28 },
    { label: 'Fri', value: 35 },
    { label: 'Sat', value: 22 },
    { label: 'Sun', value: 8 },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-[#0F6CBD] dark:text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Section 6 Component System</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Reusable UI Component Library
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Comprehensive, accessible (WCAG 2.1 AA compliant) design system components powering every public view, booking funnel step, customer dashboard, and admin operations panel.
        </p>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 pt-4 overflow-x-auto">
          {(['all', 'actions', 'forms', 'feedback', 'display', 'data'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCategoryTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                activeCategoryTab === tab
                  ? 'bg-[#0F6CBD] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' ? 'All Components' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ACTIONS */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'actions') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Actions: Buttons & Icon Buttons
            </h2>
            <button
              onClick={() => setBtnLoading(!btnLoading)}
              className="text-xs text-[#0F6CBD] hover:underline"
            >
              Toggle Loading State: <strong>{btnLoading ? 'ON' : 'OFF'}</strong>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Button Variants</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading={btnLoading} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Primary Button
                </Button>
                <Button variant="secondary" isLoading={btnLoading}>
                  Secondary Button
                </Button>
                <Button variant="ghost" isLoading={btnLoading}>
                  Ghost Button
                </Button>
                <Button variant="danger" isLoading={btnLoading} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                  Danger Button
                </Button>
                <Button variant="primary" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Sizes (sm, md, lg)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Icon Buttons (with aria-label)</span>
              <div className="flex items-center gap-3">
                <IconButton aria-label="Notifications" variant="primary">
                  <Bell className="w-4 h-4" />
                </IconButton>
                <IconButton aria-label="Schedule calendar" variant="secondary">
                  <Calendar className="w-4 h-4" />
                </IconButton>
                <IconButton aria-label="Delete entry" variant="danger">
                  <Trash2 className="w-4 h-4" />
                </IconButton>
                <IconButton aria-label="Search" variant="ghost">
                  <Search className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. FORMS */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'forms') && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Forms: Inputs, Selects, Toggles & Chips
          </h2>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput label="Full Name" placeholder="e.g. Sarah Jenkins" required />
              <TextInput label="Email Address" type="email" placeholder="sarah@example.com" leftIcon={<Mail className="w-4 h-4" />} />
              <TextInput label="Input With Error" defaultValue="Invalid email" error="Please enter a valid format." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Specialty Department"
                options={[
                  { value: 'clinic', label: 'Clinical Dermatology' },
                  { value: 'salon', label: 'Salon & Hair Design' },
                  { value: 'consulting', label: 'Executive Strategy' },
                ]}
              />
              <Textarea label="Special Intake Notes" placeholder="Any client sensitivities or allergies..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Checkboxes & Radios</span>
                <Checkbox
                  checked={checkboxState}
                  onChange={e => setCheckboxState(e.target.checked)}
                  label="I agree to receive automated 2h SMS reminders"
                  description="We never send marketing messages."
                />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Accessible Switch Toggle</span>
                <Toggle
                  checked={toggleState}
                  onChange={setToggleState}
                  label="24-Hour Email Confirmation"
                  description="Pre-session location guidelines"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Time Slot Chips</span>
              <div className="flex flex-wrap gap-2">
                {['09:00', '09:30', '10:00', '11:00', '14:00', '15:30'].map(time => (
                  <TimeSlotChip
                    key={time}
                    time={time}
                    selected={selectedSlot === time}
                    disabled={time === '11:00'}
                    onClick={() => setSelectedSlot(time)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEEDBACK */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'feedback') && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Feedback: Alerts, Modals, Loaders & Empty States
          </h2>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="space-y-2.5">
              <AlertBanner variant="info" title="Information" message="Automated 2h SMS reminders are enabled for all verified appointments." dismissible />
              <AlertBanner variant="success" title="Success" message="Appointment successfully confirmed with Dr. Elena Rostova." />
              <AlertBanner variant="warning" title="Notice" message="You have 1 appointment within the 24-hour cancellation window." />
              <AlertBanner variant="error" title="Action Needed" message="Payment authorization failed. Please update your card." />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={() => setModalOpen(true)}>Open Accessible Modal</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>Open Confirm Dialog</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Skeleton Loader Preview</span>
                <SkeletonLoader type="card" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Empty State Pattern</span>
                <EmptyState
                  title="No Appointments Scheduled"
                  description="You have no active upcoming sessions. Book a slot in under 60 seconds."
                  actionText="Book Appointment"
                  onAction={() => alert('Book action')}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. DISPLAY */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'display') && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Display: WCAG Status Badges, Avatars & Rating Stars
          </h2>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                Status Badges (Text + Icon, WCAG Compliant)
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status="pending" />
                <StatusBadge status="confirmed" />
                <StatusBadge status="in_progress" />
                <StatusBadge status="completed" />
                <StatusBadge status="cancelled" />
                <StatusBadge status="no_show" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Monthly Volume" value="$8,450" change="+14.2% MoM" isPositive description="Target $10,000" />
              <StatCard title="No-Show Rate" value="1.8%" change="-68% with SMS" isPositive description="Baseline 14.5%" />
              <StatCard title="Avg Booking Speed" value="34s" change="Fastest" isPositive description="Goal < 60s" />
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Avatars</span>
                <div className="flex items-center gap-2">
                  <Avatar name="Sarah Jenkins" size="sm" />
                  <Avatar name="Elena Rostova" size="md" online />
                  <Avatar name="Sophia Chen" size="lg" />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Rating Stars</span>
                <RatingStars rating={4.96} reviewCount={142} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. DATA */}
      {(activeCategoryTab === 'all' || activeCategoryTab === 'data') && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data: Sortable Table with Pagination & Analytics Charts
          </h2>

          <div className="space-y-6">
            <DataTable
              columns={[
                { key: 'ref', header: 'Ref ID', sortable: true },
                { key: 'client', header: 'Client Name', sortable: true },
                { key: 'service', header: 'Service' },
                { key: 'date', header: 'Date', sortable: true },
                {
                  key: 'status',
                  header: 'Status',
                  render: row => <StatusBadge status={row.status as any} />,
                },
                {
                  key: 'price',
                  header: 'Price',
                  align: 'right',
                  sortable: true,
                  render: row => <span className="font-mono font-bold">${row.price}</span>,
                },
              ]}
              data={sampleTableData}
              keyExtractor={row => row.id}
            />

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bookings Volume by Day (Bar Chart)
              </h3>
              <BarChart data={chartData} />
            </div>
          </div>
        </section>
      )}

      {/* Interactive Modal Instances */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Sample Accessible Dialog Modal">
        <p className="text-xs text-slate-600 dark:text-slate-300">
          This modal traps keyboard focus, closes on Escape or backdrop click, and maintains WCAG accessibility standards.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setModalOpen(false)}>Close Modal</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert('Action confirmed!');
        }}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        isDanger
        confirmText="Yes, Cancel"
      />

    </div>
  );
};
