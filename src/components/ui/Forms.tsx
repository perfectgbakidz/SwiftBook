import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  id,
  className = '',
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full text-xs py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] dark:bg-slate-700 dark:text-white ${
            leftIcon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
              : 'border-slate-300 dark:border-slate-600 bg-white'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  id,
  className = '',
  required,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full text-xs px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] ${
          error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        required={required}
        className={`w-full text-xs p-3 border rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] ${
          error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[11px] text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  id,
  className = '',
  ...props
}) => {
  const checkboxId = id || `chk-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className="flex items-start gap-2.5">
      <input
        type="checkbox"
        id={checkboxId}
        className={`mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[#0F6CBD] focus:ring-[#0F6CBD] cursor-pointer ${className}`}
        {...props}
      />
      <div className="text-xs">
        <label htmlFor={checkboxId} className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          {label}
        </label>
        {description && <p className="text-slate-400 text-[11px] mt-0.5">{description}</p>}
      </div>
    </div>
  );
};

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="text-xs">
          {label && <div className="font-semibold text-slate-800 dark:text-slate-200">{label}</div>}
          {description && <div className="text-slate-400 text-[11px] mt-0.5">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] focus:ring-offset-2 disabled:opacity-50 ${
          checked ? 'bg-[#0F6CBD]' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export interface TimeSlotChipProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  period?: 'morning' | 'afternoon' | 'evening';
  onClick?: () => void;
}

export const TimeSlotChip: React.FC<TimeSlotChipProps> = ({
  time,
  selected = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`py-2 px-2.5 text-xs font-mono font-semibold rounded-lg border transition-all text-center select-none ${
        disabled
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
          : selected
          ? 'bg-[#0F6CBD] text-white border-[#0F6CBD] shadow-xs ring-2 ring-[#0F6CBD]/20'
          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-[#0F6CBD] hover:bg-[#0F6CBD]/5'
      }`}
    >
      {time}
    </button>
  );
};
