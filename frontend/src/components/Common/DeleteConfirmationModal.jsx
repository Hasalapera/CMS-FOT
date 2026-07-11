import React from 'react';
import { AlertTriangle, Loader2, Undo2 } from 'lucide-react';

const VARIANTS = {
  danger: {
    Icon: AlertTriangle,
    iconClass: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
    buttonClass: 'bg-[var(--color-danger)] text-white hover:bg-red-700',
  },
  success: {
    Icon: Undo2,
    iconClass: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    buttonClass: 'bg-[var(--color-success)] text-white hover:bg-green-700',
  },
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  title,
  message,
  confirmText = 'Confirm',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const {
    Icon,
    iconClass,
    buttonClass,
  } = VARIANTS[variant] || VARIANTS.danger;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-bold shadow-sm color-transition disabled:opacity-60 ${buttonClass}`}
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;