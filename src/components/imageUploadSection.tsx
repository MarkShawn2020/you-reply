import { Upload } from "lucide-react";
import { ImageUpload } from "~/components/image-upload";
import { SectionCard } from "~/components/section-card";

export function ImageUploadSection(props: {
  userId: string;
  analyzing: boolean;
  error: null | string;
  onStreamResult: (result: string) => void;
  onFinalResult: (result: string) => Promise<void>;
}) {
  return (
    <SectionCard
      icon={Upload}
      title="步骤 2: 上传聊天记录"
      className="bg-white shadow-lg"
    >
      <div className="space-y-4">
        <ImageUpload
          userId={props.userId}
          isAnalyzing={props.analyzing}
          error={props.error}
          onStreamResult={props.onStreamResult}
          onFinalResult={props.onFinalResult}
        />
      </div>
    </SectionCard>
  );
}
