import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-800 text-white border-emerald-700',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-300" />
    },
    error: {
      bg: 'bg-red-800 text-white border-red-700',
      icon: <AlertCircle className="w-5 h-5 text-red-300" />
    },
    info: {
      bg: 'bg-sb-dark text-white border-sb-green',
      icon: <Info className="w-5 h-5 text-sb-light" />
    }
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md shadow-2xl">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${current.bg}`}>
        {current.icon}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white p-1 rounded-lg transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
