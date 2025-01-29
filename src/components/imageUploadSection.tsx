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

        <ImageUpload
          userId={props.userId}
          isAnalyzing={props.analyzing}
          error={props.error}
          onStreamResult={props.onStreamResult}
          onFinalResult={props.onFinalResult}
        />

  );
}
