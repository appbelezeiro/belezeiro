import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { IStorageGateway } from '@/domain/services/storage/i-storage-gateway.service';

class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly storage_gateway: IStorageGateway
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const unit = await this.unit_repository.find_by_id(input.unit_id);

    if (!unit) {
      throw new Error('Unit not found');
    }

    // Se já tinha logo e deve deletar o antigo
    if (unit.logo && input.delete_old) {
      const old_key = this.extract_key_from_url(unit.logo);
      await this.storage_gateway.delete_file({ key: old_key }).catch(() => {
        // Ignora erro se arquivo não existir
      });
    }

    // Obter URL pública do novo arquivo
    const public_url = this.storage_gateway.get_public_url(input.key);

    // Atualizar entidade
    unit.update_logo(public_url);

    // Persistir
    await this.unit_repository.update(unit);

    return { url: public_url };
  }

  private extract_key_from_url(url: string): string {
    // Extrai key da URL (formato: https://cdn.example.com/logo/usr_123/file.jpg)
    const parts = url.split('/');
    return parts.slice(-3).join('/'); // logo/usr_123/file.jpg
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    key: string; // Key retornada do generate-upload-url
    delete_old?: boolean; // Default: true
  };

  export type Output = Promise<{
    url: string;
  }>;
}

export { UseCase as UpdateUnitLogoUseCase };
