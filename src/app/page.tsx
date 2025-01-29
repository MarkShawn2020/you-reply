"use client";

import { useToast } from "@/hooks/use-toast";
import { imagePromptAtom, replyPromptAtom } from "@/store/prompts";
import { useEffect, useState } from "react";
import { ChatScenarioSection } from "~/components/chatScenarioSection";
import FeaturedSection from "~/components/featured-section";
import { GenReplySection } from "~/components/genReplySection";
import HeroSection from "~/components/hero-section";
import { ImageUploadSection } from "~/components/imageUploadSection";
import { HistoryDrawer } from "~/components/history-drawer";
import { PromptEditorDialog } from "~/components/prompt-editor-dialog";
import {
  getLatestBackgroundInfo,
  saveBackgroundInfo,
  saveChatContext,
} from "./actions";
import { atomWithStorage } from "jotai/utils";
import { Button } from "~/components/ui/button";
import { useAtom } from "jotai/react";
import { DeepseekChat } from "~/components/deepseek-chat";
import { ClaudeChat } from "~/components/claude-chat";
import { SectionCard } from "~/components/section-card";
import { Pen } from "lucide-react";
import PricingSection from "~/components/pricing-section";
import DonationSection from "~/components/donation-section";

const promptEditorOpenAtom = atomWithStorage("promptEditorOpen", false);

export default function HomePage() {
  const [parsedText, setParsedText] = useState("");
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
  const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
  const [isPromptEditorOpen, setIsPromptEditorOpen] =
    useAtom(promptEditorOpenAtom);
  const { toast } = useToast();

  const genReplyPrompt = `
  这是一段微信聊天记录上下文：
  <context>
  ${parsedText}
  </context>
  
  场景是：
    <background>
  ${background}
    </background>
  
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
      // Check for Cmd/Ctrl + Shift + P
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault(); // 防止默认行为
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
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features">
        <FeaturedSection />
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Donation Section */}
      <DonationSection />

      {/* Main Application Section */}
      <section id="upload" className="bg-gray-50 py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Advanced Settings Card */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                智能回复助手
              </h2>
              <HistoryDrawer />
            </div>

            {/* Step 1: Chat Scenario Selection */}
            <div id="how-it-works">
              <ChatScenarioSection
                callbackfn={(scenario) => (
                  <Button
                    key={scenario.id}
                    variant={
                      background === scenario.prompt ? "default" : "outline"
                    }
                    className="flex h-auto flex-col gap-2 px-4 py-4"
                    onClick={async () => {
                      setBackground(scenario.prompt);
                      void saveBackgroundInfo(scenario.prompt);
                      toast({
                        title: `已选择${scenario.label}场景`,
                        duration: 2000,
                      });
                    }}
                  >
                    <span className="text-sm font-medium">{scenario.label}</span>
                  </Button>
                )}
                initialValue={background}
                onSave={async (value) => {
                  if (!sessionId) return;
                  void saveBackgroundInfo(value);
                  setBackground(value);
                  toast({
                    title: "场景信息已保存",
                    duration: 2000,
                  });
                }}
              />
            </div>

            {/* Step 2: Image Upload */}
            <ImageUploadSection
              userId={sessionId}
              analyzing={false}
              error={null}
              onStreamResult={(result) => {
                setParsedText(result);
              }}
              onFinalResult={async (result) => {
                setParsedText(result);

                // Save chat context
                await saveChatContext(sessionId, result, "");

                // Save background info if not already set
                if (background) {
                  void saveBackgroundInfo(background);
                }

                toast({
                  title: "图片解析完成",
                  duration: 2000,
                });
              }}
            />

            {/* Step 3: Generate Reply */}
            <SectionCard
              icon={Pen}
              title="步骤 3: 生成智能回复"
              className="bg-white shadow-lg"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <DeepseekChat prompt={genReplyPrompt} />
                <ClaudeChat prompt={genReplyPrompt} />
              </div>
            </SectionCard>
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      <PromptEditorDialog
        imagePrompt={imagePrompt}
        replyPrompt={replyPrompt}
        isOpen={isPromptEditorOpen}
        onOpenChange={setIsPromptEditorOpen}
        onSave={(newImagePrompt, newReplyPrompt) => {
          setImagePrompt(newImagePrompt);
          setReplyPrompt(newReplyPrompt);
        }}
      />
    </div>
  );
}
