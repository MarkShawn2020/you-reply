import { Button } from "./ui/button";
import { Check, Github } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">完全免费，开源可商用</h2>
          <p className="text-lg text-gray-600">
            无限制使用，开源代码，欢迎参与贡献
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-2xl rounded-2xl border border-blue-600 bg-white p-8 shadow-lg">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
              开源项目
            </div>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">免费版</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">¥0</span>
                <span className="ml-2 text-gray-600">永久免费</span>
              </div>
              <p className="mt-2 text-gray-600">适合所有用户，无任何限制</p>
            </div>
            <ul className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>无限次使用</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>所有场景模板</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>完整源码访问</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>可商业使用</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>社区支持</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Check className="h-5 w-5 text-blue-600" />
                <span>持续更新</span>
              </li>
            </ul>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                <a href="/app">
                  立即使用
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href="https://github.com/MarkShawn2020/you-reply" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  查看源码
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
