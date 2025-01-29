import { useCompletion } from "ai/react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error";
import { BaseLLMChat } from "./base-llm-chat";

export interface DeepseekChatProps {
  parsedText: string;
  className?: string;
}

export function DeepseekChat({
  parsedText,
  className,
}: DeepseekChatProps) {
  const { toast } = useToast();
  const {
    completion,
    isLoading,
    complete,
    error: completionError,
  } = useCompletion({
    api: "/api/completion/deepseek",
  });

  const handleGenerate = async () => {
    try {
      await complete(parsedText);
    } catch (e) {
      toast({
        title: "生成失败",
        description: getErrorMessage(e),
        variant: "destructive",
      });
    }
  };

  return (
    <BaseLLMChat
      title="Deepseek"
      completion={completion}
      isLoading={isLoading}
      onGenerate={handleGenerate}
      error={completionError}
      className={className}
    />
  );
}
