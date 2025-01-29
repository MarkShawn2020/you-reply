import { useCompletion } from "ai/react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error";
import { BaseLLMChat } from "./base-llm-chat";

export interface ClaudeChatProps {
  prompt: string;
  className?: string;
}

export function ClaudeChat({ prompt, className }: ClaudeChatProps) {
  const { toast } = useToast();
  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/completion/claude",
  });

  const handleGenerate = async () => {
    try {
      await complete(prompt);
    } catch (e) {
      toast({
        title: "生成失败",
        description: getErrorMessage(e),
        variant: "destructive",
      });
    }
  };

  console.log({ error });

  return (
    <BaseLLMChat
      title="Claude"
      completion={completion}
      isLoading={isLoading}
      onGenerate={handleGenerate}
      error={error}
      buttonClassName="bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
      className={className}
    />
  );
}
