'use server';

import { callClaude, callClaudeWithImage } from '@/lib/claude';
import { IMAGE_ANALYSIS_PROMPT, REPLY_GENERATION_PROMPT } from '@/lib/prompts';

export async function analyzeImage(file: File) {
  try {
    // 1. 将文件转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. 调用 Claude API 进行图片分析
    const result = await callClaudeWithImage(
      buffer,
      file.type,
      IMAGE_ANALYSIS_PROMPT,
    );

    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export async function generateReply(parsedText: string) {
  try {
    const prompt = REPLY_GENERATION_PROMPT.replace('{text}', parsedText);
    const result = await callClaude(prompt);
    return result;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
}
