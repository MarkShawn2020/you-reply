'use client';

import { useState } from 'react';
import { ImageUpload } from './_components/image-upload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { analyzeImage, generateReply } from './actions';
import { copyToClipboard } from '@/lib/utils';

export default function HomePage() {
  const [parsedText, setParsedText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      const result = await analyzeImage(file);
      setParsedText(result);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      alert('图片分析失败，请重试');
    }
  };

  const handleGenerateReply = async () => {
    if (!parsedText) {
      alert('请先上传并解析图片');
      return;
    }

    try {
      setIsGenerating(true);
      const reply = await generateReply(parsedText);
      setGeneratedReply(reply);
    } catch (error) {
      console.error('Failed to generate reply:', error);
      alert('生成回复失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) {
      alert('请先生成回复');
      return;
    }

    const success = await copyToClipboard(generatedReply);
    if (success) {
      alert('已复制到剪贴板');
    } else {
      alert('复制失败，请手动复制');
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-center text-2xl font-bold">微信回复助手</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* 左侧：上传和解析区域 */}
        <div className="space-y-4">
          <ImageUpload onImageUpload={handleImageUpload} />
          
          <Card className="p-4">
            <h2 className="mb-2 text-lg font-semibold">解析结果</h2>
            <Textarea
              value={parsedText}
              placeholder="等待图片解析..."
              className="min-h-[200px]"
              readOnly
            />
          </Card>
        </div>

        {/* 右侧：回复生成区域 */}
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="mb-2 text-lg font-semibold">生成的回复</h2>
            <Textarea
              value={generatedReply}
              placeholder="点击生成回复按钮开始生成..."
              className="mb-4 min-h-[200px]"
              readOnly
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCopy}
                disabled={!generatedReply}
              >
                复制
              </Button>
              <Button
                onClick={handleGenerateReply}
                disabled={!parsedText || isGenerating}
              >
                {isGenerating ? '生成中...' : '生成回复'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
