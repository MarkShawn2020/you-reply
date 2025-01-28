'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundInfoDialogProps {
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
}

export function BackgroundInfoDialog({
  initialContent = '',
  onSave,
}: BackgroundInfoDialogProps) {
  const [content, setContent] = useState(initialContent);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // 使用 useEffect 处理初始内容更新
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      await onSave(content);
      toast({
        title: '保存成功',
        description: '背景信息已更新',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save background info:', error);
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: '请稍后重试',
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, isSaving, onSave, toast]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!isSaving) {
      setIsOpen(open);
      if (!open) {
        setContent(initialContent);
      }
    }
  }, [isSaving, initialContent]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          补充背景信息
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>补充背景信息</DialogTitle>
          <DialogDescription>
            添加一些额外的背景信息，帮助生成更准确的回复。例如：当前年份、节日、特殊场合等。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例如：当前是 2025 年春节期间..."
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
