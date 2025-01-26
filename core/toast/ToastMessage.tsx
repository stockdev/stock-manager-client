import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessageProps {
  type: ToastType;
  title: string;
  message: string;
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-500',
    glowColor: 'shadow-emerald-500/20',
    iconColor: 'text-emerald-100',
    titleColor: 'text-emerald-100',
    messageColor: 'text-emerald-100/80',
    ringColor: 'ring-emerald-400/30',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    glowColor: 'shadow-red-500/20',
    iconColor: 'text-red-100',
    titleColor: 'text-red-100',
    messageColor: 'text-red-100/80',
    ringColor: 'ring-red-400/30',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-orange-500',
    glowColor: 'shadow-orange-500/20',
    iconColor: 'text-orange-100',
    titleColor: 'text-orange-100',
    messageColor: 'text-orange-100/80',
    ringColor: 'ring-orange-400/30',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/20',
    iconColor: 'text-blue-100',
    titleColor: 'text-blue-100',
    messageColor: 'text-blue-100/80',
    ringColor: 'ring-blue-400/30',
  },
};

export const ToastMessage = ({ type, title, message, onClose }: ToastMessageProps) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`w-[400px] ${config.bgColor} bg-opacity-95 backdrop-blur-xl rounded-lg shadow-lg ${config.glowColor} shadow-2xl ring-1 ${config.ringColor}`}
    >
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className={`p-1.5 rounded-full bg-white/20 backdrop-blur-sm ${config.ringColor} ring-1`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${config.titleColor} text-[0.925rem]`}>
              {title}
            </h3>
            <p className={`mt-1 text-[0.875rem] ${config.messageColor} break-words leading-relaxed`}>
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className={`w-4 h-4 ${config.iconColor}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};