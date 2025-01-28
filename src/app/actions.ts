'use server';

import { callClaude, callClaudeWithImage } from '@/lib/claude';
import { prisma } from '@/lib/prisma';
import { IMAGE_ANALYSIS_PROMPT, REPLY_GENERATION_PROMPT } from '@/lib/prompts';

export async function analyzeImage(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const result = await callClaudeWithImage(IMAGE_ANALYSIS_PROMPT, formData);
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('图片解析失败');
  }
}

export async function generateReply(parsedText: string): Promise<any> {
  try {
    // 获取最新的背景信息
    const backgroundInfo = await prisma.backgroundInfo.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    // 将背景信息添加到提示中
    const prompt = REPLY_GENERATION_PROMPT
      .replace('{text}', parsedText)
      .replace(
        '{background}',
        backgroundInfo ? backgroundInfo.content : '未提供补充背景信息',
      );

    const result = await callClaude(prompt);
    return result;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw new Error('回复生成失败');
  }
}

export async function saveBackgroundInfo(content: string): Promise<any> {
  try {
    const backgroundInfo = await prisma.backgroundInfo.create({
      data: { content },
    });
    return backgroundInfo;
  } catch (error) {
    console.error('Error saving background info:', error);
    throw new Error('保存背景信息失败');
  }
}

export async function getLatestBackgroundInfo(): Promise<any> {
  try {
    const backgroundInfo = await prisma.backgroundInfo.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    return backgroundInfo;
  } catch (error) {
    console.error('Error getting background info:', error);
    throw new Error('获取背景信息失败');
  }
}
