import { type ReactNode } from 'react';
import { cn } from '@/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'sale' | 'new';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    default: 'bg-secondary-container text-on-secondary-fixed-variant',
    sale: 'bg-tertiary-container text-on-tertiary-container',
    new: 'bg-[#e8f5e9] text-[#2e7d32]',
  };

  return (
    <span className={cn(
      'text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
