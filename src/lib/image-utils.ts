import { OCRResponse } from '@/services/ocr';

interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * 获取图片的原始尺寸
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 创建带OCR标注的预览图
 */
export async function createAnnotatedPreview(
  file: File,
  ocrResults?: OCRResponse,
  targetWidth = 400
): Promise<string> {
  // 1. 获取图片原始尺寸
  const dimensions = await getImageDimensions(file);
  
  // 2. 创建canvas并设置合适的尺寸
  const canvas = document.createElement('canvas');
  const scale = targetWidth / dimensions.width;
  canvas.width = targetWidth;
  canvas.height = dimensions.height * scale;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // 3. 绘制原图
  const img = await createImageBitmap(file);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  // 4. 如果有OCR结果，绘制标注
  if (ocrResults?.words_result) {
    // 设置样式
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    
    ocrResults.words_result.forEach(result => {
      const { left, top, width, height } = result.location;
      // 缩放坐标和尺寸
      const scaledLeft = left * scale;
      const scaledTop = top * scale;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      
      // 绘制边框
      ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
    });
  }
  
  return canvas.toDataURL('image/jpeg', 0.9);
}
