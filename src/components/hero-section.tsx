import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ProductShowcase from "./rotate-product";

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            让微信回复更智能、更自然
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            上传微信聊天截图，快速生成得体、自然的回复。支持多种场景，包括工作交流、社交聊天等。让AI帮你写出最合适的回复。
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
              <Link href="/app">
                立即开始使用
              </Link>
            </Button>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              了解更多 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="overflow-hidden">
              <ProductShowcase/>
              {/* <Image
                src="/images/hero.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[360px] h-auto"
                priority
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
