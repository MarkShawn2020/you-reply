import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  className?: string;
}

export function ImagePreview({ src, onRemove, className }: ImagePreviewProps) {
  return (
    <div
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-lg border bg-white',
        className,
      )}
    >
      <Image
        src={src}
        alt="Preview"
        className="object-contain"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
          移除图片
        </Button>
      </div>
    </div>
  );
}
