import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

async function getAccessToken(): Promise<string> {
  const API_KEY = process.env.BAIDU_API_KEY;
  const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

  if (!API_KEY || !SECRET_KEY) {
    console.error('[OCR] Missing API credentials');
    throw new Error('Baidu OCR API credentials not found');
  }

  console.log('[OCR] Requesting access token...');
  const tokenResponse = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
  );
  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    console.error('[OCR] Failed to get access token:', tokenData);
    throw new Error('Failed to get Baidu OCR access token');
  }

  console.log('[OCR] Successfully obtained access token');
  return tokenData.access_token;
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.log(`[OCR][${requestId}] Processing new OCR request`);
  
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.warn(`[OCR][${requestId}] No image file provided in request`);
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log(`[OCR][${requestId}] Processing image:`, {
      filename: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)}KB`
    });

    // 获取access token
    const accessToken = await getAccessToken();

    // 转换文件为base64
    console.log(`[OCR][${requestId}] Converting image to base64`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 调用百度OCR API
    console.log(`[OCR][${requestId}] Calling Baidu OCR API`);
    const response = await fetch(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `image=${encodeURIComponent(base64Image)}`,
      }
    );

    const data = await response.json();

    if (data.error_code) {
      console.error(`[OCR][${requestId}] Baidu OCR API error:`, {
        error_code: data.error_code,
        error_msg: data.error_msg
      });
      return NextResponse.json(
        { error: data.error_msg },
        { status: 500 }
      );
    }

    // console.log(`[OCR][${requestId}] Successfully processed image:`, JSON.stringifydata, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[OCR][${requestId}] Error processing request:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
