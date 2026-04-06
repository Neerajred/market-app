import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: Trash2,
      color: 'bg-red-50 text-red-600',
      button: 'bg-red-500 hover:bg-red-600 shadow-red-100',
      iconContainer: 'bg-red-100 text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-yellow-50 text-yellow-600',
      button: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-100',
      iconContainer: 'bg-yellow-100 text-yellow-600'
    }
  };

  const config = typeConfig[type] || typeConfig.danger;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-zoomIn flex flex-col items-center p-8">
        <div className={`w-16 h-16 ${config.iconContainer} rounded-full flex items-center justify-center mb-6`}>
          <Icon size={32} />
        </div>

        <h3 className="text-xl font-black text-gray-800 text-center mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 text-center font-bold mb-8">{message}</p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all transform active:scale-95 shadow-lg ${config.button}`}
          >
            {confirmText}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
