'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 text-center transition-colors',
        isDragActive
          ? 'border-primary/50 bg-primary/5'
          : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50/50',
        className,
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          'rounded-full bg-gray-100/80 p-4 transition-colors group-hover:bg-primary/10',
          isDragActive && 'bg-primary/10',
        )}
      >
        <Upload
          className={cn(
            'h-6 w-6 text-gray-400 transition-colors group-hover:text-primary',
            isDragActive && 'text-primary',
          )}
        />
      </div>

      <div>
        <p className="text-base font-medium text-gray-700">
          {isDragActive ? '松开鼠标上传图片' : '点击或拖拽上传图片'}
        </p>
        <p className="mt-1 text-sm text-gray-500">支持 PNG、JPG、JPEG 格式</p>
      </div>
    </div>
  );
}
