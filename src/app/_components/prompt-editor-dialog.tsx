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
}

export function PromptEditorDialog({
  imagePrompt,
  replyPrompt,
  onSave,
}: PromptEditorDialogProps) {
  const [localImagePrompt, setLocalImagePrompt] = useState(imagePrompt);
  const [localReplyPrompt, setLocalReplyPrompt] = useState(replyPrompt);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // 同步外部属性变化
  useEffect(() => {
    setLocalImagePrompt(imagePrompt);
    setLocalReplyPrompt(replyPrompt);
  }, [imagePrompt, replyPrompt]);

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
    setIsOpen(false);
    toast({
      title: '保存成功',
      description: 'Prompt 模板已更新',
    });
  }, [localImagePrompt, localReplyPrompt, onSave, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          编辑 Prompt 模板
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            编辑 Prompt 模板
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>自定义图片解析和回复生成的 Prompt 模板</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            使用 {'{text}'} 表示聊天记录，{'{background}'} 表示背景信息
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              图片解析 Prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline-block h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>用于解析聊天截图的 Prompt，生成结构化的聊天记录</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Textarea
              value={localImagePrompt}
              onChange={(e) => setLocalImagePrompt(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              回复生成 Prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline-block h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>用于生成回复的 Prompt，基于结构化的聊天记录生成合适的回复</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Textarea
              value={localReplyPrompt}
              onChange={(e) => setLocalReplyPrompt(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
