import { FileVideo, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useMemo, useState } from "react";

export function VideoInputForm() {

  const [videoFile, setVideoFile] = useState<File | null>(null)

  function handleFileSelectd(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6">
        <label
          className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5" 
          htmlFor="video"
        >
          {previewURL ? (
            <>
              <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
            </>
          ) : (
            <>
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </>
          )}
        </label>
        
        <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelectd} />

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
          <Textarea
            id="transcription_prompt"
            className="resize-none h-20 leading-relaxed"
            placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
          />
        </div>

      <Button type="submit" className="w-full">
        Carregar vídeo
        <Upload className="w-4 h-4 ml-2" />
      </Button>
    </form>
  )
}