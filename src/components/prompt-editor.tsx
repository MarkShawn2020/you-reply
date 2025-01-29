'use client'

import { atomWithStorage } from "jotai/utils";
import { PromptEditorDialog } from "./prompt-editor-dialog";
import { imagePromptAtom, replyPromptAtom } from "~/store/prompts";
import { useAtom } from "jotai/react";
import { useEffect } from "react";

const promptEditorOpenAtom = atomWithStorage("promptEditorOpen", false);


export default function PromptEditor() {
    const [imagePrompt, setImagePrompt] = useAtom(imagePromptAtom);
    const [replyPrompt, setReplyPrompt] = useAtom(replyPromptAtom);
    const [isPromptEditorOpen, setIsPromptEditorOpen] =
      useAtom(promptEditorOpenAtom);

        // 添加快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + Shift + P
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault(); // 防止默认行为
        setIsPromptEditorOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsPromptEditorOpen]);
      
    return (
      <PromptEditorDialog
        imagePrompt={imagePrompt}
        replyPrompt={replyPrompt}
        isOpen={isPromptEditorOpen}
        onOpenChange={setIsPromptEditorOpen}
        onSave={(newImagePrompt, newReplyPrompt) => {
          setImagePrompt(newImagePrompt);
          setReplyPrompt(newReplyPrompt);
        }}
      />
    );
}