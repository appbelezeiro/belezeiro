export enum StorageProvider {
  S3 = 's3',
  R2 = 'r2',
  FAKE = 'fake',
}

export interface PresignedUrlParams {
  key: string;
  content_type: string;
  expires_in_seconds?: number; // Default: 900 (15 min)
  max_size_bytes?: number; // Default: 5MB
}

export interface PresignedUploadUrl {
  upload_url: string;
  key: string;
  expires_at: Date;
  fields?: Record<string, string>; // Para POST multipart (S3)
}

export interface PresignedDownloadUrl {
  download_url: string;
  expires_at: Date;
}

export interface DeleteFileParams {
  key: string;
}

export interface IStorageGateway {
  /**
   * Gera URL pre-signed para upload
   */
  generate_upload_url(params: PresignedUrlParams): Promise<PresignedUploadUrl>;

  /**
   * Gera URL pre-signed para download (CDN-friendly)
   */
  generate_download_url(key: string, expires_in_seconds?: number): Promise<PresignedDownloadUrl>;

  /**
   * Deleta arquivo do storage
   */
  delete_file(params: DeleteFileParams): Promise<void>;

  /**
   * Verifica se arquivo existe
   */
  file_exists(key: string): Promise<boolean>;

  /**
   * Retorna URL pública (se bucket for público ou com CDN)
   */
  get_public_url(key: string): string;
}
