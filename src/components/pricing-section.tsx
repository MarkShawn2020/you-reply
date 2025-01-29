import { Button } from "./ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "免费版",
    price: "¥0",
    description: "适合个人用户体验",
    features: [
      "每天 10 次免费使用",
      "基础场景模板",
      "标准响应速度",
      "社区支持"
    ],
    buttonText: "开始使用",
    href: "/app",
    popular: false
  },
  {
    name: "专业版",
    price: "开源免费",
    description: "适合开发者和企业用户",
    features: [
      "无限次使用",
      "自定义场景模板",
      "优先响应速度",
      "源码级访问",
      "技术支持",
      "商业授权"
    ],
    buttonText: "部署私有版",
    href: "https://github.com/MarkShawn2020/you-reply",
    popular: true
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">简单透明的价格方案</h2>
          <p className="text-lg text-gray-600">
            选择最适合您需求的方案，立即开始使用智能回复助手
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.popular ? "border-blue-600 shadow-lg" : "border-gray-200"
              } bg-white p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                  推荐方案
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600">
                    <Check className="h-5 w-5 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <a href={plan.href} target={plan.href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer">
                  {plan.buttonText}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
