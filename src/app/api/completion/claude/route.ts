import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function POST(req: Request) {
    const { prompt } = await req.json();
    
    // 从环境变量获取代理配置
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    const options: any = {};
    
    if (proxyUrl) {
        options.httpAgent = new HttpsProxyAgent(proxyUrl);
    }
    
    const result = streamText({
        model: anthropic('claude-3-5-sonnet-latest', options),
        prompt,
    });
  
    return result.toDataStreamResponse();
}
