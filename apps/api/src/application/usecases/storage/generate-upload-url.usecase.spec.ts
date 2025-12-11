import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateUploadUrlUseCase } from './generate-upload-url.usecase';
import { FakeStorageGatewayService } from '@/infra/services/storage/fake-storage-gateway.service';
import { InvalidFileTypeError, FileSizeExceededError } from '@/domain/errors/storage/storage.errors';

describe('GenerateUploadUrlUseCase', () => {
  let sut: GenerateUploadUrlUseCase;
  let storage_gateway: FakeStorageGatewayService;

  beforeEach(() => {
    storage_gateway = new FakeStorageGatewayService();
    sut = new GenerateUploadUrlUseCase(storage_gateway);
  });

  it('should generate upload URL for valid image', async () => {
    const result = await sut.execute({
      user_id: 'usr_123',
      type: 'profile',
      file_name: 'avatar.jpg',
      content_type: 'image/jpeg',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    expect(result.upload_url).toContain('usr_123');
    expect(result.key).toContain('profile/usr_123/');
    expect(result.key).toContain('.jpg');
    expect(result.expires_at).toBeInstanceOf(Date);
  });

  it('should throw error for invalid file type', async () => {
    await expect(
      sut.execute({
        user_id: 'usr_123',
        type: 'profile',
        file_name: 'file.pdf',
        content_type: 'application/pdf',
        allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
      })
    ).rejects.toThrow(InvalidFileTypeError);
  });

  it('should throw error for file size exceeding 10MB', async () => {
    await expect(
      sut.execute({
        user_id: 'usr_123',
        type: 'profile',
        file_name: 'large.jpg',
        content_type: 'image/jpeg',
        max_size_bytes: 11 * 1024 * 1024, // 11MB
        allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
      })
    ).rejects.toThrow(FileSizeExceededError);
  });

  it('should generate different keys for different uploads', async () => {
    const result1 = await sut.execute({
      user_id: 'usr_123',
      type: 'profile',
      file_name: 'avatar1.jpg',
      content_type: 'image/jpeg',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    const result2 = await sut.execute({
      user_id: 'usr_123',
      type: 'profile',
      file_name: 'avatar2.jpg',
      content_type: 'image/jpeg',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    expect(result1.key).not.toBe(result2.key);
  });

  it('should generate key with correct type prefix', async () => {
    const profileResult = await sut.execute({
      user_id: 'usr_123',
      type: 'profile',
      file_name: 'avatar.jpg',
      content_type: 'image/jpeg',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    const logoResult = await sut.execute({
      user_id: 'usr_123',
      type: 'logo',
      file_name: 'logo.png',
      content_type: 'image/png',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    const galleryResult = await sut.execute({
      user_id: 'usr_123',
      type: 'gallery',
      file_name: 'photo.webp',
      content_type: 'image/webp',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
    });

    expect(profileResult.key).toContain('profile/');
    expect(logoResult.key).toContain('logo/');
    expect(galleryResult.key).toContain('gallery/');
  });
});
