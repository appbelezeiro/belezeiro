import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { SendNotificationUseCase } from './send-notification.usecase';
import { InMemoryNotificationRepository } from '@/infra/repositories/in-memory/notifications/in-memory-notification.repository';
import { InMemoryNotificationPreferenceRepository } from '@/infra/repositories/in-memory/notifications/in-memory-notification-preference.repository';
import { InMemoryQueueAdapter } from '@/infra/adapters/in-memory-queue.adapter';
import { NotificationPreferenceEntity } from '@/domain/entities/notifications/notification-preference.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { InvalidChannelError } from '@/domain/errors/notifications/invalid-channel.error';

describe('SendNotificationUseCase', () => {
  let sut: SendNotificationUseCase;
  let notification_repository: InMemoryNotificationRepository;
  let preference_repository: InMemoryNotificationPreferenceRepository;
  let queue: InMemoryQueueAdapter;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    notification_repository = new InMemoryNotificationRepository();
    preference_repository = new InMemoryNotificationPreferenceRepository();
    queue = new InMemoryQueueAdapter();

    sut = new SendNotificationUseCase(
      notification_repository,
      preference_repository,
      queue
    );

    queue.clear_messages();
  });

  it('should send notification to all requested channels', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const, 'whatsapp' as const],
      template_id: 'tmpl_welcome',
      payload: {
        user_name: 'John Doe',
        email: 'john@example.com',
      },
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].channel).toBe('email');
    expect(result[1].channel).toBe('whatsapp');
    expect(result[0].target_user_id).toBe('user_123');
    expect(result[0].status).toBe('pending');
  });

  it('should publish events to queue for each channel', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const, 'push' as const],
      template_id: 'tmpl_welcome',
      payload: {
        user_name: 'John Doe',
      },
    };

    await sut.execute(input);

    const email_messages = queue.get_messages_by_topic('notifications.email');
    const push_messages = queue.get_messages_by_topic('notifications.push');

    expect(email_messages).toHaveLength(1);
    expect(push_messages).toHaveLength(1);
    expect(email_messages[0].channel).toBe('email');
    expect(push_messages[0].channel).toBe('push');
  });

  it('should respect user preferences and filter channels', async () => {
    // Criar preferências do usuário (apenas email habilitado)
    const preference = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: false,
        push: false,
      },
    });

    await preference_repository.create(preference);

    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const, 'whatsapp' as const, 'push' as const],
      template_id: 'tmpl_welcome',
      payload: {
        user_name: 'John Doe',
      },
      category: 'transactional' as const,
    };

    const result = await sut.execute(input);

    // Apenas email deve ser enviado
    expect(result).toHaveLength(1);
    expect(result[0].channel).toBe('email');
  });

  it('should override preferences when override_preferences is true', async () => {
    // Criar preferências do usuário (todos desabilitados)
    const preference = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'marketing',
      channels: {
        email: false,
        whatsapp: false,
        push: false,
      },
    });

    await preference_repository.create(preference);

    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const, 'whatsapp' as const],
      template_id: 'tmpl_promo',
      payload: {
        promo_code: 'SAVE20',
      },
      category: 'marketing' as const,
      override_preferences: true,
    };

    const result = await sut.execute(input);

    // Todos os canais devem ser enviados (override)
    expect(result).toHaveLength(2);
  });

  it('should ensure idempotency with same message_id', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const],
      template_id: 'tmpl_welcome',
      payload: {
        user_name: 'John Doe',
      },
      message_id: 'unique_message_123',
    };

    // Primeira execução
    const result1 = await sut.execute(input);
    expect(result1).toHaveLength(1);

    // Segunda execução com mesmo message_id
    const result2 = await sut.execute(input);
    expect(result2).toHaveLength(0); // Não deve criar duplicatas
  });

  it('should throw error for invalid channel', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['sms' as any], // Canal inválido
      template_id: 'tmpl_welcome',
      payload: {},
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidChannelError);
  });

  it('should set default priority to normal', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const],
      template_id: 'tmpl_welcome',
      payload: {},
    };

    const result = await sut.execute(input);

    expect(result[0].priority).toBe('normal');
  });

  it('should respect custom priority', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const],
      template_id: 'tmpl_alert',
      payload: {},
      priority: 'high' as const,
    };

    const result = await sut.execute(input);

    expect(result[0].priority).toBe('high');
  });

  it('should include metadata in notification', async () => {
    const input = {
      target_user_id: 'user_123',
      channels: ['email' as const],
      template_id: 'tmpl_welcome',
      payload: {},
      metadata: {
        source: 'signup_flow',
        campaign_id: 'camp_123',
      },
    };

    const result = await sut.execute(input);

    expect(result[0].metadata).toEqual({
      source: 'signup_flow',
      campaign_id: 'camp_123',
    });
  });
});
