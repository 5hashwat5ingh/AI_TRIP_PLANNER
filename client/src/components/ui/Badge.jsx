import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 tracking-widest',
    md: 'text-[10px] px-2.5 py-1 tracking-widest',
    lg: 'text-xs px-3 py-1.5 tracking-wider',
  };

  const variantStyles = {
    default: 'bg-sand text-ink border border-sand-border uppercase font-mono',
    primary: 'bg-ink text-ivory border border-ink uppercase font-mono',
    terracotta: 'bg-terracotta/10 text-terracotta border border-terracotta/30 uppercase font-mono',
    olive: 'bg-olive/10 text-olive-dark border border-olive/30 uppercase font-mono',
    forest: 'bg-forest text-ivory border border-forest-border uppercase font-mono',
    paper: 'bg-white text-ink border border-sand-border uppercase font-mono',
    success: 'bg-emerald-900/10 text-emerald-800 border border-emerald-700/30 uppercase font-mono',
    warning: 'bg-amber-900/10 text-amber-800 border border-amber-700/30 uppercase font-mono',
    danger: 'bg-red-900/10 text-red-800 border border-red-700/30 uppercase font-mono',
    running: 'bg-terracotta text-white border border-terracotta uppercase font-mono animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'running'
              ? 'bg-white animate-ping'
              : variant === 'terracotta'
              ? 'bg-terracotta'
              : variant === 'olive'
              ? 'bg-olive'
              : 'bg-ink'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
