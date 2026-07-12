import React from 'react';
import { cn } from './Button';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-text-lo/20", className)}
      {...props}
    />
  );
}
