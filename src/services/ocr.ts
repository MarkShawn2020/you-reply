'use server'

import { createLogger } from "~/lib/logger";

export interface OCRTextLocation {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface OCRTextResult {
  words: string;
  location: OCRTextLocation;
  probability: number;
}

export interface OCRResponse {
  words_result: OCRTextResult[];
  words_result_num: number;
  log_id: number;
}

export interface GroupedText {
  text: string;
  group: number;
}

const logger = createLogger("OCR")

export async function processImageWithOCR(file: File): Promise<GroupedText[]> {
  logger.info("[OCR Client] Processing image:", {
    filename: file.name,
    type: file.type,
    size: `${(file.size / 1024).toFixed(2)}KB`,
  });

  const formData = new FormData();
  formData.append("image", file);

  logger.debug("[OCR Client] Sending request to OCR API");
  const response = await fetch("/api/ocr", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    logger.error("[OCR Client] API request failed:", error);
    throw new Error(error.error || "Failed to process image");
  }

  const data: OCRResponse = await response.json();
  logger.debug("[OCR Client] Received OCR response:", {
    words_count: data.words_result_num,
    log_id: data.log_id,
  });

  const groupedTexts = groupTextsByPosition(data.words_result);
  logger.debug("[OCR Client] Grouped texts:", {
    total_groups: Math.max(...groupedTexts.map((t) => t.group), 0),
    total_texts: groupedTexts.length,
  });

  return groupedTexts;
}

export function groupTextsByPosition(results: OCRTextResult[]): GroupedText[] {
  logger.debug(`[OCR Client] Starting text grouping with ${results.length} items`);

  // 按垂直位置排序
  const sortedResults = [...results].sort(
    (a, b) => a.location.top - b.location.top,
  );

  const groups: GroupedText[] = [];
  let currentGroup = 0;
  let lastTop = -1;
  const VERTICAL_THRESHOLD = 20; // 垂直方向上的阈值，可以根据实际情况调整

  sortedResults.forEach((result, index) => {
    if (
      lastTop === -1 ||
      Math.abs(result.location.top - lastTop) > VERTICAL_THRESHOLD
    ) {
      currentGroup++;
      logger.debug(
        `[OCR Client] Created new group ${currentGroup} at position ${result.location.top}`,
      );
    }

    groups.push({
      text: result.words,
      group: currentGroup,
    });

    lastTop = result.location.top;
  });

  logger.debug(`[OCR Client] Finished grouping:`, {
    input_count: results.length,
    output_count: groups.length,
    total_groups: currentGroup,
  });

  return groups;
}
