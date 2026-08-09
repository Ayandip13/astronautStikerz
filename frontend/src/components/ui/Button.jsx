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
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';
  
  const variants = {
    primary: 'bg-brand-purple text-white hover:brightness-110 shadow-sm hover:shadow-md dark:bg-brand-purple dark:text-white',
    secondary: 'bg-brand-yellow text-foreground hover:brightness-105 shadow-sm hover:shadow-md dark:bg-brand-yellow dark:text-foreground',
    outline: 'border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background text-foreground dark:border-foreground dark:text-foreground dark:hover:bg-foreground dark:hover:text-background',
    ghost: 'bg-transparent hover:bg-foreground/5 text-foreground dark:text-foreground dark:hover:bg-foreground/10',
    danger: 'bg-brand-coral text-white hover:brightness-110 shadow-sm hover:shadow-md dark:bg-brand-coral dark:text-white',
  };

  const sizes = {
    sm: 'h-9 px-5 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-11 w-11',
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
