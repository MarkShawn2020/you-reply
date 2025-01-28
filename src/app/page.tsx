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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorAlert } from './_components/error-alert';
import { LoadingSkeleton } from './_components/loading-skeleton';
import { SectionCard } from './_components/section-card';
import { getErrorMessage } from '@/lib/error';
import { FeatureCard } from './_components/feature-card';
import { HistoryDrawer } from './_components/history-drawer';
import { BackgroundInfoDialog } from './_components/background-info-dialog';

export default function HomePage() {
  const [parsedText, setParsedText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const { toast } = useToast();

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
      const result = await analyzeImage(file);
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
      const reply = await generateReply(parsedText);
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

  const handleSaveBackgroundInfo = async (content: string) => {
    try {
      await saveBackgroundInfo(content);
      setBackgroundInfo(content);
    } catch (error) {
      console.error('Failed to save background info:', error);
      throw error;
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              微信回复助手
            </h1>
            <HistoryDrawer />
          </div>
          <p className="mt-2 text-lg text-gray-600">
            上传微信聊天截图，快速生成合适的回复
          </p>
        </div>

        {/* 功能特点 */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Upload}
            title="轻松上传"
            description="支持拖拽上传聊天截图，自动识别对话内容"
          />
          <FeatureCard
            icon={Sparkles}
            title="智能分析"
            description="基于 Claude API 的强大分析能力，准确理解对话场景"
          />
          <FeatureCard
            icon={Zap}
            title="快速生成"
            description="一键生成得体、自然的回复，节省思考时间"
          />
        </div>

        {error && <ErrorAlert message={error} className="mb-6" />}

        <div className="grid gap-6 md:grid-cols-2">
          {/* 左侧：上传和解析区域 */}
          <div className="space-y-6">
            <ImageUpload
              onImageUpload={handleImageUpload}
              className="bg-white shadow-sm"
            />
          </div>

          {/* 右侧：回复生成区域 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">生成设置</h2>
              <BackgroundInfoDialog
                initialContent={backgroundInfo}
                onSave={handleSaveBackgroundInfo}
              />
            </div>

            <SectionCard icon={Bot} title="解析结果">
              {isAnalyzing ? (
                <LoadingSkeleton progressText="正在解析图片..." />
              ) : (
                <div className="space-y-3">
                  <Textarea
                    value={parsedText}
                    onChange={(e) => setParsedText(e.target.value)}
                    placeholder="等待图片解析..."
                    className="min-h-[200px] resize-none"
                  />
                  <div className="text-sm text-gray-500">
                    提示：可以编辑解析结果以修正或补充内容
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard icon={MessageCircle} title="生成的回复">
              {isGenerating ? (
                <LoadingSkeleton
                  showProgress
                  progressText="正在生成回复..."
                  progressValue={33}
                />
              ) : (
                <Textarea
                  value={generatedReply}
                  placeholder="点击生成回复按钮开始生成..."
                  className="min-h-[200px] resize-none"
                  readOnly
                />
              )}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!generatedReply || isGenerating}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  复制
                </Button>
                <Button
                  onClick={handleGenerateReply}
                  disabled={!parsedText || isGenerating}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGenerating ? '生成中...' : '生成回复'}
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
