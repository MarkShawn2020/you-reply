import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function SectionCard({
  icon: Icon,
  title,
  children,
  className,
  action,
}: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b bg-gray-50/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">{title}</h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}
