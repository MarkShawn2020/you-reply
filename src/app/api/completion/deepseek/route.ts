import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  // const lastMessage = messages[messages.length - 1];

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    messages
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
