import React, { useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  X, 
  Loader2,
  FolderOpen
} from 'lucide-react';

export interface AlertBannerProps {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  variant = 'info',
  dismissible = false,
  onDismiss,
}) => {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    error: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200',
  };

  const icons = {
    info: <Info className="w-4 h-4 text-[#0F6CBD] shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-[#D64545] shrink-0 mt-0.5" />,
  };

  return (
    <div className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${styles[variant]}`}>
      <div className="flex items-start gap-2.5">
        {icons[variant]}
        <div>
          {title && <div className="font-bold mb-0.5">{title}</div>}
          <div className="leading-relaxed">{message}</div>
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`bg-white dark:bg-slate-800 rounded-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-150 ${maxWidthClasses[maxWidth]}`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
          <div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <div className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors shadow-xs ${
              isDanger ? 'bg-[#D64545] hover:bg-rose-700' : 'bg-[#0F6CBD] hover:bg-[#0B5394]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return <Loader2 className={`animate-spin text-[#0F6CBD] ${sizeMap[size]} ${className}`} />;
};

export const SkeletonLoader: React.FC<{ type?: 'card' | 'row' | 'avatar' | 'text' }> = ({
  type = 'card',
}) => {
  if (type === 'avatar') {
    return <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />;
  }
  if (type === 'row') {
    return (
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-full my-1.5" />
    );
  }
  if (type === 'text') {
    return <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4 my-1" />;
  }
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 animate-pulse">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
