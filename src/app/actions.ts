'use server';

import { callClaude, callClaudeWithImage } from '@/lib/claude';
import { callDeepSeek } from '@/lib/deepseek';
import { prisma } from '@/lib/prisma';
import { IMAGE_ANALYSIS_PROMPT, REPLY_GENERATION_PROMPT } from '@/lib/prompts';

export async function analyzeImage(
  file: File,
  prompt: string,
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const result = await callClaudeWithImage(prompt, formData);
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('图片解析失败');
  }
}

export async function generateReply(
  parsedText: string,
  sessionId: string,
  prompt: string,
): Promise<string> {
  try {
    // 获取最新的背景信息和聊天对象信息
    const [backgroundInfo, chatContext] = await Promise.all([
      prisma.backgroundInfo.findFirst({
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.chatContext.findFirst({
        where: { sessionId },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // 将背景信息和聊天对象信息添加到提示中
    const finalPrompt = prompt
      .replace('{text}', parsedText)
      .replace(
        '{background}',
        `${backgroundInfo ? `背景信息：${backgroundInfo.content}\n` : ''}${
          chatContext
            ? `聊天对象：${chatContext.contactName}\n备注：${chatContext.contactNotes}`
            : '未提供聊天对象信息'
        }`,
      );

    const result = await callClaude(finalPrompt);
    return result;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw new Error('回复生成失败');
  }
}

export async function saveBackgroundInfo(content: string) {
  try {
    const result = await prisma.backgroundInfo.create({
      data: { content },
    });
    return result;
  } catch (error) {
    console.error('Error saving background info:', error);
    throw error;
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

export async function saveChatContext(
  sessionId: string,
  contactName: string,
  contactNotes: string,
): Promise<any> {
  try {
    const chatContext = await prisma.chatContext.create({
      data: {
        sessionId,
        contactName,
        contactNotes,
      },
    });
    return chatContext;
  } catch (error) {
    console.error('Error saving chat context:', error);
    throw new Error('保存聊天对象信息失败');
  }
}

export async function getLatestChatContext(sessionId: string): Promise<any> {
  try {
    const chatContext = await prisma.chatContext.findFirst({
      where: { sessionId },
      orderBy: { updatedAt: 'desc' },
    });
    return chatContext;
  } catch (error) {
    console.error('Error getting chat context:', error);
    throw new Error('获取聊天对象信息失败');
  }
}
