import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { SITE_MAP_HIERARCHY } from '../data/mockData';
import { UserRole } from '../types';
import { 
  Network, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const SiteMapView: React.FC = () => {
  const { setActiveView, setRole, role } = useBooking();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRole>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'sm-guest-portal': true,
    'sm-customer-dashboard': true,
    'sm-provider-portal': true,
    'sm-admin-calendar': true,
    'sm-admin-services': true,
    'sm-admin-staff': true,
    'sm-admin-crm': true,
    'sm-admin-reports': true,
    'sm-admin-settings': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredNodes = SITE_MAP_HIERARCHY.filter(node => {
    if (selectedRoleFilter === 'all') return true;
    return node.roles.includes(selectedRoleFilter);
  });

  const handleNavigateToNode = (path: string, primaryRole: UserRole) => {
    setRole(primaryRole);
    if (path === '/book') setActiveView('book');
    else if (path === '/customer-portal') setActiveView('customer-portal');
    else if (path === '/provider-portal') setActiveView('provider-portal');
    else if (path === '/admin/calendar') setActiveView('admin-calendar');
    else if (path === '/admin/services') setActiveView('admin-services');
    else if (path === '/admin/staff') setActiveView('admin-staff');
    else if (path === '/admin/customers') setActiveView('admin-customers');
    else if (path === '/admin/reports') setActiveView('admin-reports');
    else if (path === '/admin/settings') setActiveView('admin-settings');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Introduction */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <Network className="w-4 h-4" />
              <span>Architectural Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Site Map & System Hierarchy
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Structured architectural overview mapping customer touchpoints, practitioner schedules, and administrative operations across all 4 user roles.
            </p>
          </div>

          {/* Role Filter Segmented Control */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium px-2">Filter Role:</span>
            {(['all', 'guest', 'customer', 'staff', 'admin'] as const).map(r => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                  selectedRoleFilter === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Access Matrix Summary Card */}
      <div className="mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Role Permissions & Access Matrix</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">User Role</th>
                <th className="py-2.5 px-3 font-semibold">Primary Goal</th>
                <th className="py-2.5 px-3 font-semibold">Accessible Views</th>
                <th className="py-2.5 px-3 font-semibold">Core Mechanisms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900">Guest</td>
                <td className="py-2.5 px-3">Browse services & book in under 60 seconds</td>
                <td className="py-2.5 px-3 font-mono">/book (Steps 1–4)</td>
                <td className="py-2.5 px-3">Catalog filtering, slot selector, instant booking ID</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900">Customer</td>
                <td className="py-2.5 px-3">Self-service appointment control & reminders</td>
                <td className="py-2.5 px-3 font-mono">/customer-portal, /book</td>
                <td className="py-2.5 px-3">1-click reschedule, policy cancellations, SMS opt-in</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900">Staff / Provider</td>
                <td className="py-2.5 px-3">Track daily agenda & fulfill appointments</td>
                <td className="py-2.5 px-3 font-mono">/provider-portal</td>
                <td className="py-2.5 px-3">Mark complete/no-show, set daily hours & lunch breaks</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900">Admin / Owner</td>
                <td className="py-2.5 px-3">Manage full operations, staff, CRM, reports</td>
                <td className="py-2.5 px-3 font-mono">/admin/* (Calendar, Catalog, Staff, CRM, Analytics, Settings)</td>
                <td className="py-2.5 px-3">Master dispatch, service buffer rules, reminder templates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Hierarchy Tree */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Structured Application Hierarchy ({filteredNodes.length} Core Nodes)
          </h2>
          <span className="text-xs text-slate-500">
            Click "Jump to View" to switch roles and test each module live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {filteredNodes.map((node, index) => {
            const isExpanded = expandedNodes[node.id] ?? true;
            return (
              <div 
                key={node.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all shadow-xs"
              >
                {/* Node Header Bar */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start sm:items-center gap-3">
                    <button 
                      onClick={() => toggleNode(node.id)}
                      className="mt-0.5 sm:mt-0 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {node.path}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {node.category}
                        </span>
                        <span className="text-slate-300">·</span>
                        <div className="flex items-center gap-1">
                          {node.roles.map(r => (
                            <span 
                              key={r} 
                              className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 bg-slate-200/70 px-1.5 py-0.2 rounded"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 mt-1">
                        {node.title}
                      </h3>
                    </div>
                  </div>

                  {/* Direct Launch Action */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleNavigateToNode(node.path, node.roles[0])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors"
                    >
                      <span>Jump to View</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  </div>
                </div>

                {/* Node Body & Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5">
                    <p className="text-sm text-slate-600 mb-4">
                      {node.description}
                    </p>

                    {/* Key Features & Functional Mechanisms */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Core Functional Capabilities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {node.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub-hierarchy / Nested steps */}
                    {node.subnodes && node.subnodes.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Nested Views & Procedural Steps:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {node.subnodes.map((sub, sIndex) => (
                            <div 
                              key={sIndex}
                              className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs"
                            >
                              <div className="font-semibold text-slate-900 mb-0.5">
                                {sub.title}
                              </div>
                              <div className="text-slate-600 leading-relaxed">
                                {sub.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
