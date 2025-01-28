'use client';

import { ChangeEvent, useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsUploading(true);
      await onImageUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-4">
        <Label htmlFor="image-upload" className="block text-sm font-medium">
          上传微信聊天截图
        </Label>
        <div className="relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-[300px] w-auto object-contain"
              />
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">
                  点击或拖拽图片到这里上传
                </p>
              </>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
