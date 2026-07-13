import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoCloseCircle, IoClose } from 'react-icons/io5';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <IoCheckmarkCircle className="text-cyber-green text-xl shrink-0" />,
    error: <IoCloseCircle className="text-cyber-red text-xl shrink-0" />,
    warning: <IoAlertCircle className="text-cyber-yellow text-xl shrink-0" />,
  };

  const borderColors = {
    success: 'border-cyber-green/50 shadow-glow-green/20',
    error: 'border-cyber-red/50 shadow-glow-red/20',
    warning: 'border-cyber-yellow/50 shadow-glow-yellow/20',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-lg bg-cyberdark-card border ${borderColors[type]} shadow-lg transition-all duration-300 transform translate-y-0 max-w-sm`}>
      {icons[type]}
      <p className="text-sm font-medium text-gray-200">{message}</p>
      <button 
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-200 transition-colors"
      >
        <IoClose className="text-lg" />
      </button>
    </div>
  );
};

export default Toast;
