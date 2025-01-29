'use client';

import { cn } from '@/lib/utils';
import { Upload, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OCRResponse, groupTextsByPosition, processImageWithOCR } from '@/services/ocr';

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
  const [ocrResults, setOcrResults] = useState<OCRResponse | null>(null);

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
      setIsAnalyzing(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Processing image:', file.name);
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process image');
      }

      const data: OCRResponse = await response.json();
      console.log('OCR Results:', data);
      setOcrResults(data);
      
      const groupedTexts = groupTextsByPosition(data.words_result);
      
      // 将分组后的文本组合成最终结果
      const result = groupedTexts
        .reduce((acc, curr) => {
          if (!acc[curr.group]) {
            acc[curr.group] = [];
          }
          acc[curr.group]!.push(curr.text);
          return acc;
        }, {} as Record<number, string[]>);

      // 将每个组的文本合并，并用换行符分隔不同组
      const finalResult = Object.values(result)
        .map(group => group.join(' '))
        .join('\n');

      setStreamingResult(finalResult);
      onStreamResult?.(finalResult);
      onFinalResult?.(finalResult);
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        await processImage(file);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      
      cleanupPreviews();
      const newImages = files.map(createPreview);
      setImages(newImages);
      setSelectedFile(newImages[0]!);
      
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
    [cleanupPreviews, createPreview, onStreamResult, onFinalResult],
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

  const renderOCRBoxes = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || !selectedFile || !ocrResults) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Rendering OCR boxes:', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      results: ocrResults.words_result.length
    });

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 获取图片实际显示尺寸
    const img = document.getElementById('preview-image') as HTMLImageElement;
    if (!img || !img.complete) {
      console.log('Image not ready');
      return;
    }

    console.log('Image dimensions:', {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.width,
      displayHeight: img.height
    });

    const scale = img.width / img.naturalWidth;
    
    // 设置样式
    ctx.strokeStyle = 'red'; // 改为红色以便更容易看到
    ctx.lineWidth = 2;
    ctx.font = '16px Arial';
    
    // 绘制矩形框和组号
    ocrResults.words_result.forEach((result, index) => {
      const { left, top, width, height } = result.location;
      
      // 缩放坐标和尺寸
      const scaledLeft = left * scale;
      const scaledTop = top * scale;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      
      console.log(`Drawing box ${index}:`, {
        original: { left, top, width, height },
        scaled: { scaledLeft, scaledTop, scaledWidth, scaledHeight }
      });
      
      // 绘制半透明填充
      ctx.fillStyle = `rgba(255, 0, 0, 0.2)`; // 改为红色半透明
      // ctx.fillRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
      
      // 绘制边框
      ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
      
      // 无需绘制文本
      // ctx.fillStyle = 'red';
      // ctx.fillText(
      //   `${result.text} (${Math.round(result.probability * 100)}%)`,
      //   scaledLeft,
      //   scaledTop - 5
      // );
    });
  }, [selectedFile, ocrResults]);

  useEffect(() => {
    const img = document.getElementById('preview-image') as HTMLImageElement;
    if (img) {
      const handleLoad = () => {
        console.log('Image loaded');
        const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
        if (canvas) {
          // 设置Canvas尺寸与图片显示尺寸相同
          canvas.width = img.width;
          canvas.height = img.height;
          renderOCRBoxes(canvas);
        }
      };
      
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
      }
    }
  }, [renderOCRBoxes]);

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
      {selectedFile && (
        <div className="relative mt-4 rounded-lg overflow-hidden">
          <Image
            id="preview-image"
            src={selectedFile.preview}
            alt="Preview"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            onLoad={(e) => {
              console.log('Image onLoad event');
              const canvas = document.getElementById('ocr-canvas') as HTMLCanvasElement;
              if (canvas) {
                const img = e.target as HTMLImageElement;
                canvas.width = img.width;
                canvas.height = img.height;
                renderOCRBoxes(canvas);
              }
            }}
          />
          <canvas
            id="ocr-canvas"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ border: '1px solid blue' }} 
          />
        </div>
      )}
    </div>
  );
}
