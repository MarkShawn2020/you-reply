import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  icon: Icon,
  title,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden border bg-white shadow-sm transition-all hover:shadow-md',
        className,
      )}
    >
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-gray-500" />
          <h2 className="font-medium text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </Card>
  );
}
