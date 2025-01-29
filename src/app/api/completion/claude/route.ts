import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { createAnthropicWithProxy } from './utils';

export async function POST(req: Request) {
    const { prompt } = await req.json();
    
    // 获取代理配置
    const httpProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    
    // 创建 Anthropic 客户端（带代理支持）
    const anthropicClient = httpProxy
        ? createAnthropicWithProxy(httpProxy)
        : anthropic;
    
    const result = streamText({
        model: anthropicClient('claude-3-sonnet-20240229'),
        prompt,
    });
  
    return result.toDataStreamResponse();
}
