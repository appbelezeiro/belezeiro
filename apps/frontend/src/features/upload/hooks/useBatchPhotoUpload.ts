import { useState } from 'react';
import { uploadService } from '../api/upload.service';
import type { UploadType, BatchUploadProgress } from '../types/upload.types';

interface UseBatchPhotoUploadOptions {
  type: UploadType;
  maxSizeMB?: number;
  onProgress?: (progress: BatchUploadProgress) => void;
  onSuccess?: (urls: string[]) => void;
  onError?: (error: Error) => void;
}

export function useBatchPhotoUpload({
  type,
  maxSizeMB = 5,
  onProgress,
  onSuccess,
  onError,
}: UseBatchPhotoUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<BatchUploadProgress | null>(null);

  const uploadBatch = async (files: File[], unitId?: string) => {
    try {
      setUploading(true);

      const total = files.length;
      let completed = 0;
      let failed = 0;

      setProgress({ total, completed, failed, percentage: 0 });

      // Validar todos os arquivos primeiro
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSizeBytes) {
          throw new Error(`Arquivo ${file.name} muito grande. Máximo: ${maxSizeMB}MB`);
        }
        if (!file.type.startsWith('image/')) {
          throw new Error(`Arquivo ${file.name} não é uma imagem`);
        }
      }

      // 1. Gerar pre-signed URLs em batch
      const presignedUrls = await uploadService.generateBatchUploadUrls(
        type,
        files.map((f) => ({
          fileName: f.name,
          contentType: f.type,
          maxSizeBytes,
        }))
      );

      // 2. Fazer uploads em paralelo (com limite de concorrência)
      const CONCURRENT_UPLOADS = 3; // Limitar a 3 uploads simultâneos
      const keys: string[] = [];

      for (let i = 0; i < presignedUrls.length; i += CONCURRENT_UPLOADS) {
        const batch = presignedUrls.slice(i, i + CONCURRENT_UPLOADS);

        const results = await Promise.allSettled(
          batch.map(async (presigned, idx) => {
            const file = files[i + idx];

            setProgress({
              total,
              completed,
              failed,
              current_file: file.name,
              percentage: Math.round((completed / total) * 100),
            });

            await uploadService.uploadToStorage(presigned.upload_url, file);
            return presigned.key;
          })
        );

        // Processar resultados
        for (const result of results) {
          if (result.status === 'fulfilled') {
            keys.push(result.value);
            completed++;
          } else {
            failed++;
          }
        }

        const progressData = {
          total,
          completed,
          failed,
          percentage: Math.round((completed / total) * 100),
        };

        setProgress(progressData);
        onProgress?.(progressData);
      }

      // 3. Confirmar uploads em batch
      let confirmation;
      if (type === 'gallery' && unitId) {
        confirmation = await uploadService.confirmBatchGalleryUpload(unitId, keys);
      } else {
        throw new Error('Batch upload only supported for gallery');
      }

      setProgress({ total, completed, failed, percentage: 100 });
      onSuccess?.(confirmation.urls);

      return confirmation.urls;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(null), 1000);
    }
  };

  return {
    uploadBatch,
    uploading,
    progress,
  };
}
