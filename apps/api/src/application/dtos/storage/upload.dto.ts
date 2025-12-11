export interface PresignedUploadDTO {
  upload_url: string;
  key: string;
  expires_at: Date;
  fields?: Record<string, string>;
}

export interface UploadConfirmationDTO {
  url: string; // URL pública/CDN do arquivo
  key: string;
}

export interface BatchPresignedUploadDTO {
  file_name: string;
  upload_url: string;
  key: string;
  expires_at: Date;
  fields?: Record<string, string>;
}

export interface BatchUploadConfirmationDTO {
  urls: string[];
  total: number;
}
