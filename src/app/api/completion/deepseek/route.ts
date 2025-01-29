import { fireworks } from '@ai-sdk/fireworks';
import { generateText, streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';


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

