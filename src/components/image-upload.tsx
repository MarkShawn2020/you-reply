'use client';

import { cn } from '@/lib/utils';
import { Upload, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OCRResponse, groupTextsByPosition } from '@/services/ocr';
import { createAnnotatedPreview } from '@/lib/image-utils';
import { createLogger } from '@/lib/client-logger';

const logger = createLogger('ImageUpload');

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
  const [editedResult, setEditedResult] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null);
  const [ocrResults, setOcrResults] = useState<OCRResponse | null>(null);

  const processImage = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // 1. 创建初始预览图
      const initialPreview = await createAnnotatedPreview(file);
      setSelectedFile({
        file,
        preview: initialPreview,
      });
      
      // 2. 获取OCR结果
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
      console.log('OCR Results:', JSON.stringify(data, null, 2));
      setOcrResults(data);
      
      // 3. 创建带标注的预览图
      const annotatedPreview = await createAnnotatedPreview(file, data);
      setSelectedFile({
        file,
        preview: annotatedPreview,
      });
      
      // 4. 通过API分析OCR结果
      console.log('Sending OCR results to analyze API...');
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ocrResult: data }),
      });

      if (!analyzeResponse.ok) {
        const error = await analyzeResponse.json();
        console.error('Analysis API error:', error);
        throw new Error(error.error || 'Failed to analyze OCR results');
      }

      const analyzeData = await analyzeResponse.json();
      console.log('Analysis API response:', analyzeData);
      
      const result = analyzeData.result;
      setStreamingResult(result);
      setEditedResult(result);
      onStreamResult?.(result);
      onFinalResult?.(result);
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      
      try {
        const file = files[0]!;  // 只处理第一个文件
        await processImage(file);
      } catch (error) {
        console.error('Error handling files:', error);
        setError(error instanceof Error ? error.message : 'Failed to process files');
      }
    },
    [processImage],
  );

  const handleRetry = useCallback(() => {
    logger.debug('Retrying image upload');
    if (selectedFile) {
      setError(null);
      setStreamingResult('');
      processImage(selectedFile.file).catch(console.error);
    }
  }, [selectedFile]);

  const handleRemove = useCallback(
    (index: number) => {
      const imageToRemove = images[index]!;
      URL.revokeObjectURL(imageToRemove.preview);
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    [images],
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    logger.debug('Files dropped', { count: acceptedFiles.length });
    
    if (acceptedFiles.length === 0) {
      logger.warn('No files were accepted');
      return;
    }

    const file = acceptedFiles[0]!;
    logger.info('Processing file', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });

    try {
      await handleFiles([file]);
    } catch (error) {
      logger.error('Error processing file', { error });
      setError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [handleFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    disabled: isAnalyzing,
  });

  useEffect(() => {
    if (error) {
      logger.error('Image upload error', { error });
    }
  }, [error]);

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
        <div {...getRootProps()} className="flex-1">
          <input {...getInputProps()} />
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2"
            disabled={isAnalyzing}
          >
            <Upload className="w-8 h-8" />
            <div className="text-sm">
              {isAnalyzing ? '处理中...' : '点击或拖拽图片到此处'}
            </div>
          </Button>
        </div>
        {selectedFile && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => {
              setSelectedFile(null);
              setStreamingResult('');
              setError(null);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <div className="text-sm">{error}</div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={handleRetry}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重试
          </Button>
        </div>
      )}

      {selectedFile && (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 左侧：预览图 */}
          <div className="w-full lg:w-[400px] lg:shrink-0">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                id="preview-image"
                src={selectedFile.preview}
                alt="Preview"
                width={400}
                height={300}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* 右侧：解析结果 */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2 h-full flex flex-col">
              <div className="font-medium flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                <span>解析结果:</span>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedResult(streamingResult);
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setIsEditing(false);
                          setStreamingResult(editedResult);
                          onStreamResult?.(editedResult);
                          onFinalResult?.(editedResult);
                        }}
                      >
                        保存
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => setIsEditing(true)}
                    >
                      编辑
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                value={isEditing ? editedResult : streamingResult}
                onChange={(e) => setEditedResult(e.target.value)}
                readOnly={!isEditing}
                className="flex-1 font-mono text-sm min-h-[200px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
