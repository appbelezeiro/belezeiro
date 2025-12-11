import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import type { UploadType } from '../types/upload.types';

interface PhotoUploaderProps {
  type: UploadType;
  currentPhotoUrl?: string;
  unitId?: string;
  onUploadSuccess?: (url: string) => void;
  maxSizeMB?: number;
  className?: string;
}

export function PhotoUploader({
  type,
  currentPhotoUrl,
  unitId,
  onUploadSuccess,
  maxSizeMB = 5,
  className,
}: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, uploading, progress } = usePhotoUpload({
    type,
    maxSizeMB,
    onSuccess: (url) => {
      setPreview(url);
      onUploadSuccess?.(url);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert(error.message);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    await upload(file, unitId);
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          {!uploading && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => setPreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-48"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <div className="flex flex-col items-center gap-2">
            <Camera className="h-8 w-8" />
            <span>Adicionar Foto</span>
            <span className="text-xs text-muted-foreground">Máximo {maxSizeMB}MB</span>
          </div>
        </Button>
      )}

      {uploading && progress && (
        <div className="mt-4">
          <Progress value={progress.percentage} />
          <p className="text-sm text-muted-foreground mt-2">
            Enviando... {Math.round(progress.percentage)}%
          </p>
        </div>
      )}
    </div>
  );
}
