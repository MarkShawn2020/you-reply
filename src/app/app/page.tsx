"use client";

import { useToast } from "@/hooks/use-toast";
import { imagePromptAtom, replyPromptAtom } from "@/store/prompts";
import { customScenariosAtom } from "@/store/custom-scenario";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ChatScenarioSection } from "~/components/chatScenarioSection";
import { GenReplySection } from "~/components/genReplySection";
import { ImageUploadSection } from "~/components/imageUploadSection";
import { PromptEditorDialog } from "~/components/prompt-editor-dialog";
import { CustomScenarioDialog } from "~/components/custom-scenario-dialog";
import { ScenarioSelect } from "~/components/scenario-select";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { ClaudeChat } from "~/components/claude-chat";
import { SectionCard } from "~/components/section-card";
import { Button } from "~/components/ui/button";
import { Pen, Upload, Trash2, MoreVertical } from "lucide-react";
import {
  getLatestBackgroundInfo,
  saveBackgroundInfo,
  saveChatContext,
} from "../actions";
import { DeepseekChat } from "~/components/deepseek-chat";


export default function AppPage() {
  const [parsedText, setParsedText] = useState("");
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
  const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
  const [customScenarios, setCustomScenarios] = useAtom(customScenariosAtom);
  const { toast } = useToast();

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

  // 添加新场景
  const handleAddScenario = useCallback((prompt: string) => {
    const newScenario = {
      id: `custom_${Date.now()}`,
      label: prompt,
      prompt,
    };
    setCustomScenarios((prev) => [...prev, newScenario]);
    setBackground(prompt);
    void saveBackgroundInfo(prompt);
  }, [setCustomScenarios]);

  // 删除场景
  const handleDeleteScenario = useCallback((scenarioId: string) => {
    setCustomScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
    toast({
      title: "场景已删除",
      duration: 2000,
    });
  }, [setCustomScenarios, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 主要功能区 */}
          <div className="grid grid-cols-1 gap-6">
            {/* 图片上传区 */}
            <SectionCard
              title="Step 1. 上传聊天截图"
              className="bg-white shadow-lg"
              icon={Upload}
              action={
                <ScenarioSelect
                  value={background}
                  customScenarios={customScenarios}
                  onValueChange={(value) => {
                    setBackground(value);
                    void saveBackgroundInfo(value);
                  }}
                  onNewScenario={handleAddScenario}
                  onDeleteScenario={handleDeleteScenario}
                />
              }
            >
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
              title="Step 2. 生成智能回复"
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
    </div>
  );
}
