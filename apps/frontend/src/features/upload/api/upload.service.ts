import { privateClient } from '@/services/api/client';
import type {
  PresignedUploadUrl,
  BatchPresignedUploadUrl,
  UploadConfirmation,
  BatchUploadConfirmation,
  UploadType,
  UploadProgress,
} from '../types/upload.types';

export const uploadService = {
  /**
   * 1. Gera pre-signed URL para upload único
   */
  async generateUploadUrl(
    type: UploadType,
    fileName: string,
    contentType: string,
    maxSizeBytes?: number
  ): Promise<PresignedUploadUrl> {
    const response = await privateClient.post('/upload/generate-url', {
      type,
      file_name: fileName,
      content_type: contentType,
      max_size_bytes: maxSizeBytes,
    });
    return response.data;
  },

  /**
   * 2. Gera múltiplas pre-signed URLs de uma vez (batch)
   */
  async generateBatchUploadUrls(
    type: UploadType,
    files: Array<{ fileName: string; contentType: string; maxSizeBytes?: number }>
  ): Promise<BatchPresignedUploadUrl[]> {
    const response = await privateClient.post('/upload/generate-batch-urls', {
      type,
      files: files.map((f) => ({
        file_name: f.fileName,
        content_type: f.contentType,
        max_size_bytes: f.maxSizeBytes,
      })),
    });
    return response.data.uploads;
  },

  /**
   * 3. Faz upload direto para S3/R2 usando pre-signed URL
   */
  async uploadToStorage(
    presignedUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    // Upload direto para S3/R2 via fetch
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // Simular progresso (fetch não suporta progress nativamente)
    onProgress?.({ loaded: file.size, total: file.size, percentage: 100 });
  },

  /**
   * 4. Confirma upload para atualizar foto de perfil
   */
  async confirmUserPhoto(key: string): Promise<UploadConfirmation> {
    const response = await privateClient.post('/upload/confirm/user-photo', { key });
    return response.data;
  },

  /**
   * 5. Confirma upload para atualizar logo da unidade
   */
  async confirmUnitLogo(unitId: string, key: string): Promise<UploadConfirmation> {
    const response = await privateClient.post(`/upload/confirm/unit/${unitId}/logo`, { key });
    return response.data;
  },

  /**
   * 6. Adiciona foto à galeria da unidade
   */
  async addUnitGalleryPhoto(unitId: string, key: string): Promise<UploadConfirmation> {
    const response = await privateClient.post(`/upload/confirm/unit/${unitId}/gallery`, { key });
    return response.data;
  },

  /**
   * 7. Confirma múltiplos uploads de galeria de uma vez
   */
  async confirmBatchGalleryUpload(
    unitId: string,
    keys: string[]
  ): Promise<BatchUploadConfirmation> {
    const response = await privateClient.post(`/upload/confirm/unit/${unitId}/gallery/batch`, {
      keys,
    });
    return response.data;
  },

  /**
   * 8. Remove foto da galeria
   */
  async removeUnitGalleryPhoto(unitId: string, photoUrl: string): Promise<void> {
    await privateClient.delete(`/upload/unit/${unitId}/gallery/${encodeURIComponent(photoUrl)}`);
  },
};
