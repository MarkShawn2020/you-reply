import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  showProgress?: boolean;
  progressValue?: number;
  progressText?: string;
  lines?: number;
}

export function LoadingSkeleton({
  showProgress = false,
  progressValue = 33,
  progressText = '正在处理...',
  lines = 3,
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: `${100 - i * 10}%`,
          }}
        />
      ))}
      {showProgress && (
        <div className="space-y-2">
          <Progress value={progressValue} className="h-2 w-full" />
          <p className="text-sm text-gray-500">{progressText}</p>
        </div>
      )}
    </div>
  );
}
