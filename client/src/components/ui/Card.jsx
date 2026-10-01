import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  variant = 'paper', // 'paper' | 'sand' | 'forest' | 'bordered'
  onClick,
  ...props
}) => {
  const variantStyles = {
    paper: 'paper-card text-ink',
    sand: 'sand-card text-ink',
    forest: 'forest-card text-ivory',
    bordered: 'border border-sand-border bg-transparent text-ink',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-none p-6 sm:p-7 transition-all duration-300 ${variantStyles[variant] || variantStyles.paper} ${
        hoverEffect
          ? 'hover:border-ink/50 hover:shadow-md cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
