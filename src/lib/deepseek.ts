import OpenAI from 'openai';
import { env } from '~/env';

if (!env.DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY environment variable');
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: env.DEEPSEEK_API_KEY,
});

/**
 * 调用 DeepSeek API 生成回复
 */
export async function callDeepSeek(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的微信回复助手，擅长生成自然、有温度的回复。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7, // 增加一些随机性，让回复更自然
      max_tokens: 1000,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('Invalid response from DeepSeek API');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to call DeepSeek API');
  }
}
