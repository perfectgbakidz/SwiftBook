import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { AppointmentStatus } from '../../types';

export interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const configs = {
    pending: {
      label: 'Pending Approval',
      icon: <Clock className="w-3 h-3 text-[#F5A623]" />,
      style: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    },
    confirmed: {
      label: 'Confirmed',
      icon: <CheckCircle2 className="w-3 h-3 text-[#22A06B]" />,
      style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    },
    in_progress: {
      label: 'In Progress',
      icon: <Clock className="w-3 h-3 text-[#0F6CBD]" />,
      style: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 className="w-3 h-3 text-[#0F6CBD]" />,
      style: 'bg-blue-50 dark:bg-blue-950/40 text-[#0F6CBD] dark:text-[#38bdf8] border-blue-200 dark:border-blue-800',
    },
    cancelled: {
      label: 'Cancelled',
      icon: <XCircle className="w-3 h-3 text-[#D64545]" />,
      style: 'bg-rose-50 dark:bg-rose-950/40 text-[#D64545] dark:text-rose-200 border-rose-200 dark:border-rose-800',
    },
    no_show: {
      label: 'No-Show',
      icon: <AlertTriangle className="w-3 h-3 text-slate-500" />,
      style: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600',
    },
  };

  const current = configs[status] || configs.confirmed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${current.style}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  online,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-base',
  };

  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border border-slate-200 dark:border-slate-700`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] font-bold flex items-center justify-center border border-[#0F6CBD]/20`}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22A06B] border-2 border-white dark:border-slate-800 rounded-full" />
      )}
    </div>
  );
};

export interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              rating >= star
                ? 'fill-amber-400 text-amber-400'
                : rating >= star - 0.5
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] ml-0.5">
        {rating.toFixed(2)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-slate-400 text-[11px]">({reviewCount})</span>
      )}
    </div>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  description,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
        {title}
      </span>
      <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
        {value}
      </div>
      {change && (
        <div
          className={`flex items-center gap-1 text-[11px] font-semibold ${
            isPositive ? 'text-[#22A06B]' : 'text-[#D64545]'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      )}
      {description && <p className="text-[11px] text-slate-400">{description}</p>}
    </div>
  );
};

export interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void; active?: boolean }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          {item.active ? (
            <span aria-current="page" className="font-bold text-slate-900 dark:text-white">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
