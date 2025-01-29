import { createAnthropic } from '@ai-sdk/anthropic';
import { fetch, ProxyAgent } from 'undici';


/**
 * 创建支持代理的 Anthropic 客户端
 * @param proxyUrl - HTTP 代理 URL，如 http://127.0.0.1:7890
 */
export function createAnthropicWithProxy(proxyUrl: string) {
    // 创建代理 agent
const dispatcher = new ProxyAgent(proxyUrl)

    
    // 创建支持代理的 Anthropic 客户端
    return createAnthropic({
        // @ts-ignore
        fetch: async (req, options) => {
            // @ts-ignore
            let res =  await fetch(req, {
              ...options, dispatcher
            });
            return res;
          } 
    });
}
