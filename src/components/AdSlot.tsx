import React from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';

interface AdSlotProps {
  title: string;
  description: string;
  ctaText: string;
  imageColor?: string; // mocking the ad banner graphic
}

export function AdSlot({ title, description, ctaText, imageColor = "bg-blue-600" }: AdSlotProps) {
  return (
    <Card className="my-6 border border-brand-yellow/20 relative overflow-hidden group cursor-pointer">
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-text-lo z-10">
        Sponsored
      </div>
      <div className={`w-full h-32 ${imageColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
      <CardContent className="bg-surface-dark">
        <h4 className="font-bold text-elite-white mb-1">{title}</h4>
        <p className="text-sm text-text-lo mb-3">{description}</p>
        <Button variant="outline" size="sm" className="w-full text-brand-yellow border-brand-yellow hover:bg-brand-yellow/10">
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}
