import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export function EmptyState({ icon: Icon, title, description, ctaText, ctaLink }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-surface border border-white/5 rounded-[30px] shadow-sm my-8">
      <div className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-yellow opacity-80" />
      </div>
      <h3 className="font-display font-bold text-xl mb-2 text-text-hi">{title}</h3>
      <p className="text-text-lo text-sm mb-6 max-w-sm">
        {description}
      </p>
      {ctaText && ctaLink && (
        <Link href={ctaLink}>
          <Button variant="primary">{ctaText}</Button>
        </Link>
      )}
    </div>
  );
}
