import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '~/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export const metadata: Metadata = {
  title: '微信回复助手 - 智能生成合适的回复',
  description:
    '上传微信聊天截图，快速生成得体、自然的回复。支持多种场景，包括工作交流、社交聊天等。',
  openGraph: {
    title: '微信回复助手 - 智能生成合适的回复',
    description:
      '上传微信聊天截图，快速生成得体、自然的回复。支持多种场景，包括工作交流、社交聊天等。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={cn('antialiased', GeistSans.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-gray-50">
        <div className="flex min-h-screen flex-col">
          {/* 导航栏 */}
          <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container flex h-14 items-center justify-between">
              <div className="flex items-center gap-6">
                <a href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold">微信回复助手</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
              </div>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="flex-1">{children}</main>

          {/* 页脚 */}
          <footer className="w-full border-t bg-white">
            <div className="container py-8">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">关于我们</h3>
                  <p className="text-sm text-gray-500">
                    微信回复助手是一款智能工具，帮助你快速生成得体、自然的回复。
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">使用场景</h3>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>工作沟通</li>
                    <li>社交聊天</li>
                    <li>客户服务</li>
                    <li>日常交流</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">技术支持</h3>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>由 Claude API 提供支持</li>
                    <li>基于 Next.js 构建</li>
                    <li>开源项目</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between border-t pt-8 text-sm text-gray-500">
                <p> {new Date().getFullYear()} 微信回复助手</p>
                <p>
                  由{' '}
                  <a
                    href="https://www.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-gray-900"
                  >
                    Claude API
                  </a>{' '}
                  提供支持
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
