import { NextRequest, NextResponse } from 'next/server';
import { OCRResponse } from '@/services/ocr';

function analyzeOCRLocally(ocrResult: OCRResponse): string {
  try {
    // 按top坐标排序
    const sortedResults = [...ocrResult.words_result].sort((a, b) => a.location.top - b.location.top);
    
    // 初始化结果
    let result = '[群聊]\n------------------------------------------\n';
    let currentGroup = -1;
    
    for (const item of sortedResults) {
      const { words, location } = item;
      const { left } = location;
      
      // 判断消息类型
      if (left > 700) {
        // 自己的消息
        if (currentGroup !== 1) {
          result += '[我] ';
          currentGroup = 1;
        }
        result += words + '\n';
      } else if (left < 500) {
        // 他人消息
        if (currentGroup !== 2) {
          result += '[他人] ';
          currentGroup = 2;
        }
        result += words + '\n';
      } else {
        // 可能是时间或系统消息
        if (words.match(/^\d{1,2}:\d{2}$/) || words.match(/^\d{4}-\d{2}-\d{2}/)) {
          result += '\n' + words + '\n';
          currentGroup = -1;
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in local analysis:', error);
    return '解析失败，请重试';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, ocrResult } = await request.json();
    
    // 本地处理OCR结果
    const result = analyzeOCRLocally(ocrResult);
    
    return NextResponse.json({ result });
    
    /* TODO: 替换为实际的deepseek API调用
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: JSON.stringify(ocrResult),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Deepseek');
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });
    */
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}
