import { IStorageGateway } from '@/domain/services/storage/i-storage-gateway.service';
import {
  InvalidFileTypeError,
  FileSizeExceededError,
} from '@/domain/errors/storage/storage.errors';

class UseCase {
  constructor(private readonly storage_gateway: IStorageGateway) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validar tipo de arquivo
    this.validate_file_type(input.content_type, input.allowed_types);

    // Validar tamanho
    if (input.max_size_bytes && input.max_size_bytes > 10 * 1024 * 1024) {
      throw new FileSizeExceededError('Maximum file size is 10MB');
    }

    // Gerar key única: {type}/{user_id}/{timestamp}_{random}.{ext}
    const key = this.generate_key(input.type, input.user_id, input.file_name);

    // Gerar pre-signed URL
    const presigned = await this.storage_gateway.generate_upload_url({
      key,
      content_type: input.content_type,
      expires_in_seconds: 900, // 15 minutos
      max_size_bytes: input.max_size_bytes,
    });

    return presigned;
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
    file_name: string;
    content_type: string;
    max_size_bytes?: number;
    allowed_types: string[]; // ['image/jpeg', 'image/png', 'image/webp']
  };

  export type Output = Promise<{
    upload_url: string;
    key: string;
    expires_at: Date;
    fields?: Record<string, string>;
  }>;
}

export { UseCase as GenerateUploadUrlUseCase };
