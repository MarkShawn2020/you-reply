import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group rounded-lg border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
