import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { BackgroundInfoDialog } from "./background-info-dialog";

interface BackgroundInfoEditorProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function BackgroundInfoEditor({
  initialValue,
  onSave,
  className = "",
}: BackgroundInfoEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className={`relative p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">背景信息</h3>
          <BackgroundInfoDialog
            initialContent={initialValue}
            onSave={onSave}
          />
        </div>
        <div className="whitespace-pre-wrap">
          {initialValue || "暂无背景信息"}
        </div>
      </Card>
    </>
  );
}
