'use client';

import { cn } from '@/lib/utils';
import { Upload, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

export interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  className?: string;
  error?: string | null;
  isAnalyzing?: boolean;
}

export function ImageUpload({ onImageUpload, className = '', error, isAnalyzing }: ImageUploadProps) {
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 创建预览URL
  const createPreview = useCallback((file: File): { file: File; url: string } => {
    return {
      file,
      url: URL.createObjectURL(file),
    };
  }, []);

  // 清理预览URL
  const cleanupPreviews = useCallback(() => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
  }, [images]);

  useEffect(() => {
    return () => cleanupPreviews();
  }, [cleanupPreviews]);

  const handleFiles = useCallback(
    (files: File[]) => {
      // 清理旧的预览
      cleanupPreviews();
      
      // 创建新的预览
      const newImages = files.map(createPreview);
      setImages(newImages);

      // 如果有新文件，使用最后一个文件进行分析
      if (files.length > 0) {
        onImageUpload(files[files.length - 1]!);
      }
    },
    [cleanupPreviews, createPreview, onImageUpload],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFiles(acceptedFiles);
    },
    [handleFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    disabled: isAnalyzing,
  });

  const handleRetry = useCallback(() => {
    if (images.length > 0) {
      onImageUpload(images[images.length - 1]!.file);
    }
  }, [images, onImageUpload]);

  const handleRemoveImage = useCallback(
    (index: number) => {
      const imageToRemove = images[index]!;
      URL.revokeObjectURL(imageToRemove.url);
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    [images],
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || isAnalyzing) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i]!.type.indexOf('image') !== -1) {
          const file = items[i]!.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        handleFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles, isAnalyzing]);

  return (
    <div className={cn('space-y-4', className)}>


      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary/50 bg-primary/5'
            : error
            ? 'border-red-200 bg-red-50/50'
            : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50/50',
          isAnalyzing && 'cursor-not-allowed opacity-60',
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
            <AlertCircle className={cn('h-6 w-6 text-red-500')} />
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
              {images.length > 0 && (
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

            {/* 预览区域 */}
            {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.url}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-gray-50"
            >
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-contain"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute right-2 top-2 rounded-full bg-gray-900/20 p-1 opacity-0 transition-opacity hover:bg-gray-900/40 group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
