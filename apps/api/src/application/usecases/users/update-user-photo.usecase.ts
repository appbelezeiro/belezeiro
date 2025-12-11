import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface';
import { IStorageGateway } from '@/domain/services/storage/i-storage-gateway.service';
import { UserEntity } from '@/domain/entities/users/user.entity';

class UseCase {
  constructor(
    private readonly user_repository: IUserRepository,
    private readonly storage_gateway: IStorageGateway
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const user = await this.user_repository.find_by_id(input.user_id);

    if (!user) {
      throw new Error('User not found');
    }

    // Se já tinha foto e deve deletar a antiga
    if (user.photoUrl && input.delete_old) {
      const old_key = this.extract_key_from_url(user.photoUrl);
      await this.storage_gateway.delete_file({ key: old_key }).catch(() => {
        // Ignora erro se arquivo não existir
      });
    }

    // Obter URL pública do novo arquivo
    const public_url = this.storage_gateway.get_public_url(input.key);

    // Atualizar entidade
    user.update_photo_url(public_url);

    // Persistir
    await this.user_repository.update(user);

    return { url: public_url };
  }

  private extract_key_from_url(url: string): string {
    // Extrai key da URL (formato: https://cdn.example.com/profile/usr_123/file.jpg)
    const parts = url.split('/');
    return parts.slice(-3).join('/'); // profile/usr_123/file.jpg
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    key: string; // Key retornada do generate-upload-url
    delete_old?: boolean; // Default: true
  };

  export type Output = Promise<{
    url: string;
  }>;
}

export { UseCase as UpdateUserPhotoUseCase };
