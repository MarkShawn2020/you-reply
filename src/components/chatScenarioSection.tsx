import { MessageCircle } from "lucide-react";
import { ReactNode } from "react";
import { BackgroundInfoEditor } from "~/components/background-info-editor";
import { SectionCard } from "~/components/section-card";

export function ChatScenarioSection(props: {
  callbackfn: (scenario: {
    id: string;
    label: string;
    prompt: string;
  }) => ReactNode;
  initialValue: string;
  onSave: (value: string) => Promise<void>;
}) {
  return (
    <SectionCard
      icon={MessageCircle}
      title="步骤 1: 选择聊天场景"
      className="bg-white shadow-lg"
    >
      <div className="space-y-6">
        {/* Predefined Scenarios */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">预设场景</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              {
                id: "newyear",
                label: "拜年祝福",
                prompt: "这是一个拜年场景，需要礼貌热情的祝福语",
              },
              {
                id: "work",
                label: "工作沟通",
                prompt: "这是一个工作沟通场景，需要专业简洁的回复",
              },
              {
                id: "friend",
                label: "朋友聊天",
                prompt: "这是一个朋友聊天场景，需要轻松自然的对话",
              },
              {
                id: "customer",
                label: "客户服务",
                prompt: "这是一个客户服务场景，需要耐心周到的回应",
              },
              {
                id: "family",
                label: "家人互动",
                prompt: "这是一个家人互动场景，需要温暖亲切的交流",
              },
              {
                id: "custom",
                label: "自定义场景",
                prompt: "请在下方详细说明场景",
              },
            ].map(props.callbackfn)}
          </div>
        </div>

        {/* Background Info Editor */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">场景详细说明</h3>
          <BackgroundInfoEditor
            initialValue={props.initialValue}
            onSave={props.onSave}
          />
        </div>
      </div>
    </SectionCard>
  );
}
