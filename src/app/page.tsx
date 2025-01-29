'use client';

import { useEffect, useState } from 'react';
import { ImageUpload } from './_components/image-upload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  analyzeImage,
  generateReply,
  getLatestBackgroundInfo,
  saveBackgroundInfo,
  saveChatContext,
} from './actions';
import { copyToClipboard } from '@/lib/utils';
import {
  Bot,
  Copy,
  MessageCircle,
  Wand2,
  Upload,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorAlert } from './_components/error-alert';
import { LoadingSkeleton } from './_components/loading-skeleton';
import { SectionCard } from './_components/section-card';
import { getErrorMessage } from '@/lib/error';
import { FeatureCard } from './_components/feature-card';
import { HistoryDrawer } from './_components/history-drawer';
import { BackgroundInfoEditor } from './_components/background-info-editor';
import { PromptEditorDialog } from './_components/prompt-editor-dialog';
import { useAtom } from 'jotai';
import { imagePromptAtom, replyPromptAtom } from '@/store/prompts';
import { atomWithStorage } from 'jotai/utils';

const promptEditorOpenAtom = atomWithStorage('promptEditorOpen', false);

export default function HomePage() {
  const [parsedText, setParsedText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
  const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useAtom(promptEditorOpenAtom);
  const { toast } = useToast();

  // 添加快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + Shift + P
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault(); // 防止默认行为
        setIsPromptEditorOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          setBackgroundInfo(info.content);
        }
      } catch (error) {
        console.error('Failed to load background info:', error);
      }
    };
    void loadBackgroundInfo();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              智能微信回复助手
              <span className="block text-blue-600">让社交沟通更轻松自然</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              上传微信聊天截图，快速生成专业、得体的回复。<br/> 适用于工作沟通、社交聊天、客户服务等多种场景。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
                立即开始使用
              </Button>
              <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                了解更多 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              强大功能，智能体验
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              我们提供全方位的智能对话解决方案
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Bot}
              title="智能分析"
              description="自动识别对话场景和语境，生成符合情境的回复"
            />
            <FeatureCard
              icon={Sparkles}
              title="多场景支持"
              description="适用于工作沟通、社交聊天、客户服务等多种场景"
            />
            <FeatureCard
              icon={Zap}
              title="快速响应"
              description="秒级生成回复，提高沟通效率"
            />
          </div>
        </div>
      </section>

      {/* Main Application Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Advanced Settings Card */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">智能回复助手</h2>
              <HistoryDrawer />
            </div>

            {/* Step 1: Chat Scenario Selection */}
            <SectionCard
              icon={MessageCircle}
              title="步骤 1: 选择聊天场景"
              className="bg-white shadow-lg"
            >
              <div className="space-y-6">
                {/* Predefined Scenarios */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">预设场景</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'newyear', label: '拜年祝福', prompt: '这是一个拜年场景，需要礼貌热情的祝福语' },
                      { id: 'work', label: '工作沟通', prompt: '这是一个工作沟通场景，需要专业简洁的回复' },
                      { id: 'friend', label: '朋友聊天', prompt: '这是一个朋友聊天场景，需要轻松自然的对话' },
                      { id: 'customer', label: '客户服务', prompt: '这是一个客户服务场景，需要耐心周到的回应' },
                      { id: 'family', label: '家人互动', prompt: '这是一个家人互动场景，需要温暖亲切的交流' },
                      { id: 'custom', label: '自定义场景', prompt: '请在下方详细说明场景' },
                    ].map((scenario) => (
                      <Button
                        key={scenario.id}
                        variant={backgroundInfo === scenario.prompt ? 'default' : 'outline'}
                        className="h-auto py-4 px-4 flex flex-col gap-2"
                        onClick={async () => {
                          setBackgroundInfo(scenario.prompt);
                          void saveBackgroundInfo(scenario.prompt);
                          toast({
                            title: `已选择${scenario.label}场景`,
                            duration: 2000,
                          });
                        }}
                      >
                        <span className="text-sm font-medium">{scenario.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background Info Editor */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">场景详细说明</h3>
                  <BackgroundInfoEditor
                    initialValue={backgroundInfo}
                    onSave={async (value) => {
                      if (!sessionId) return;
                      void saveBackgroundInfo(value);
                      setBackgroundInfo(value);
                      toast({
                        title: '场景信息已保存',
                        duration: 2000,
                      });
                    }}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Step 2: Image Upload */}
            <SectionCard
              icon={Upload}
              title="步骤 2: 上传聊天记录"
              className="bg-white shadow-lg"
            >
              <div className="space-y-4">
                <ImageUpload
                  userId={sessionId}
                  isAnalyzing={isAnalyzing}
                  error={error}
                  onStreamResult={(result) => {
                    setParsedText(result);
                  }}
                  onFinalResult={async (result) => {
                    setParsedText(result);
                    
                    // Save chat context
                    await saveChatContext(sessionId, result, '');
                    
                    // Save background info if not already set
                    if (backgroundInfo) {
                      void saveBackgroundInfo(backgroundInfo);
                    }

                    toast({
                      title: '图片解析完成',
                      duration: 2000,
                    });
                  }}
                />
              </div>
            </SectionCard>

            {/* Step 3: Generate Reply */}
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
                    {isGenerating ? (
                      <LoadingSkeleton />
                    ) : (
                      <div className="space-y-4">
                        <Textarea
                          value={generatedReply}
                          onChange={(e) => setGeneratedReply(e.target.value)}
                          className="h-32"
                          placeholder="点击下方按钮生成回复..."
                        />
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                            disabled={isGenerating}
                            onClick={async () => {
                              if (!sessionId) return;
                              setError(null);
                              setIsGenerating(true);
                              try {
                                const reply = await generateReply(parsedText, sessionId, replyPrompt);
                                setGeneratedReply(reply);
                              } catch (e) {
                                setError(getErrorMessage(e));
                              } finally {
                                setIsGenerating(false);
                              }
                            }}
                          >
                            {isGenerating ? '生成中...' : '生成回复'}
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              void copyToClipboard(generatedReply)
                              .then(() => {
                                toast({
                                  title: '已复制到剪贴板',
                                  duration: 2000,
                                });
                              })
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            <span>复制</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>请先完成步骤 1 和步骤 2</p>
                  </div>
                )}
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
