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
    reasoning,
    isLoading,
    complete,
    error,
  } = useCompletion({
    api: "/api/completion/deepseek",
    body: {
      // 使用 <think> 和 <answer> 标签来引导模型的推理过程
      prompt: `请仔细思考并回答以下问题。使用 <think> 标签记录你的推理过程，使用 <answer> 标签给出最终答案：\n\n${parsedText}`,
    },
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
      reasoning={reasoning}
      isLoading={isLoading}
      onGenerate={handleGenerate}
      error={error}
      className={className}
    />
  );
}
