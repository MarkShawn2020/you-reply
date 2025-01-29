import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div className={cn('rounded-2xl border bg-white p-6', className)}>
      {children}
    </div>
  );
}
