import { Bot, Sparkles, Zap } from "lucide-react";
import { FeatureCard } from "~/components/feature-card";

export default function FeaturedSection() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            强大功能，智能体验
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            我们提供全方位的智能对话解决方案
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Bot}
            title="智能分析"
            description="自动识别对话场景和语境，生成符合情境的回复"
          />
          <FeatureCard
            icon={Sparkles}
            title="多场景支持"
            description="适用于工作沟通、社交聊天、客户服务等多种场景"
          />
          <FeatureCard
            icon={Zap}
            title="快速响应"
            description="秒级生成回复，提高沟通效率"
          />
        </div>
      </div>
    </section>
  );
}
