import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wide';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-none',
    md: 'text-xs sm:text-sm px-5 py-2.5 gap-2 rounded-none font-semibold',
    lg: 'text-sm sm:text-base px-7 py-3.5 gap-2.5 rounded-none font-semibold uppercase tracking-wider',
    icon: 'p-2.5 rounded-none',
  };

  const variantStyles = {
    primary: 'bg-ink hover:bg-terracotta text-white border border-ink hover:border-terracotta active:scale-[0.99]',
    accent: 'bg-terracotta hover:bg-terracotta-dark text-white border border-terracotta hover:border-terracotta-dark active:scale-[0.99]',
    secondary: 'bg-sand hover:bg-sand-dark text-ink border border-sand-border',
    outline: 'border border-ink text-ink bg-transparent hover:bg-ink hover:text-white',
    outlineWhite: 'border border-white/40 text-white bg-transparent hover:bg-white hover:text-ink',
    ghost: 'text-ink-muted hover:text-ink hover:bg-sand/60',
    forest: 'bg-forest hover:bg-forest-light text-ivory border border-forest',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!isLoading && rightIcon ? rightIcon : null}
    </button>
  );
};

export default Button;
