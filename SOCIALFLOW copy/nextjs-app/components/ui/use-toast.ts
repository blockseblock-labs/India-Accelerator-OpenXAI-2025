'use client';

import * as React from 'react';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, 'id'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

declare global {
  interface Window {
    __toast: ToastContextType;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const createToast = React.useCallback(({ duration = 5000, ...props }: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, duration, ...props },
    ]);

    if (duration) {
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
      }, duration);
    }

    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  // Set up the global toast function for server components
  React.useEffect(() => {
    window.__toast = {
      toasts,
      toast: createToast,
      dismiss,
    };
  }, [toasts, createToast, dismiss]);

  const value = React.useMemo<ToastContextType>(
    () => ({
      toasts,
      toast: createToast,
      dismiss,
    }),
    [toasts, createToast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Client-side only toast function
export function toast(props: Omit<ToastProps, 'id'>) {
  if (typeof window === 'undefined') {
    console.warn('Toast can only be used on the client side');
    return '';
  }
  
  if (!window.__toast) {
    console.warn('ToastProvider is not mounted');
    return '';
  }
  
  return window.__toast.toast(props);
}
