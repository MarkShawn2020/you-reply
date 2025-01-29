'use client';

import { cn } from '@/lib/utils';
import { Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  className?: string;
  error?: string | null;
  isAnalyzing?: boolean;
}

export function ImageUpload({
  onImageUpload,
  className,
  error,
  isAnalyzing,
}: ImageUploadProps) {
  const [lastFile, setLastFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setLastFile(file);
        onImageUpload(file);
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
    disabled: isAnalyzing,
  });

  const handleRetry = useCallback(() => {
    if (lastFile) {
      onImageUpload(lastFile);
    }
  }, [lastFile, onImageUpload]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || isAnalyzing) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setLastFile(file);
            onImageUpload(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageUpload, isAnalyzing]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 text-center transition-colors',
        isDragActive
          ? 'border-primary/50 bg-primary/5'
          : error
          ? 'border-red-200 bg-red-50/50'
          : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50/50',
        isAnalyzing && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          'rounded-full p-4 transition-colors',
          error
            ? 'bg-red-100/80 group-hover:bg-red-200/60'
            : 'bg-gray-100/80 group-hover:bg-primary/10',
          isDragActive && 'bg-primary/10',
        )}
      >
        {error ? (
          <AlertCircle
            className={cn('h-6 w-6 text-red-500')}
          />
        ) : (
          <Upload
            className={cn(
              'h-6 w-6 text-gray-400 transition-colors group-hover:text-primary',
              isDragActive && 'text-primary',
            )}
          />
        )}
      </div>

      <div>
        {error ? (
          <div className="space-y-2">
            <p className="text-base font-medium text-red-600">图片解析失败</p>
            <p className="text-sm text-red-500">{error}</p>
            {lastFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="mt-2 gap-2"
                disabled={isAnalyzing}
              >
                <RefreshCw className="h-4 w-4" />
                重新尝试
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-base font-medium text-gray-700">
              {isDragActive
                ? '松开鼠标上传图片'
                : isAnalyzing
                ? '正在解析图片...'
                : '点击、拖拽或粘贴上传图片'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              支持 PNG、JPG、JPEG 格式
            </p>
          </>
        )}
      </div>
    </div>
  );
}
