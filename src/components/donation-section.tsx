import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function DonationSection() {
  return (
    <section id="sponsor" className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center rounded-lg bg-pink-50 px-3 py-1 text-sm text-pink-600 mb-6">
            <Heart className="mr-2 h-4 w-4" />
            需要您的帮助
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            一杯咖啡的温暖 ☕️
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Hi，我是一名独立开发者，花费了大量时间和精力开发这个工具，希望能帮助大家更轻松地处理日常社交。
          </p>
          <p className="text-lg text-gray-600 mb-8">
            为了让所有人都能免费使用，我自掏腰包支付着每月高额的 AI 模型接口费用。如果这个工具帮助到了您，请考虑请我喝杯咖啡，您的支持就是我最大的动力 🙏
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600">
                <Heart className="mr-2 h-5 w-5" />
                打赏支持
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>微信扫码打赏</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="relative h-64 w-64">
                  <Image
                    src="/images/mark-wechat-pay.JPG"
                    alt="微信打赏二维码"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center px-4">
                  感谢您的慷慨支持！每一份赞助都将用于支付服务器和 AI 模型费用，帮助这个工具持续为更多人提供服务 💝
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
