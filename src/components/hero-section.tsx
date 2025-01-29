import { Button } from "~/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            智能微信回复助手
            <span className="block text-blue-600">让社交沟通更轻松自然</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            上传微信聊天截图，快速生成专业、得体的回复。
            <br /> 适用于工作沟通、社交聊天、客户服务等多种场景。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
            >
              立即开始使用
            </Button>
            <a
              href="#how-it-works"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              了解更多 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
