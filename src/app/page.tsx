"use client";

import { useEffect, useState } from "react";
import FeaturedSection from "~/components/featured-section";
import HeroSection from "~/components/hero-section";
import {
  getLatestBackgroundInfo,
} from "./actions";
import PricingSection from "~/components/pricing-section";
import DonationSection from "~/components/donation-section";


export default function HomePage() {
  const [parsedText, setParsedText] = useState("");
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [sessionId, setSessionId] = useState("");

  const genReplyPrompt = `
  这是一段微信聊天记录上下文：
  <context>
  ${parsedText}
  </context>
  
  场景是：
    <background>
  ${background}
    </background>
  
  用户聊天风格：
    <style>
  ${style}
    </style>
  
  请代替真人回复，要求：
  - 分辨不出是否 AI 生成
  - 要遵循用户的聊天风格（若有）
  - 直接输出结果（无需解释），以方便用户直接复制粘贴
`;

  // 生成新的会话 ID
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // 加载最新的背景信息
  useEffect(() => {
    const loadBackgroundInfo = async () => {
      try {
        const info = await getLatestBackgroundInfo();
        if (info) {
          setBackground(info.content);
        }
      } catch (error) {
        console.error("Failed to load background info:", error);
      }
    };
    void loadBackgroundInfo();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features">
        <FeaturedSection />
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Donation Section */}
      <DonationSection />

    </div>
  );
}
