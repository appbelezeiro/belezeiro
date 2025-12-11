import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  IStorageGateway,
  PresignedUrlParams,
  PresignedUploadUrl,
  PresignedDownloadUrl,
  DeleteFileParams,
} from '@/domain/services/storage/i-storage-gateway.service';

/**
 * Cloudflare R2 Storage Gateway
 * R2 é compatível com S3 API, mas usa endpoint customizado
 */
export class R2StorageGatewayService implements IStorageGateway {
  private s3_client: S3Client;
  private bucket_name: string;
  private public_url?: string;

  constructor(config: {
    account_id: string;
    access_key_id: string;
    secret_access_key: string;
    bucket_name: string;
    public_url?: string; // R2 Public URL (ex: https://pub-xxxxx.r2.dev)
  }) {
    // R2 usa endpoint customizado: https://<account-id>.r2.cloudflarestorage.com
    this.s3_client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.account_id}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
      },
    });
    this.bucket_name = config.bucket_name;
    this.public_url = config.public_url;
  }

  async generate_upload_url(params: PresignedUrlParams): Promise<PresignedUploadUrl> {
    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: params.key,
      ContentType: params.content_type,
      ...(params.max_size_bytes && { ContentLength: params.max_size_bytes }),
    });

    const upload_url = await getSignedUrl(this.s3_client, command, {
      expiresIn: params.expires_in_seconds || 900,
    });

    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + (params.expires_in_seconds || 900));

    return {
      upload_url,
      key: params.key,
      expires_at,
    };
  }

  async generate_download_url(
    key: string,
    expires_in_seconds = 3600
  ): Promise<PresignedDownloadUrl> {
    // Se tiver URL pública, retorna direto (R2 pode ter domínio customizado)
    if (this.public_url) {
      return {
        download_url: `${this.public_url}/${key}`,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      };
    }

    // Senão, gera pre-signed URL
    const command = new GetObjectCommand({
      Bucket: this.bucket_name,
      Key: key,
    });

    const download_url = await getSignedUrl(this.s3_client, command, {
      expiresIn: expires_in_seconds,
    });

    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + expires_in_seconds);

    return { download_url, expires_at };
  }

  async delete_file(params: DeleteFileParams): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket_name,
      Key: params.key,
    });

    await this.s3_client.send(command);
  }

  async file_exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket_name,
        Key: key,
      });
      await this.s3_client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  get_public_url(key: string): string {
    if (this.public_url) {
      return `${this.public_url}/${key}`;
    }
    // Se não tiver URL pública, retorna URL do bucket
    return `https://${this.bucket_name}.r2.dev/${key}`;
  }
}
