import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '~/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Github, MessageCircle } from 'lucide-react';

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
      <body className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="flex min-h-screen flex-col">
          {/* 导航栏 */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-6">
                <a href="/" className="flex items-center gap-3 transition-colors hover:opacity-80">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">微信回复助手</span>
                </a>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">功能特点</a>
                  <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">使用方法</a>
                  <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">价格方案</a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
                  开始使用
                </Button>
              </div>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="flex-1">{children}</main>

          {/* 页脚 */}
          <footer className="w-full border-t bg-white/80 backdrop-blur-md py-8">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">关于我们</h3>
                  <p className="text-sm text-gray-600">微信回复助手致力于提供智能、专业的社交对话解决方案，让沟通更轻松自然。</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">快速链接</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#features" className="text-gray-600 hover:text-gray-900">功能特点</a></li>
                    <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">价格方案</a></li>
                    <li><a href="#faq" className="text-gray-600 hover:text-gray-900">常见问题</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">联系我们</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="mailto:support@example.com" className="text-gray-600 hover:text-gray-900">客户支持</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-gray-900">商务合作</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">关注我们</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      <span className="sr-only">微信公众号</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,13.5A1.5,1.5 0 0,1 7,12A1.5,1.5 0 0,1 8.5,10.5A1.5,1.5 0 0,1 10,12A1.5,1.5 0 0,1 8.5,13.5M15.5,13.5A1.5,1.5 0 0,1 14,12A1.5,1.5 0 0,1 15.5,10.5A1.5,1.5 0 0,1 17,12A1.5,1.5 0 0,1 15.5,13.5M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
                <p> {new Date().getFullYear()} 微信回复助手. 保留所有权利.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
