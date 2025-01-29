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

  const handleImageUpload = async (file: File) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      const result = await analyzeImage(file, imagePrompt);
      setParsedText(result);
      toast({
        title: '图片解析成功',
        description: '已成功解析聊天记录，可以开始生成回复',
      });
    } catch (error) {
      console.error('Failed to analyze image:', error);
      setError(getErrorMessage(error));
      toast({
        variant: 'destructive',
        title: '图片解析失败',
        description: '请确保上传的是微信聊天截图',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!parsedText) {
      toast({
        variant: 'destructive',
        title: '无法生成回复',
        description: '请先上传并解析图片',
      });
      return;
    }

    try {
      setError(null);
      setIsGenerating(true);
      const reply = await generateReply(parsedText, sessionId, replyPrompt);
      setGeneratedReply(reply);
      toast({
        title: '回复生成成功',
        description: '已生成合适的回复内容',
      });
    } catch (error) {
      console.error('Failed to generate reply:', error);
      setError(getErrorMessage(error));
      toast({
        variant: 'destructive',
        title: '生成回复失败',
        description: '请稍后重试',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContactInfo = async (name: string, notes: string) => {
    try {
      await saveChatContext(sessionId, name, notes);
      setContactInfo({ name, notes });
    } catch (error) {
      console.error('Failed to save contact info:', error);
      throw error;
    }
  };

  const handleSaveBackgroundInfo = async (content: string) => {
    try {
      await saveBackgroundInfo(content);
      setBackgroundInfo(content);
    } catch (error) {
      console.error('Failed to save background info:', error);
      throw error;
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) {
      toast({
        variant: 'destructive',
        title: '无法复制',
        description: '请先生成回复',
      });
      return;
    }

    const success = await copyToClipboard(generatedReply);
    if (success) {
      toast({
        title: '复制成功',
        description: '回复内容已复制到剪贴板',
      });
    } else {
      toast({
        variant: 'destructive',
        title: '复制失败',
        description: '请手动复制文本',
      });
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl space-y-8 p-8">

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">微信回复助手</h1>
            <div className="flex items-center gap-2">
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

          <div className="flex flex-col gap-4">
          <BackgroundInfoEditor
            initialValue={backgroundInfo}
            onSave={handleSaveBackgroundInfo}
          />
        </div>

          <div className="grid gap-6">
            <SectionCard icon={Upload} title="输入聊天记录">
              <div className="space-y-4">
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  error={error}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </SectionCard>

            {parsedText && (
              <>
                <SectionCard icon={MessageCircle} title="解析结果">
                  <Textarea
                    value={parsedText}
                    onChange={(e) => setParsedText(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="解析的聊天记录将显示在这里..."
                  />
                </SectionCard>

                <SectionCard
                  icon={Wand2}
                  title="生成的回复"
                  action={
                    <div className="flex items-center gap-2">
                                           {generatedReply && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          复制
                        </Button>
                      )}
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleGenerateReply}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            生成回复
                          </>
                        )}
                      </Button>
 
                    </div>
                  }
                >
                  {isGenerating ? (
                    <LoadingSkeleton />
                  ) : (
                    <Textarea
                      value={generatedReply}
                      onChange={(e) => setGeneratedReply(e.target.value)}
                      className="min-h-[200px]"
                      placeholder="生成的回复将显示在这里..."
                    />
                  )}
                </SectionCard>
              </>
            )}

            {error && <ErrorAlert error={error} />}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
