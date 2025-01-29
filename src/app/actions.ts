"use server";

import { callClaude, callClaudeWithImage } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

interface BackgroundInfo {
  id: string;
  content: string;
  updatedAt: Date;
}

interface ChatContext {
  id: string;
  sessionId: string;
  contactName: string;
  contactNotes: string;
  updatedAt: Date;
}

export async function analyzeImage(
  file: File,
  prompt: string,
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const result = await callClaudeWithImage(prompt, formData);
    return result;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("图片解析失败");
  }
}

export async function generateReply(
  parsedText: string,
  sessionId: string,
  prompt: string,
): Promise<string> {
  try {
    // 获取最新的背景信息和聊天对象信息
    const [backgroundInfo, chatContext] = await Promise.all([
      prisma.backgroundInfo.findFirst({
        orderBy: { updatedAt: "desc" },
      }),
      prisma.chatContext.findFirst({
        where: { sessionId },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    // 将背景信息和聊天对象信息添加到提示中
    const finalPrompt = prompt
      .replace("{text}", parsedText)
      .replace(
        "{background}",
        `${backgroundInfo ? `背景信息：${backgroundInfo.content}\n` : ""}${
          chatContext
            ? `聊天对象：${chatContext.contactName}\n备注：${chatContext.contactNotes}`
            : "未提供聊天对象信息"
        }`,
      );

    const result = await callClaude(finalPrompt);
    return result;
  } catch (error) {
    console.error("Error generating reply:", error);
    throw new Error("回复生成失败");
  }
}

export async function saveBackgroundInfo(content: string) {
  try {
    const result = await prisma.backgroundInfo.create({
      data: { content },
    });
    return result;
  } catch (error) {
    console.error("Error saving background info:", error);
    throw error;
  }
}

export async function getLatestBackgroundInfo(): Promise<BackgroundInfo | null> {
  try {
    const backgroundInfo = await prisma.backgroundInfo.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    return backgroundInfo;
  } catch (error) {
    console.error("Error getting background info:", error);
    throw new Error("获取背景信息失败");
  }
}

export async function saveChatContext(
  sessionId: string,
  contactName: string,
  contactNotes: string,
): Promise<ChatContext> {
  try {
    const chatContext = await prisma.chatContext.create({
      data: {
        sessionId,
        contactName,
        contactNotes,
      },
    });
    return chatContext;
  } catch (error) {
    console.error("Error saving chat context:", error);
    throw new Error("保存聊天对象信息失败");
  }
}

export async function getLatestChatContext(
  sessionId: string,
): Promise<ChatContext | null> {
  try {
    const chatContext = await prisma.chatContext.findFirst({
      where: { sessionId },
      orderBy: { updatedAt: "desc" },
    });
    return chatContext;
  } catch (error) {
    console.error("Error getting chat context:", error);
    throw new Error("获取聊天对象信息失败");
  }
}

export async function uploadImageToDify(
  file: File,
  userId: string,
): Promise<string> {
  console.log(`[Dify] Uploading image for user ${userId}`, {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user", userId);

  try {
    const response = await fetch("https://api.dify.ai/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Dify] File upload failed", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error("Failed to upload file to Dify");
    }

    const data = await response.json();
    console.log("[Dify] File upload successful", {
      fileId: data.id,
      userId,
    });
    return data.id;
  } catch (error) {
    console.error("[Dify] File upload error", {
      error: error instanceof Error ? error.message : error,
      userId,
      fileName: file.name,
    });
    throw error;
  }
}

export async function processImageWithDify(
  fileId: string,
  userId: string,
): Promise<ReadableStream> {
  console.log("[Dify] Starting image processing", {
    fileId,
    userId,
  });

  try {
    const response = await fetch("https://api.dify.ai/v1/workflows/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {},
        files: [
          {
            transfer_method: "local_file",
            upload_file_id: fileId,
            type: "image",
          },
        ],
        response_mode: "streaming",
        user: userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Dify] Image processing request failed", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        fileId,
        userId,
      });
      throw new Error("Failed to process image with Dify");
    }

    console.log("[Dify] Image processing started successfully", {
      fileId,
      userId,
    });

    // @ts-ignore - ReadableStream is available in Node.js
    return response.body;
  } catch (error) {
    console.error("[Dify] Image processing error", {
      error: error instanceof Error ? error.message : error,
      fileId,
      userId,
    });
    throw error;
  }
}
