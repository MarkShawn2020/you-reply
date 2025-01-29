/**
 * Claude API 客户端
 * 提供与 Claude API 交互的功能，支持文本生成和图片分析
 * @module
 */

import { env } from '@/env';
import Anthropic from '@anthropic-ai/sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { Agent } from 'http';

/**
 * 消息内容块的类型定义
 */
interface MessageContent {
  /** 内容类型 */
  type: string;
  /** 文本内容，仅在 type 为 'text' 时存在 */
  text?: string;
}

/**
 * API 响应消息的类型定义
 */
interface Message {
  /** 消息内容数组 */
  content: MessageContent[];
}

/**
 * 支持的图片类型
 */
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

/**
 * Claude API 配置
 */
const API_CONFIG = {
  model: 'claude-3-opus-20240229',
  maxTokens: 1000,
} as const;

// 创建 Anthropic 客户端实例
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
  ...(env.HTTP_PROXY
    ? {
        httpAgent: new HttpsProxyAgent(env.HTTP_PROXY) as Agent,
      }
    : {}),
});

/**
 * 从消息中提取文本内容
 * @param message - API 响应消息
 * @returns 提取的文本内容
 * @throws {Error} 如果消息中没有文本内容
 */
function extractTextFromMessage(message: Message): string {
  const textBlock = message.content?.find(
    (block: MessageContent): block is { type: 'text'; text: string } =>
      block.type === 'text' && typeof block.text === 'string'
  );
  
  if (!textBlock) {
    throw new Error('No text content in response');
  }
  
  return textBlock.text;
}

/**
 * 验证图片类型是否支持
 * @param mimeType - MIME 类型
 * @returns 是否为支持的图片类型
 */
function isSupportedImageType(mimeType: string): mimeType is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType as SupportedImageType);
}

/**
 * 调用 Claude API 进行图片分析
 * @param prompt - 提示文本
 * @param formData - 包含图片的表单数据
 * @returns 分析结果文本
 * @throws {Error} 如果图片格式不支持或 API 调用失败
 */
export async function callClaudeWithImage(prompt: string, formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;

  if (!isSupportedImageType(mimeType)) {
    throw new Error('Unsupported image type. Only JPEG, PNG, GIF and WebP are supported.');
  }

  try {
    const message = await anthropic.messages.create({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: buffer.toString('base64'),
              },
            },
          ],
        },
      ],
    });

    return extractTextFromMessage(message as Message);
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
  }
}

/**
 * 调用 Claude API 进行文本生成
 * @param prompt - 提示文本
 * @returns 生成的文本
 * @throws {Error} 如果 API 调用失败
 */
export async function callClaude(prompt: string) {
  console.log('calling Claude with prompt:', prompt);

  try {
    const message = await anthropic.messages.create({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    return extractTextFromMessage(message as Message);
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
  }
}
