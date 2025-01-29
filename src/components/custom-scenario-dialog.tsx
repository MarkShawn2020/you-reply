import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface CustomScenarioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prompt: string) => void;
  initialValue?: string;
}

export function CustomScenarioDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialValue = "",
}: CustomScenarioDialogProps) {
  const [prompt, setPrompt] = useState(initialValue);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新建场景</DialogTitle>
          <DialogDescription>
            描述您的对话场景，AI 将根据场景生成合适的回复。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="例如：这是一个与老师的对话，需要保持尊重和谦逊的态度。"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSave(prompt);
              onOpenChange(false);
              setPrompt("");
            }}
          >
            保存场景
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
