'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { Settings2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ContactInfoEditorProps {
  initialValue: {
    name: string;
    notes: string;
  };
  onSave: (name: string, notes: string) => Promise<void>;
  className?: string;
}

export function ContactInfoEditor({
  initialValue,
  onSave,
  className = "",
}: ContactInfoEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (
      debouncedValue.name !== initialValue.name ||
      debouncedValue.notes !== initialValue.notes
    ) {
      onSave(debouncedValue.name, debouncedValue.notes).catch(console.error);
    }
  }, [debouncedValue, initialValue, onSave]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDone = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <Card className={`relative p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">聊天对象信息</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={isEditing ? handleDone : handleEdit}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            placeholder="请输入聊天对象名称..."
          />
          <Textarea
            value={value.notes}
            onChange={(e) => setValue({ ...value, notes: e.target.value })}
            placeholder="请输入备注信息..."
            className="min-h-[100px]"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="font-medium">{value.name || "未设置名称"}</div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {value.notes || "暂无备注信息"}
          </div>
        </div>
      )}
    </Card>
  );
}
