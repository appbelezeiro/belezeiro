import { IStorageGateway } from '@/domain/services/storage/i-storage-gateway.service';
import {
  InvalidFileTypeError,
  FileSizeExceededError,
} from '@/domain/errors/storage/storage.errors';

class UseCase {
  constructor(private readonly storage_gateway: IStorageGateway) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const results = [];

    // Validar limite de arquivos
    if (input.files.length > 20) {
      throw new InvalidFileTypeError('Maximum 20 files per batch');
    }

    for (const file of input.files) {
      // Validar tipo de arquivo
      this.validate_file_type(file.content_type, input.allowed_types);

      // Validar tamanho
      if (file.max_size_bytes && file.max_size_bytes > 10 * 1024 * 1024) {
        throw new FileSizeExceededError(`File ${file.file_name} exceeds maximum size of 10MB`);
      }

      // Gerar key única para cada arquivo
      const key = this.generate_key(input.type, input.user_id, file.file_name);

      // Gerar pre-signed URL
      const presigned = await this.storage_gateway.generate_upload_url({
        key,
        content_type: file.content_type,
        expires_in_seconds: 900, // 15 minutos
        max_size_bytes: file.max_size_bytes,
      });

      results.push({
        file_name: file.file_name,
        upload_url: presigned.upload_url,
        key: presigned.key,
        expires_at: presigned.expires_at,
        fields: presigned.fields,
      });
    }

    return results;
  }

  private validate_file_type(content_type: string, allowed_types: string[]): void {
    if (!allowed_types.includes(content_type)) {
      throw new InvalidFileTypeError(
        `Content type ${content_type} not allowed. Allowed: ${allowed_types.join(', ')}`
      );
    }
  }

  private generate_key(
    type: 'profile' | 'logo' | 'gallery',
    user_id: string,
    file_name: string
  ): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file_name.split('.').pop();
    return `${type}/${user_id}/${timestamp}_${random}.${ext}`;
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    type: 'profile' | 'logo' | 'gallery';
    files: Array<{
      file_name: string;
      content_type: string;
      max_size_bytes?: number;
    }>;
    allowed_types: string[];
  };

  export type Output = Promise<
    Array<{
      file_name: string;
      upload_url: string;
      key: string;
      expires_at: Date;
      fields?: Record<string, string>;
    }>
  >;
}

export { UseCase as GenerateBatchUploadUrlsUseCase };
