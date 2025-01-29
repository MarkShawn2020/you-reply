import { anthropic } from '@ai-sdk/anthropic';

import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    prompt,
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
