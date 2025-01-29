import { createAnthropic } from '@ai-sdk/anthropic';
import { HttpsProxyAgent } from 'https-proxy-agent';
import nodeFetch from 'node-fetch';
import type { RequestInfo, RequestInit, Response } from 'node-fetch';

/**
 * 创建支持代理的 Anthropic 客户端
 * @param proxyUrl - HTTP 代理 URL，如 http://127.0.0.1:7890
 */
export function createAnthropicWithProxy(proxyUrl: string) {
    // 创建代理 agent
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    
    // 创建自定义 fetch 实现
    const fetchWithProxy = (url: RequestInfo, init?: RequestInit): Promise<Response> => {
        return nodeFetch(url, {
            ...init,
            agent: proxyAgent,
        });
    };
    
    // 创建支持代理的 Anthropic 客户端
    return createAnthropic({
        fetch: fetchWithProxy as unknown as typeof fetch,
    });
}
