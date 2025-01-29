"use client";

import { useToast } from "@/hooks/use-toast";
import { imagePromptAtom, replyPromptAtom } from "@/store/prompts";
import {
  customScenariosAtom,
  type CustomScenario,
} from "@/store/custom-scenario";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ChatScenarioSection } from "~/components/chatScenarioSection";
import { GenReplySection } from "~/components/genReplySection";
import { ImageUploadSection } from "~/components/imageUploadSection";
import { PromptEditorDialog } from "~/components/prompt-editor-dialog";
import { CustomScenarioDialog } from "~/components/custom-scenario-dialog";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { ClaudeChat } from "~/components/claude-chat";
import { SectionCard } from "~/components/section-card";
import { Button } from "~/components/ui/button";
import { Pen, Settings, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "~/components/ui/select";
import { atomWithStorage } from "jotai/utils";
import {
  getLatestBackgroundInfo,
  saveBackgroundInfo,
  saveChatContext,
} from "../actions";
import { DeepseekChat } from "~/components/deepseek-chat";

const promptEditorOpenAtom = atomWithStorage("promptEditorOpen", false);

const defaultScenarios = [
  { id: "spring-festival", label: "春节拜年" },
  { id: "work", label: "工作汇报" },
  { id: "social", label: "社交聊天" },
  { id: "customer", label: "客户服务" },
  { id: "new", label: "新建场景" },
];

export default function AppPage() {
  const [parsedText, setParsedText] = useState("");
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
  const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
  const [isPromptEditorOpen, setIsPromptEditorOpen] =
    useAtom(promptEditorOpenAtom);
  const [isCustomScenarioOpen, setIsCustomScenarioOpen] = useState(false);
  const [customScenarios, setCustomScenarios] = useAtom(customScenariosAtom);
  const { toast } = useToast();

  // 合并默认场景和自定义场景
  const allScenarios = useMemo(() => {
    return [
      ...defaultScenarios.filter((s) => s.id !== "new"),
      ...customScenarios,
      { ...defaultScenarios.find((s) => s.id === "new")! },
    ];
  }, [customScenarios]);

  // 处理场景选择的回调
  const handleScenarioChange = useCallback(
    (value: string) => {
      const selectedScenario = allScenarios.find((s) => s.label === value);
      if (!selectedScenario) return;

      if (selectedScenario.id === "new") {
        setIsCustomScenarioOpen(true);
      } else {
        setBackground(value);
        void saveBackgroundInfo(value);
        toast({
          title: `已选择${selectedScenario.label}场景`,
          duration: 2000,
        });
      }
    },
    [allScenarios, toast],
  );

  // 添加新场景
  const handleAddScenario = useCallback(
    (prompt: string) => {
      const newScenario: CustomScenario = {
        id: `custom_${Date.now()}`,
        label: prompt,
        prompt,
      };
      setCustomScenarios((prev) => [...prev, newScenario]);
      setBackground(prompt);
      void saveBackgroundInfo(prompt);
    },
    [setCustomScenarios],
  );

  const genReplyPrompt = `
  这是一段微信聊天记录上下文：
  <context>
  ${parsedText}
  </context>
  
  场景是：
    <secnario>
  ${background}
    </secnario>
  
  用户聊天风格：
    <style>
  ${style}
    </style>
  
  请代替真人回复，要求：
  - 分辨不出是否 AI 生成
  - 要遵循用户的聊天风格（若有）
  - 直接输出结果（无需解释），以方便用户直接复制粘贴
`;

  // 添加快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault();
        setIsPromptEditorOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsPromptEditorOpen]);

  // 生成新的会话 ID
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // 加载最新的背景信息
  useEffect(() => {
    const loadBackgroundInfo = async () => {
      try {
        const info = await getLatestBackgroundInfo();
        if (info) {
          setBackground(info.content);
        }
      } catch (error) {
        console.error("Failed to load background info:", error);
      }
    };
    void loadBackgroundInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 主要功能区 */}
          <div className="grid grid-cols-1 gap-6">
            {/* 图片上传区 */}
            <SectionCard
              title="上传聊天截图"
              className="bg-white shadow-lg"
              icon={Upload}
            >
              <div className="mb-4 flex items-center justify-between">
                <Select value={background} onValueChange={handleScenarioChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="选择对话场景" />
                  </SelectTrigger>
                  <SelectContent>
                    {allScenarios.map((scenario) =>
                      scenario.id === "new" ? (
                        <div key={scenario.id}>
                          <SelectSeparator className="my-2" />
                          <SelectItem
                            value={scenario.label}
                            className="text-muted-foreground"
                          >
                            {scenario.label}
                          </SelectItem>
                        </div>
                      ) : (
                        <SelectItem
                          key={scenario.id}
                          value={scenario.label}
                          className={
                            scenario.id.startsWith("custom_")
                              ? "text-primary"
                              : ""
                          }
                        >
                          {scenario.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPromptEditorOpen(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    高级设置
                  </Button>
                </div>
              </div>
              <ImageUploadSection
                userId={sessionId}
                analyzing={false}
                error={null}
                onStreamResult={(result) => {
                  setParsedText(result);
                }}
                onFinalResult={async (result) => {
                  setParsedText(result);
                  await saveChatContext(sessionId, result, "");
                  if (background) {
                    void saveBackgroundInfo(background);
                  }
                  toast({
                    title: "图片解析完成",
                    duration: 2000,
                  });
                }}
              />
            </SectionCard>

            {/* 回复生成区 */}
            <SectionCard
              icon={Pen}
              title="生成智能回复"
              className="bg-white shadow-lg"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <DeepseekChat prompt={genReplyPrompt} />
                <ClaudeChat prompt={genReplyPrompt} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <PromptEditorDialog
        imagePrompt={imagePrompt}
        replyPrompt={replyPrompt}
        isOpen={isPromptEditorOpen}
        onOpenChange={setIsPromptEditorOpen}
        onSave={(newImagePrompt, newReplyPrompt) => {
          setImagePrompt(newImagePrompt);
          setReplyPrompt(newReplyPrompt);
          toast({
            title: "提示词已更新",
            duration: 2000,
          });
        }}
      />

      {/* Custom Scenario Dialog */}
      <CustomScenarioDialog
        isOpen={isCustomScenarioOpen}
        onOpenChange={setIsCustomScenarioOpen}
        initialValue=""
        onSave={(prompt) => {
          handleAddScenario(prompt);
          toast({
            title: "场景已保存",
            description: "新场景已添加到列表中",
            duration: 2000,
          });
        }}
      />
    </div>
  );
}
