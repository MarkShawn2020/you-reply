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
import { PageContainer } from './_components/page-container';
import {
  Bot,
  Copy,
  MessageCircle,
  Wand2,
  Upload,
  Sparkles,
  Zap,
  Settings2,
  Github,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorAlert } from './_components/error-alert';
import { LoadingSkeleton } from './_components/loading-skeleton';
import { SectionCard } from './_components/section-card';
import { getErrorMessage } from '@/lib/error';
import { FeatureCard } from './_components/feature-card';
import { HistoryDrawer } from './_components/history-drawer';
import { BackgroundInfoEditor } from './_components/background-info-editor';
import { ContactInfoEditor } from './_components/contact-info-editor';
import { PromptEditorDialog } from './_components/prompt-editor-dialog';
import { useAtom } from 'jotai';
import { imagePromptAtom, replyPromptAtom } from '@/store/prompts';

export default function HomePage() {
  const [parsedText, setParsedText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [contactInfo, setContactInfo] = useState<{
    name: string;
    notes: string;
  }>({ name: '', notes: '' });
  const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
  const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);
  const { toast } = useToast();

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
              上传微信聊天截图，快速生成专业、得体的回复。适用于工作沟通、社交聊天、客户服务等多种场景。
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
          <div className="max-w-4xl mx-auto">
            <SectionCard
              icon={Upload}
              title="上传并分析"
              className="bg-white shadow-lg"
            >
              <div className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    上传聊天截图
                  </h3>
                  <ImageUpload
                    onUpload={async (file: File) => {
                      setError(null);
                      setIsAnalyzing(true);
                      setParsedText('');
                      setGeneratedReply('');

                      try {
                        const result = await analyzeImage(file, imagePrompt);
                        setParsedText(result);
                        setSessionId(crypto.randomUUID());
                        
                        // Save chat context
                        await saveChatContext(sessionId, '', '');
                        
                        // Get and save background info
                        const info = await getLatestBackgroundInfo();
                        if (info) {
                          setBackgroundInfo(info);
                          await saveBackgroundInfo(info);
                        }
                      } catch (e) {
                        setError(getErrorMessage(e));
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                  />
                </div>

                {/* Analysis Results */}
                {isAnalyzing ? (
                  <LoadingSkeleton />
                ) : parsedText ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      对话分析结果
                    </h3>
                    <div className="rounded-lg border bg-gray-50 p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">{parsedText}</pre>
                    </div>
                  </div>
                ) : null}

                {/* Generated Reply */}
                {error ? (
                  <ErrorAlert error={error} />
                ) : parsedText ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-blue-500" />
                        生成回复
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          copyToClipboard(generatedReply);
                          toast({
                            title: '已复制到剪贴板',
                            duration: 2000,
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        <span>复制</span>
                      </Button>
                    </div>
                    {isGenerating ? (
                      <LoadingSkeleton />
                    ) : (
                      <Textarea
                        value={generatedReply}
                        onChange={(e) => setGeneratedReply(e.target.value)}
                        className="h-32"
                      />
                    )}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
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
                  </div>
                ) : null}
              </div>
            </SectionCard>
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
        <HistoryDrawer />
        <BackgroundInfoEditor
          initialValue={backgroundInfo}
          onSave={async (value) => {
            if (!sessionId) return;
            await saveBackgroundInfo(value);
            setBackgroundInfo(value);
            toast({
              title: '背景信息已保存',
              duration: 2000,
            });
          }}
        />

        <PromptEditorDialog
          open={isPromptEditorOpen}
          onOpenChange={setIsPromptEditorOpen}
          imagePrompt={imagePrompt}
          replyPrompt={replyPrompt}
          onSave={(newImagePrompt, newReplyPrompt) => {
            setImagePrompt(newImagePrompt);
            setReplyPrompt(newReplyPrompt);
          }}
        />
      </div>
    </div>
  );
}
