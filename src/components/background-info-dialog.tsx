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
import { Settings2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BackgroundInfoDialogProps {
  initialContent?: string;
  initialNotes?: string;
  onSave: (content: string, notes: string) => Promise<void>;
}

const YEAR = new Date().getFullYear();

const BACKGROUND_EXAMPLES = [
  `当前是${YEAR}年春节期间，需要表达新春祝福`,
  '这是一个工作场合的对话，需要保持专业礼貌',
  '对方是长辈，需要用更尊敬的语气',
  '这是朋友间的闲聊，语气可以轻松活泼',
] as const;

export function BackgroundInfoDialog({
  initialContent = '',
  initialNotes = '',
  onSave,
}: BackgroundInfoDialogProps) {
  const [content, setContent] = useState(initialContent);
  const [notes, setNotes] = useState(initialNotes);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // 使用 useEffect 处理初始内容更新
  useEffect(() => {
    setContent(initialContent);
    setNotes(initialNotes);
  }, [initialContent, initialNotes]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      await onSave(content, notes);
      toast({
        title: '保存成功',
        description: '背景信息和备注已更新',
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
  }, [content, notes, isSaving, onSave, toast]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!isSaving) {
      setIsOpen(open);
      if (!open) {
        setContent(initialContent);
        setNotes(initialNotes);
      }
    }
  }, [isSaving, initialContent, initialNotes]);

  const handleExampleClick = useCallback((example: string) => {
    setContent((prev) => {
      if (!prev) return example;
      return `${prev}\n${example}`;
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          {/* 修改背景信息 */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            背景信息设置
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>设置聊天的背景信息和备注，帮助生成更合适的回复</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            添加对话的背景信息和备注，帮助生成更准确的回复内容
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="background" className="text-sm font-medium">
              背景信息
            </label>
            <Textarea
              id="background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="例如：这是一个工作场合的对话，需要保持专业礼貌"
              className="h-24"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">快速添加示例</label>
            <div className="flex flex-wrap gap-2">
              {BACKGROUND_EXAMPLES.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
          >
            取消
          </Button>
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
