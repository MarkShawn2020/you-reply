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
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContactInfoDialogProps {
  contactName?: string;
  contactNotes?: string;
  onSave: (name: string, notes: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export function ContactInfoDialog({
  contactName = '',
  contactNotes = '',
  onSave,
  trigger,
}: ContactInfoDialogProps) {
  const [name, setName] = useState(contactName);
  const [notes, setNotes] = useState(contactNotes);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setName(contactName);
    setNotes(contactNotes);
  }, [contactName, contactNotes]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: '请输入聊天对象名称',
        description: '名称不能为空',
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await onSave(name, notes);
      toast({
        title: '保存成功',
        description: '聊天对象信息已更新',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save contact info:', error);
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: '请稍后重试',
      });
    } finally {
      setIsSaving(false);
    }
  }, [name, notes, isSaving, onSave, toast]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!isSaving) {
      setIsOpen(open);
      if (!open) {
        setName(contactName);
        setNotes(contactNotes);
      }
    }
  }, [isSaving, contactName, contactNotes]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            聊天对象信息
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            聊天对象信息
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>设置当前聊天对象的相关信息，帮助生成更合适的回复</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            添加聊天对象的基本信息和备注，帮助生成更准确的回复内容
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              聊天对象名称
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：张经理、小王"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              备注信息
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：新入职的同事、重要客户、项目合作伙伴"
              className="h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
