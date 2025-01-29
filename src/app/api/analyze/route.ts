import { NextRequest, NextResponse } from 'next/server';
import { OCRResponse } from '@/services/ocr';
import { analyzeOCRResult } from '@/services/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    if (!body.ocrResult?.words_result) {
      console.log('Invalid OCR result:', body.ocrResult);
      return NextResponse.json(
        { error: 'Missing or invalid OCR result' },
        { status: 400 }
      );
    }

    // 分析OCR结果
    const result = analyzeOCRResult(body.ocrResult);
    console.log('Analysis result:', result);
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: '解析失败，请重试' },
      { status: 500 }
    );
  }
}
