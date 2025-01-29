import { useChat } from "ai/react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error";
import { BaseLLMChat } from "./base-llm-chat";
import { useEffect } from "react";

export interface DeepseekChatProps {
  prompt: string;
  className?: string;
}

export function DeepseekChat({ prompt, className }: DeepseekChatProps) {
  const { toast } = useToast();
  const { messages, isLoading, error, append, setMessages } = useChat({
    api: "/api/completion/deepseek",
  });

  // 当 parsedText 变化时，清空消息历史
  useEffect(() => {
    setMessages([]);
  }, [prompt, setMessages]);

  const handleGenerate = async () => {
    try {
      await append({
        role: "user",
        // content: `请仔细思考并回答以下问题。使用 <think> 标签记录你的推理过程，使用 <answer> 标签给出最终答案：\n\n${parsedText}`,
        content: prompt,
      });
    } catch (e) {
      toast({
        title: "生成失败",
        description: getErrorMessage(e),
        variant: "destructive",
      });
    }
  };

  // 获取最新的回复
  const lastMessage = messages[messages.length - 1];
  const completion =
    lastMessage?.role === "assistant" ? lastMessage.content : undefined;
  const reasoning =
    lastMessage?.role === "assistant" ? lastMessage.reasoning : undefined;

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
