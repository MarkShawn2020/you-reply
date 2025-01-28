import { env } from '@/env';

interface ClaudeResponse {
  content: Array<{
    text: string;
  }>;
}

/**
 * 调用 Claude API 进行图片分析
 */
export async function callClaudeWithImage(
  imageBuffer: Buffer,
  mimeType: string,
  prompt: string,
) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
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
                data: imageBuffer.toString('base64'),
              },
            },
          ],
        },
      ],
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
  }

  const data = (await response.json()) as ClaudeResponse;
  return data.content[0].text;
}

/**
 * 调用 Claude API 进行文本生成
 */
export async function callClaude(prompt: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
  }

  const data = (await response.json()) as ClaudeResponse;
  return data.content[0].text;
}
