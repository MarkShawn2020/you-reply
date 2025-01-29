import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const STORAGE_KEY = "you-reply-custom-scenarios";

export interface CustomScenario {
  id: string;
  label: string;
  prompt: string;
}

// 使用 atomWithStorage 自动处理本地存储
export const customScenariosAtom = atomWithStorage<CustomScenario[]>(
  STORAGE_KEY,
  []
);
