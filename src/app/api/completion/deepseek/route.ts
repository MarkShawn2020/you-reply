import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    prompt,
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
