import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  // Style configurations based on variant
  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      icon: <Info className="h-5 w-5 text-blue-500" />,
      title: 'text-blue-800',
      content: 'text-blue-700',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: 'text-green-800',
      content: 'text-green-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      title: 'text-amber-800',
      content: 'text-amber-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      title: 'text-red-800',
      content: 'text-red-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-md border-l-4 p-4 ${styles.bg} ${styles.border} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>}
          <div className={`text-sm ${title ? 'mt-2' : ''} ${styles.content}`}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md ${styles.bg} p-1.5 text-gray-500 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 focus:ring-${variant}-500`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;