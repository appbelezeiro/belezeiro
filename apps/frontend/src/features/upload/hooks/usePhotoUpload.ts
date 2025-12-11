import { useState } from 'react';
import { uploadService } from '../api/upload.service';
import type { UploadType, UploadProgress } from '../types/upload.types';

interface UsePhotoUploadOptions {
  type: UploadType;
  maxSizeMB?: number;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function usePhotoUpload({
  type,
  maxSizeMB = 5,
  onSuccess,
  onError,
}: UsePhotoUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const upload = async (file: File, unitId?: string) => {
    try {
      setUploading(true);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });

      // Validar tamanho
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas');
      }

      // 1. Gerar pre-signed URL
      const presigned = await uploadService.generateUploadUrl(
        type,
        file.name,
        file.type,
        maxSizeBytes
      );

      setProgress({ loaded: 0, total: file.size, percentage: 10 });

      // 2. Upload direto para storage
      await uploadService.uploadToStorage(presigned.upload_url, file, (p) => {
        setProgress({
          loaded: p.loaded,
          total: p.total,
          percentage: 10 + p.percentage * 0.7, // 10-80%
        });
      });

      setProgress({ loaded: file.size, total: file.size, percentage: 80 });

      // 3. Confirmar upload no backend
      let confirmation;
      if (type === 'profile') {
        confirmation = await uploadService.confirmUserPhoto(presigned.key);
      } else if (type === 'logo' && unitId) {
        confirmation = await uploadService.confirmUnitLogo(unitId, presigned.key);
      } else if (type === 'gallery' && unitId) {
        confirmation = await uploadService.addUnitGalleryPhoto(unitId, presigned.key);
      } else {
        throw new Error('Invalid upload type or missing unitId');
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });

      onSuccess?.(confirmation.url);

      return confirmation.url;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(null), 1000);
    }
  };

  return {
    upload,
    uploading,
    progress,
  };
}
