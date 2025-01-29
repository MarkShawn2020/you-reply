import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface BaseLLMChatProps {
  title: string;
  completion: string | undefined;
  reasoning?: string | undefined;
  isLoading: boolean;
  onGenerate: () => Promise<void>;
  error?: Error | null;
  buttonClassName?: string;
  className?: string;
}

export function BaseLLMChat({
  title,
  completion,
  reasoning,
  isLoading,
  onGenerate,
  error,
  buttonClassName = "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600",
  className,
}: BaseLLMChatProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!completion) return;
    await copyToClipboard(completion);
    toast({
      title: "已复制到剪贴板",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        {title}
      </h4>
      <div className="space-y-2">
        {/* 推理过程 */}
        {reasoning && (
          <div className="rounded-md bg-gray-50 p-3">
            <h5 className="mb-2 text-xs font-medium text-gray-500">推理过程</h5>
            <pre className="whitespace-pre-wrap break-words text-xs text-gray-600">
              {reasoning}
            </pre>
          </div>
        )}

        {/* 最终回答 */}
        <div className={cn("space-y-2", reasoning && "border-t border-gray-100 pt-2")}>
          {reasoning && (
            <h5 className="text-xs font-medium text-gray-500">最终回答</h5>
          )}
          <Textarea
            value={completion || ""}
            className={`h-32 ${className}`}
            placeholder={`${title}生成的回复...`}
            readOnly
          />
        </div>

        <div className="flex gap-2">
          <Button
            className={`flex-1 ${buttonClassName}`}
            disabled={isLoading}
            onClick={onGenerate}
          >
            {isLoading ? "生成中..." : "生成回复"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCopy}
            disabled={!completion}
          >
            <Copy className="h-4 w-4" />
            复制
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}
      </div>
    </div>
  );
}
