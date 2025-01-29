import { useCompletion } from "ai/react";
import { Textarea } from "~/components/ui/textarea";

export interface LLMChatProps {
  model: string;
  apiEndpoint: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LLMChat({
  model,
  apiEndpoint,
  value,
  onChange,
  className,
}: LLMChatProps) {
  const {
    completion,
    isLoading,
    complete,
  } = useCompletion({
    api: apiEndpoint,
  });

  // Update local state when completion changes
  if (completion && completion !== value) {
    onChange(completion);
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        {model} 回复
      </h4>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-32 ${className}`}
        placeholder={`${model} 生成的回复...`}
        readOnly
      />
    </div>
  );
}

// Export a type that includes the completion methods
export type LLMInstance = {
  value: string;
  isLoading: boolean;
  complete: (prompt: string) => Promise<string>;
  onChange: (value: string) => void;
};
