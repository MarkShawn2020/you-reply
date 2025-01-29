import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { History } from 'lucide-react';

export function HistoryDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span>历史记录</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>历史记录</SheetTitle>
          <SheetDescription>
            查看最近的聊天记录和生成的回复
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="text-sm text-gray-500">即将推出...</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
