import { useState, useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBatchPhotoUpload } from '../hooks/useBatchPhotoUpload';

interface GalleryUploaderProps {
  unitId: string;
  currentPhotos?: string[];
  onUploadSuccess?: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function GalleryUploader({
  unitId,
  currentPhotos = [],
  onUploadSuccess,
  maxFiles = 15,
  maxSizeMB = 5,
}: GalleryUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(currentPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadBatch, uploading, progress } = useBatchPhotoUpload({
    type: 'gallery',
    maxSizeMB,
    onSuccess: (urls) => {
      setPreviews((prev) => [...prev, ...urls]);
      onUploadSuccess?.(urls);
    },
    onError: (error) => {
      console.error('Batch upload failed:', error);
      alert(error.message);
    },
  });

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validar quantidade
    if (previews.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} fotos na galeria`);
      return;
    }

    // Preview local
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Upload em batch
    await uploadBatch(files, unitId);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        max={maxFiles}
        onChange={handleFilesSelect}
        className="hidden"
      />

      {/* Grid de fotos */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {!uploading && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setPreviews((prev) => prev.filter((_, i) => i !== index));
                  // TODO: Chamar API para remover do backend
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {/* Botão adicionar mais */}
        {previews.length < maxFiles && (
          <Button
            variant="outline"
            className="aspect-square"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="h-8 w-8" />
              <span className="text-xs">Adicionar</span>
            </div>
          </Button>
        )}
      </div>

      {/* Progress bar */}
      {uploading && progress && (
        <div className="mt-4 space-y-2">
          <Progress value={progress.percentage} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {progress.completed} de {progress.total} enviadas
            </span>
            {progress.failed > 0 && (
              <span className="text-destructive">{progress.failed} falharam</span>
            )}
          </div>
          {progress.current_file && (
            <p className="text-xs text-muted-foreground">Enviando: {progress.current_file}</p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        {previews.length}/{maxFiles} fotos • Máximo {maxSizeMB}MB por foto
      </p>
    </div>
  );
}
