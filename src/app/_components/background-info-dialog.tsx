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
  onSave: (content: string) => Promise<void>;
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
            背景信息
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[200px] text-sm">
                    添加背景信息可以帮助生成更准确、更合适的回复。
                    例如：当前的节日、场合、对话关系等。
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            添加一些额外的背景信息，帮助生成更准确的回复。
            点击下方示例快速添加常用场景。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2">
            {BACKGROUND_EXAMPLES.map((example) => (
              <Button
                key={example}
                variant="secondary"
                size="sm"
                className="h-auto whitespace-normal py-1.5 text-xs"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例如：当前是 2024 年春节期间..."
            className="min-h-[200px]"
          />

          <div className="text-xs text-gray-500">
            提示：可以点击上方示例快速添加常用场景，或直接输入自定义背景信息
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
