'use client';

import React from 'react';
import { cn } from '@agentic/shared';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'neo-button',
    secondary: 'glass hover:bg-white/10 border border-neon-blue/30 hover:border-neon-blue',
    ghost: 'hover:bg-white/5',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
