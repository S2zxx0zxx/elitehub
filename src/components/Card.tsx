import React from 'react';
import { cn } from './Button'; // Reusing the cn utility

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-surface rounded-[30px] shadow-glossy overflow-hidden border border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}
