'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useToast } from './use-toast';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success: 'group border-green-500 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-900/20 dark:text-green-50',
        error: 'group border-red-500 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-900/20 dark:text-red-50',
        warning: 'group border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-50',
        info: 'group border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-background text-foreground border',
  success: 'bg-green-50 text-green-800 border-green-200',
  destructive: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Toast({ toast, onDismiss, className, ...props }: ToastProps) {
  const { id, title, description, variant = 'default' } = toast;
  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <div
      className={cn(
        'relative w-full max-w-sm p-4 rounded-lg shadow-lg border',
        variantClass,
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <button
          type="button"
          className="ml-4 -mx-1.5 -my-1.5 rounded-md p-1.5 opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => onDismiss(id)}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
