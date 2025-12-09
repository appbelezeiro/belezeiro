import { IIDGeneratorService } from '@/domain/services/i-id-generator.service';
import { ulid } from 'ulidx';

const IDPrefixRegex = /[^a-zA-Z]/g;

export class ULIDXIDGeneratorService implements IIDGeneratorService {
  generate(prefix: string): string {
    if (!prefix || prefix.trim().length === 0) {
      throw new Error('Prefix cannot be empty');
    }

    const clean_prefix = prefix.replace(IDPrefixRegex, '').toLowerCase();

    if (clean_prefix.length === 0) {
      throw new Error('Prefix must contain at least one letter');
    }

    return clean_prefix + '_' + ulid();
  }
}
