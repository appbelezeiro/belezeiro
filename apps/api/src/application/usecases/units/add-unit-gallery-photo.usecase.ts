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

    // Obter URL pública do novo arquivo
    const public_url = this.storage_gateway.get_public_url(input.key);

    // Adicionar à galeria
    const updated_gallery = [...unit.gallery, public_url];

    // Atualizar entidade
    unit.update_gallery(updated_gallery);

    // Persistir
    await this.unit_repository.update(unit);

    return {
      url: public_url,
      total: updated_gallery.length,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    key: string; // Key retornada do generate-upload-url
  };

  export type Output = Promise<{
    url: string;
    total: number;
  }>;
}

export { UseCase as AddUnitGalleryPhotoUseCase };
