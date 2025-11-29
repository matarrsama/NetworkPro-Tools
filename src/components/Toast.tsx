import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastType = 'info' | 'success' | 'error' | 'warning';
type Toast = { id: string; message: string; type?: ToastType; ttl?: number };

type ToastContextValue = {
  addToast: (message: string, type?: ToastType, ttl?: number) => string;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', ttl = 4200) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const toast: Toast = { id, message, type, ttl };
    setToasts((s) => [toast, ...s].slice(0, 6));
    if (ttl > 0) {
      window.setTimeout(() => removeToast(id), ttl);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          {toasts.map((t) => (
            <div key={t.id} role="status" className={`message-card ${t.type === 'success' ? 'message-success' : t.type === 'error' ? 'message-error' : 'message-info'}`} style={{ minWidth: 220, maxWidth: 420 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.type?.toUpperCase()}</div>
                <div style={{ fontSize: 13 }}>{t.message}</div>
              </div>
              <div style={{ marginLeft: 12 }}>
                <button aria-label="Dismiss" onClick={() => removeToast(t.id)} className="btn btn-small btn-secondary" type="button">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
