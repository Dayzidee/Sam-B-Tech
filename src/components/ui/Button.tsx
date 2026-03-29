import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-on-background text-white hover:bg-primary transition-colors',
      secondary: 'bg-primary-container text-on-primary-fixed hover:brightness-110 transition-all',
      outline: 'border border-outline-variant/30 hover:bg-surface-container-low transition-all',
      ghost: 'hover:text-primary transition-all',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold',
      md: 'px-6 py-3 text-sm font-bold',
      lg: 'px-10 py-4 text-lg font-bold',
      icon: 'p-3 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          size === 'icon' ? 'rounded-full' : sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
