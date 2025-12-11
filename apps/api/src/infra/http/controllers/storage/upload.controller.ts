import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import {
  InvalidFileTypeError,
  FileSizeExceededError,
} from '@/domain/errors/storage/storage.errors';
import { BadRequestError } from '@/infra/http/errors/http-errors';

const GenerateUploadUrlSchema = z.object({
  type: z.enum(['profile', 'logo', 'gallery']),
  file_name: z.string().min(1),
  content_type: z.string().regex(/^image\/(jpeg|png|webp)$/),
  max_size_bytes: z.number().max(10 * 1024 * 1024).optional(),
});

const GenerateBatchUploadUrlsSchema = z.object({
  type: z.enum(['profile', 'logo', 'gallery']),
  files: z
    .array(
      z.object({
        file_name: z.string().min(1),
        content_type: z.string().regex(/^image\/(jpeg|png|webp)$/),
        max_size_bytes: z.number().max(10 * 1024 * 1024).optional(),
      })
    )
    .min(1)
    .max(20), // Máximo 20 arquivos por batch
});

const ConfirmUploadSchema = z.object({
  key: z.string().min(1),
});

const ConfirmBatchUploadSchema = z.object({
  keys: z.array(z.string()).min(1).max(20),
});

export class UploadController {
  constructor(private readonly container: Container) {}

  async generate_upload_url(c: Context) {
    try {
      const body = await c.req.json();
      const payload = GenerateUploadUrlSchema.parse(body);

      // Get user_id from auth context (já autenticado)
      const auth = c.get('auth');
      const user_id = auth.userId;

      const result = await this.container.use_cases.generate_upload_url.execute({
        user_id,
        type: payload.type,
        file_name: payload.file_name,
        content_type: payload.content_type,
        max_size_bytes: payload.max_size_bytes,
        allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
      });

      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InvalidFileTypeError || error instanceof FileSizeExceededError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async generate_batch_upload_urls(c: Context) {
    try {
      const body = await c.req.json();
      const payload = GenerateBatchUploadUrlsSchema.parse(body);

      const auth = c.get('auth');
      const user_id = auth.userId;

      const results = await this.container.use_cases.generate_batch_upload_urls.execute({
        user_id,
        type: payload.type,
        files: payload.files,
        allowed_types: ['image/jpeg', 'image/png', 'image/webp'],
      });

      return c.json({ uploads: results }, 200);
    } catch (error) {
      if (error instanceof InvalidFileTypeError || error instanceof FileSizeExceededError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async confirm_user_photo_upload(c: Context) {
    const body = await c.req.json();
    const payload = ConfirmUploadSchema.parse(body);
    const auth = c.get('auth');
    const user_id = auth.userId;

    const result = await this.container.use_cases.update_user_photo.execute({
      user_id,
      key: payload.key,
      delete_old: true,
    });

    return c.json(result, 200);
  }

  async confirm_unit_logo_upload(c: Context) {
    const { unit_id } = c.req.param();
    const body = await c.req.json();
    const payload = ConfirmUploadSchema.parse(body);

    const result = await this.container.use_cases.update_unit_logo.execute({
      unit_id,
      key: payload.key,
      delete_old: true,
    });

    return c.json(result, 200);
  }

  async add_unit_gallery_photo(c: Context) {
    const { unit_id } = c.req.param();
    const body = await c.req.json();
    const payload = ConfirmUploadSchema.parse(body);

    const result = await this.container.use_cases.add_unit_gallery_photo.execute({
      unit_id,
      key: payload.key,
    });

    return c.json(result, 200);
  }

  async confirm_batch_gallery_upload(c: Context) {
    const { unit_id } = c.req.param();
    const body = await c.req.json();

    const payload = ConfirmBatchUploadSchema.parse(body);

    const result = await this.container.use_cases.add_batch_unit_gallery_photos.execute({
      unit_id,
      keys: payload.keys,
    });

    return c.json(result, 200);
  }

  async remove_unit_gallery_photo(c: Context) {
    const { unit_id, photo_url } = c.req.param();

    const result = await this.container.use_cases.remove_unit_gallery_photo.execute({
      unit_id,
      photo_url: decodeURIComponent(photo_url),
    });

    return c.json(result, 200);
  }
}
