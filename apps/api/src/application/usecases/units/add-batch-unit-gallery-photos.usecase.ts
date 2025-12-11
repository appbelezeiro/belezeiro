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

    // Converter keys para URLs públicas
    const new_urls = input.keys.map((key) => this.storage_gateway.get_public_url(key));

    // Adicionar às fotos existentes da galeria
    const updated_gallery = [...unit.gallery, ...new_urls];

    // Atualizar entidade
    unit.update_gallery(updated_gallery);

    // Persistir
    await this.unit_repository.update(unit);

    return {
      urls: new_urls,
      total: updated_gallery.length,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    keys: string[]; // Array de keys retornadas do generate-batch-upload-urls
  };

  export type Output = Promise<{
    urls: string[];
    total: number;
  }>;
}

export { UseCase as AddBatchUnitGalleryPhotosUseCase };
