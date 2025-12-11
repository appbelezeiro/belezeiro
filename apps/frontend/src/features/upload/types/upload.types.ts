export interface PresignedUploadUrl {
  upload_url: string;
  key: string;
  expires_at: string;
  fields?: Record<string, string>;
}

export interface BatchPresignedUploadUrl extends PresignedUploadUrl {
  file_name: string;
}

export interface UploadConfirmation {
  url: string;
  key: string;
}

export interface BatchUploadConfirmation {
  urls: string[];
  total: number;
}

export type UploadType = 'profile' | 'logo' | 'gallery';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface BatchUploadProgress {
  total: number;
  completed: number;
  failed: number;
  current_file?: string;
  percentage: number;
}
