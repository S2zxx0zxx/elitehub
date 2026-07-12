import React from 'react';
import { cn } from './Button';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
          active 
            ? "bg-brand-yellow text-black" 
            : "bg-surface-light dark:bg-surface-dark text-text-hi border border-transparent dark:border-white/10 hover:border-brand-yellow/50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Chip.displayName = 'Chip';
