import { OCRResponse } from "./ocr";

interface AnalysisResult {
  type: "me" | "other" | "time" | "unknown";
  text: string;
}

/**
 * 分析OCR结果中的文本位置和类型
 */
export function analyzeTextPosition(
  text: string,
  left: number,
): AnalysisResult["type"] {
  console.log(`Analyzing position for text: "${text}" at left: ${left}`);

  // 处理撤回消息
  if (text.includes("recalled a message")) {
    console.log("-> Detected recall message");
    return "unknown";
  }

  // 处理时间格式
  if (
    text.match(/^\d{1,2}:\d{2}$/) ||
    text.match(/^\d{4}-\d{2}-\d{2}/) ||
    text.match(/^\w+\s*\d+,?\s*\d{4}\s*\d{1,2}:\d{2}/)
  ) {
    console.log("-> Detected time format");
    return "time";
  }

  if (left > 500) {
    console.log("-> Detected as my message");
    return "me";
  }
  if (left < 500) {
    console.log("-> Detected as other message");
    return "other";
  }
  console.log("-> Unknown message type");
  return "unknown";
}

/**
 * 格式化时间字符串
 */
function formatTimeString(text: string): string {
  console.log(`Formatting time string: "${text}"`);
  // 处理特殊格式，如 "0ct23,202416:17"
  const match = text.match(/(\w+)\s*(\d+),?\s*(\d{4})\s*(\d{1,2}):(\d{2})/);
  if (match) {
    const [_, month, day, year, hour, minute] = match;
    const formatted = `${year}-${month}-${day} ${hour}:${minute}`;
    console.log(`-> Formatted to: "${formatted}"`);
    return formatted;
  }
  return text;
}

/**
 * 将OCR结果转换为结构化的聊天记录
 */
export function analyzeOCRResult(ocrResult: OCRResponse): string {
  try {
    console.log("Analyzing OCR result:", JSON.stringify(ocrResult, null, 2));

    if (!ocrResult?.words_result?.length) {
      console.log("No words_result found or empty");
      return "未检测到有效文本";
    }

    // 过滤并排序结果
    const sortedResults = [...ocrResult.words_result]
      .filter((item) => {
        if (!item?.words || !item?.location) {
          console.log("Filtering out invalid item:", item);
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        console.log(
          `Comparing top positions: ${a.location.top} vs ${b.location.top}`,
        );
        return a.location.top - b.location.top;
      })
      .map((item) => {
        const type = analyzeTextPosition(item.words, item.location.left);
        console.log(`Mapped item: "${item.words}" -> type: ${type}`);
        return {
          type,
          text: item.words.trim(),
        };
      })
      .filter((item) => item.text);

    console.log("Processed results:", sortedResults);

    if (sortedResults.length === 0) {
      console.log("No valid results after processing");
      return "未检测到有效文本";
    }

    // 格式化结果
    let result = "";
    let currentType: AnalysisResult["type"] | null = null;

    for (const item of sortedResults) {
      console.log(`Processing item: ${JSON.stringify(item)}`);

      if (item.type === "time") {
        const formattedTime = formatTimeString(item.text);
        result += formattedTime + "\n";
        currentType = null;
        continue;
      }

      if (item.type === "unknown") {
        console.log(`Skipping unknown type: ${item.text}`);
        continue;
      }

      if (currentType !== item.type) {
        result += `[${item.type === "me" ? "我" : "对方"}] `;
        currentType = item.type;
      }

      result += item.text + "\n";
    }

    console.log("Final result:", result);
    return result || "解析结果为空";
  } catch (error) {
    console.error("Error analyzing OCR result:", error);
    throw new Error("解析失败，请重试");
  }
}
