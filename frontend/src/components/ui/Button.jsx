import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700',
    outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-100 text-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
