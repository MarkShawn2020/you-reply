import { anthropic } from '@ai-sdk/anthropic';

import { streamText } from 'ai';

export async function POST(req: Request) {

    const { prompt } = await req.json();
    // console.log({prompt});
    
    const result = streamText({
      model: anthropic('claude-3-5-sonnet-latest'),
      prompt,
    });
    // console.log({result});
  
    return result.toDataStreamResponse();
}
