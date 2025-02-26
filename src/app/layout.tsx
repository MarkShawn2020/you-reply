import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '~/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Github, MessageCircle, History } from 'lucide-react';
import Link from 'next/link';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { HistoryDrawer } from '~/components/history-drawer';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

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
  const isAppPage = typeof window !== 'undefined' && window.location.pathname === '/app';

  return (
    <html lang="zh-CN" className={cn('antialiased', GeistSans.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="flex min-h-screen flex-col">
          {/* 导航栏 */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 transition-colors hover:opacity-80">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    微信回复助手
                  </span>
                  <Badge className={'hidden xs:block'} variant={"secondary"}>AI 超级川</Badge>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  {!isAppPage ? (
                    <>
                      <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">功能特点</Link>
                      <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">价格方案</Link>
                      <Link href="/#sponsor" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">友情赞助</Link>
                    </>
                  ) : null}
                </nav>
              </div>
              <div className="flex items-center gap-4">

                  <HistoryDrawer>
                    <Button variant="outline" size="sm" className="gap-2">
                      <History className="h-4 w-4" />
                      <span className='hidden xs:block'>历史记录</span>
                    </Button>
                  </HistoryDrawer>

                {!isAppPage && (
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600" asChild>
                    <Link href="/app">开始使用</Link>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="flex-1">{children}</main>

          {/* 页脚 */}
          <footer className="w-full border-t bg-white/80 backdrop-blur-md py-8">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">关于本产品</h3>
                  <p className="text-sm text-gray-600">微信回复助手致力于提供智能、专业的社交对话解决方案，让沟通更轻松自然。</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">快速链接</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="#features" className="text-gray-600 hover:text-gray-900">功能特点</Link></li>
                    <li><Link href="#pricing" className="text-gray-600 hover:text-gray-900">价格方案</Link></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">支持</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="https://github.com/MarkShawn2020/you-reply/issues" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">问题反馈</Link></li>
                    <li><Link href="https://github.com/MarkShawn2020/you-reply" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">加入开发</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600 ">
                <p className="mb-4 inline-flex items-center gap-1"> 
                <MessageCircle className="h-4 w-4" />
                  {new Date().getFullYear()} 微信回复助手                     <HoverCard openDelay={100}>
                      <HoverCardTrigger asChild>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                          
                          <span className='underline underline-offset-2'>@AI超级川</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-[320px] p-0">
                        <img
                          src="/images/wxmp.png"
                          alt="AI超级川 公众号"
                          className="rounded-md"
                          width={320}
                          height={320}
                        />
                      </HoverCardContent>
                    </HoverCard>. 保留所有权利.</p>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  <span className="text-gray-500">Powered by</span>
                  <a href="https://www.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">DeepSeek</a>
                  <a href="https://codeium.com/windsurf/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Windsurf</a>
                  <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Claude</a>
                  <a href="https://ai.baidu.com/tech/ocr" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Baidu OCR</a>
                  <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Next.js</a>
                  <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">shadcn/ui</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
