'use client';

import { cn } from '@/lib/utils';
import { Upload, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { processImageWithDify, uploadImageToDify } from '../actions';

interface ImageUploadProps {
  /** User ID for tracking */
  userId: string;
  className?: string;
  error?: string | null;
  isAnalyzing?: boolean;
  /** Streaming results */
  onStreamResult?: (result: string) => void;
  /** Final result callback */
  onFinalResult?: (result: string) => void;
}

export function ImageUpload({ 
  userId,
  className = '', 
  error: propError, 
  isAnalyzing: propIsAnalyzing,
  onStreamResult,
  onFinalResult,
}: ImageUploadProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [maxRetries, setMaxRetries] = useState<number>(3);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null);

  const createPreview = useCallback((file: File): { file: File; preview: string } => {
    return {
      file,
      preview: URL.createObjectURL(file),
    };
  }, []);

  const cleanupPreviews = useCallback(() => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, [images]);

  useEffect(() => {
    return () => cleanupPreviews();
  }, [cleanupPreviews]);

  const processImage = async (file: File) => {
    try {
      // 1. Upload file to Dify
      const fileId = await uploadImageToDify(file, userId);

      // 2. Process with Dify workflow
      const stream = await processImageWithDify(fileId, userId);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      let buffer = ''; // 用于存储未完成的数据
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将新的数据添加到缓冲区
        buffer += decoder.decode(value, { stream: true });
        
        // 处理完整的 SSE 消息
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          try {
            const jsonStr = trimmedLine.slice(6);
            const eventData = JSON.parse(jsonStr);
            
            if (eventData.event === 'workflow_finished') {
              if (eventData.data.status === 'succeeded') {
                onFinalResult?.(result);
              } else {
                throw new Error(eventData.data.error || 'Workflow failed');
              }
            } else if (eventData.event === 'node_finished' && eventData.data.outputs?.text) {
              result = eventData.data.outputs.text;
              setStreamingResult(result);
              onStreamResult?.(result);
            }
          } catch (parseError) {
            console.error('Error parsing SSE message:', parseError, '\nLine:', trimmedLine);
            continue; // 跳过这一行，继续处理下一行
          }
        }
      }

      // 处理剩余的缓冲区数据
      if (buffer.trim()) {
        try {
          const trimmedLine = buffer.trim();
          if (trimmedLine.startsWith('data: ')) {
            const jsonStr = trimmedLine.slice(6);
            const eventData = JSON.parse(jsonStr);
            
            if (eventData.event === 'workflow_finished') {
              if (eventData.data.status === 'succeeded') {
                onFinalResult?.(result);
              } else {
                throw new Error(eventData.data.error || 'Workflow failed');
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing final SSE message:', parseError);
        }
      }

    } catch (err) {
      console.error('Processing error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      
      cleanupPreviews();
      const newImages = files.map(createPreview);
      setImages(newImages);
      setSelectedFile(newImages[0]);
      
      const file = files[files.length - 1]!;
      setIsAnalyzing(true);
      setError(null);
      setStreamingResult('');
      setRetryCount(0);
      
      try {
        await processImage(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process image');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [userId, cleanupPreviews, createPreview, onStreamResult, onFinalResult],
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
    if (selectedFile) {
      setIsAnalyzing(true);
      setError(null);
      setStreamingResult('');
      setRetryCount(retryCount + 1);
      
      processImage(selectedFile.file)
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [selectedFile, retryCount]);

  const removeImage = useCallback(
    (index: number) => {
      const imageToRemove = images[index]!;
      URL.revokeObjectURL(imageToRemove.preview);
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    [images],
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || isAnalyzing) return;

      const imageFiles: File[] = [];
      for (const item of Array.from(items)) {
        if (item.type.includes('image')) {
          const file = item.getAsFile();
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
      <div className="flex gap-4">
        {/* 上传区域 */}
        <div
          {...getRootProps()}
          className={cn(
            'group relative transition-colors w-[200px] shrink-0',
            isDragActive
              ? 'border-primary/50 bg-primary/5'
              : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50/50',
            isAnalyzing && 'cursor-not-allowed opacity-60',
            'rounded-lg border-2',
            images.length === 0 && 'h-[200px]'
          )}
        >
          <input {...getInputProps()} />
          {images.length === 0 ? (
            <div className="h-full flex cursor-pointer flex-col items-center justify-center gap-4 p-4 text-center">
              <div
                className={cn(
                  'rounded-full p-4 transition-colors',
                  'bg-gray-100/80 group-hover:bg-primary/10',
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
                  {isDragActive
                    ? '松开鼠标上传图片'
                    : isAnalyzing
                    ? '正在解析图片...'
                    : '点击、拖拽或粘贴上传图片'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  支持 PNG、JPG、JPEG 格式
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Image
                src={images[0]!.preview}
                alt="Preview"
                width={200}
                height={200}
                className="block w-full h-auto rounded-lg"
              />
              <button
                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(0);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 识别结果区域 */}
        {images.length > 0 && (
          <div className="flex flex-col flex-1 min-h-[100px]">
            <div className="relative flex-1 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-2 h-8"
                  disabled={isAnalyzing}
                >
                  <RefreshCw className={cn('h-4 w-4', isAnalyzing && 'animate-spin')} />
                </Button>
              </div>
              
              <Textarea
                value={streamingResult}
                onChange={(e) => setStreamingResult(e.target.value)}
                className="w-full h-full min-h-[200px] resize-none bg-transparent"
                placeholder={
                  isAnalyzing
                    ? retryCount > 0
                      ? `正在重试解析图片... (${retryCount}/${maxRetries})`
                      : '正在解析图片...'
                    : '等待解析图片...'
                }
              />
              
              {error && (
                <div className="mt-2 p-2 rounded bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
