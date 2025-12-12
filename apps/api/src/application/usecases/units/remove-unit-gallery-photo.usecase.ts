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

    // Remover da galeria
    const updated_gallery = unit.gallery.filter((urlVO) => urlVO.URL !== input.photo_url);

    // Se removeu alguma foto, deletar do storage também
    if (updated_gallery.length < unit.gallery.length) {
      const key = this.extract_key_from_url(input.photo_url);
      await this.storage_gateway.delete_file({ key }).catch(() => {
        // Ignora erro se arquivo não existir
      });
    }

    // Atualizar entidade
    unit.update_gallery(updated_gallery);

    // Persistir
    await this.unit_repository.update(unit);

    return {
      success: true,
      total: updated_gallery.length,
    };
  }

  private extract_key_from_url(url: string): string {
    // Extrai key da URL (formato: https://cdn.example.com/gallery/usr_123/file.jpg)
    const parts = url.split('/');
    return parts.slice(-3).join('/'); // gallery/usr_123/file.jpg
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    photo_url: string; // URL completa da foto a ser removida
  };

  export type Output = Promise<{
    success: boolean;
    total: number;
  }>;
}

export { UseCase as RemoveUnitGalleryPhotoUseCase };
