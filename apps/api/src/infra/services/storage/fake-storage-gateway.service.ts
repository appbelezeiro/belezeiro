import {
  IStorageGateway,
  PresignedUrlParams,
  PresignedUploadUrl,
  PresignedDownloadUrl,
  DeleteFileParams,
} from '@/domain/services/storage/i-storage-gateway.service';

export class FakeStorageGatewayService implements IStorageGateway {
  private files = new Map<string, string>();

  async generate_upload_url(params: PresignedUrlParams): Promise<PresignedUploadUrl> {
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + (params.expires_in_seconds || 900));

    return {
      upload_url: `https://fake-storage.com/upload/${params.key}`,
      key: params.key,
      expires_at,
    };
  }

  async generate_download_url(
    key: string,
    expires_in_seconds = 3600
  ): Promise<PresignedDownloadUrl> {
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + expires_in_seconds);

    return {
      download_url: `https://fake-storage.com/download/${key}`,
      expires_at,
    };
  }

  async delete_file(params: DeleteFileParams): Promise<void> {
    this.files.delete(params.key);
  }

  async file_exists(key: string): Promise<boolean> {
    return this.files.has(key);
  }

  get_public_url(key: string): string {
    return `https://fake-cdn.com/${key}`;
  }

  // Helper methods for testing
  simulate_upload(key: string, content: string): void {
    this.files.set(key, content);
  }

  get_file_content(key: string): string | undefined {
    return this.files.get(key);
  }

  clear(): void {
    this.files.clear();
  }
}
