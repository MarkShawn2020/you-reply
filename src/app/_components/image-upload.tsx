'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 调用上传回调
    onImageUpload(file);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const { items } = e.clipboardData || new DataTransfer();
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
          }
          break;
        }
      }
    },
    [handleFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  if (preview) {
    return (
      <div className={cn('relative rounded-lg border', className)}>
        <img
          src={preview}
          alt="Preview"
          className="h-auto w-full rounded-lg object-contain"
        />
        <button
          onClick={() => setPreview(null)}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 text-gray-600 shadow-sm hover:bg-white hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    );
  }

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
          {isDragActive ? '松开鼠标上传图片' : '点击、拖拽或粘贴上传图片'}
        </p>
        <p className="mt-1 text-sm text-gray-500">支持 PNG、JPG、JPEG 格式</p>
      </div>
    </div>
  );
}
