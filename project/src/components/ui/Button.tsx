import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Get variant styles
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500';
      case 'secondary':
        return 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500';
      case 'warning':
        return 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500';
      case 'outline':
        return 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500';
    }
  };
  
  // Get size styles
  const getSizeStyles = (): string => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'md':
        return 'h-10 px-4 py-2 text-sm';
      case 'lg':
        return 'h-12 px-6 py-3 text-base';
      default:
        return 'h-10 px-4 py-2 text-sm';
    }
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${widthStyle} ${className}`;

  return (
    <button 
      className={buttonStyles} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button