import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ToastType } from '../components/common/Toast';
import ToastContainer from '../components/common/ToastContainer';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => string;
  hideToast: (id: string) => void;
  showSuccessToast: (message: string) => string;
  showErrorToast: (message: string) => string;
  showWarningToast: (message: string) => string;
  showInfoToast: (message: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    return id;
  };

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Convenience methods
  const showSuccessToast = (message: string) => showToast(message, 'success');
  const showErrorToast = (message: string) => showToast(message, 'error');
  const showWarningToast = (message: string) => showToast(message, 'warning');
  const showInfoToast = (message: string) => showToast(message, 'info');

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast,
      }}
    >
      <ToastContainer toasts={toasts} onClose={hideToast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
