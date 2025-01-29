import { Copy, Wand2 } from "lucide-react";
import { ErrorAlert } from "~/components/error-alert";
import { LoadingSkeleton } from "~/components/loading-skeleton";
import { SectionCard } from "~/components/section-card";
import { Button } from "~/components/ui/button";
import { DeepseekChat } from "./deepseek-chat";
import { ClaudeChat } from "./claude-chat";

export interface GenReplySectionProps {
  error: null | string;
  parsedText: string;
  generating: boolean;
  onGenerate: () => Promise<void>;
  onCopy: () => void;
}

export function GenReplySection({
  error,
  parsedText,
  generating,
  onGenerate,
  onCopy,
}: GenReplySectionProps) {
  return (
    <SectionCard
      icon={Wand2}
      title="步骤 3: 生成智能回复"
      className="bg-white shadow-lg"
    >
      <div className="space-y-4">
        {error ? (
          <ErrorAlert error={error} />
        ) : parsedText ? (
          <>
            {generating ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DeepseekChat prompt={parsedText} />
                  <ClaudeChat prompt={parsedText} />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                    disabled={generating}
                    onClick={onGenerate}
                  >
                    {generating ? "生成中..." : "生成回复"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={onCopy}>
                    <Copy className="h-4 w-4" />
                    复制
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>请先完成步骤 1 和步骤 2</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
