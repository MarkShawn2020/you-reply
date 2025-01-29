import { OCRResponse } from './ocr';
import { ANALYZE_OCR_PROMPT } from '@/lib/prompts';

/**
 * 使用deepseek模型分析OCR结果
 */
export async function analyzeOCRResult(ocrResult: OCRResponse): Promise<string> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: ANALYZE_OCR_PROMPT,
        ocrResult,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze OCR result');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error analyzing OCR result:', error);
    throw error;
  }
}
