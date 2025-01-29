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

interface PromptEditorDialogProps {
  imagePrompt: string;
  replyPrompt: string;
  onSave: (imagePrompt: string, replyPrompt: string) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function PromptEditorDialog({
  imagePrompt,
  replyPrompt,
  onSave,
  isOpen,
  onOpenChange,
}: PromptEditorDialogProps) {
  const [localImagePrompt, setLocalImagePrompt] = useState(imagePrompt);
  const [localReplyPrompt, setLocalReplyPrompt] = useState(replyPrompt);
  const { toast } = useToast();

  // 同步外部属性变化
  useEffect(() => {
    if (isOpen) {
      setLocalImagePrompt(imagePrompt);
      setLocalReplyPrompt(replyPrompt);
    }
  }, [isOpen, imagePrompt, replyPrompt]);

  const handleSave = useCallback(() => {
    if (!localImagePrompt.trim() || !localReplyPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt 不能为空',
        description: '请填写图片解析和回复生成的 Prompt',
      });
      return;
    }

    onSave(localImagePrompt, localReplyPrompt);
    onOpenChange?.(false);
  }, [localImagePrompt, localReplyPrompt, onSave, onOpenChange, toast]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            编辑 Prompt 模板
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>使用 Cmd + Shift + P 快速打开</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            自定义图片解析和回复生成的 Prompt 模板
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">图片解析 Prompt</h4>
            <Textarea
              value={localImagePrompt}
              onChange={(e) => setLocalImagePrompt(e.target.value)}
              placeholder="请输入图片解析的 Prompt 模板..."
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">回复生成 Prompt</h4>
            <Textarea
              value={localReplyPrompt}
              onChange={(e) => setLocalReplyPrompt(e.target.value)}
              placeholder="请输入回复生成的 Prompt 模板..."
              className="h-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
