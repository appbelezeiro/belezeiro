import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetUserNotificationPreferencesUseCase } from './get-user-notification-preferences.usecase';
import { InMemoryNotificationPreferenceRepository } from '@/infra/repositories/in-memory/notifications/in-memory-notification-preference.repository';
import { NotificationPreferenceEntity } from '@/domain/entities/notifications/notification-preference.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetUserNotificationPreferencesUseCase', () => {
  let sut: GetUserNotificationPreferencesUseCase;
  let preference_repository: InMemoryNotificationPreferenceRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    preference_repository = new InMemoryNotificationPreferenceRepository();
    sut = new GetUserNotificationPreferencesUseCase(preference_repository);
  });

  it('should return all preferences for user', async () => {
    const preference1 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: true,
        push: true,
      },
    });

    const preference2 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'marketing',
      channels: {
        email: false,
        whatsapp: false,
        push: false,
      },
    });

    await preference_repository.create(preference1);
    await preference_repository.create(preference2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].user_id).toBe('user_123');
    expect(result[1].user_id).toBe('user_123');
  });

  it('should return empty array when user has no preferences', async () => {
    const input = {
      user_id: 'user_without_preferences',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should not return preferences from other users', async () => {
    const preference1 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: true,
        push: true,
      },
    });

    const preference2 = new NotificationPreferenceEntity({
      user_id: 'user_456',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: true,
        push: true,
      },
    });

    await preference_repository.create(preference1);
    await preference_repository.create(preference2);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe('user_123');
  });

  it('should return preferences with all properties', async () => {
    const preference = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: false,
        push: true,
      },
    });

    await preference_repository.create(preference);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result[0].category).toBe('transactional');
    expect(result[0].channels).toEqual({
      email: true,
      whatsapp: false,
      push: true,
    });
  });

  it('should return preferences for different categories', async () => {
    const categories = ['transactional', 'marketing', 'promotional'] as const;

    for (const category of categories) {
      const preference = new NotificationPreferenceEntity({
        user_id: 'user_123',
        category,
        channels: {
          email: true,
          whatsapp: true,
          push: true,
        },
      });
      await preference_repository.create(preference);
    }

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(3);
    expect(result.map((p) => p.category)).toEqual([
      'transactional',
      'marketing',
      'promotional',
    ]);
  });

  it('should handle mixed channel preferences', async () => {
    const preference = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'marketing',
      channels: {
        email: true,
        whatsapp: false,
        push: true,
      },
    });

    await preference_repository.create(preference);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result[0].channels.email).toBe(true);
    expect(result[0].channels.whatsapp).toBe(false);
    expect(result[0].channels.push).toBe(true);
  });

  it('should return preferences ordered by creation', async () => {
    const preference1 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'transactional',
      channels: {
        email: true,
        whatsapp: true,
        push: true,
      },
    });

    const preference2 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'marketing',
      channels: {
        email: false,
        whatsapp: false,
        push: false,
      },
    });

    const preference3 = new NotificationPreferenceEntity({
      user_id: 'user_123',
      category: 'promotional',
      channels: {
        email: true,
        whatsapp: false,
        push: true,
      },
    });

    await preference_repository.create(preference1);
    await preference_repository.create(preference2);
    await preference_repository.create(preference3);

    const input = {
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(preference1.id);
    expect(result[1].id).toBe(preference2.id);
    expect(result[2].id).toBe(preference3.id);
  });
});
