import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { IMAGE_ANALYSIS_PROMPT, REPLY_GENERATION_PROMPT } from '@/lib/prompts';

// 使用 localStorage 持久化存储 prompt 模板
export const imagePromptAtom = atomWithStorage(
  'imagePrompt',
  IMAGE_ANALYSIS_PROMPT,
);

export const replyPromptAtom = atomWithStorage(
  'replyPrompt',
  REPLY_GENERATION_PROMPT,
);
