import { NotificationEntity } from '@/domain/entities/notifications/notification.entity';
import { INotificationRepository } from '@/application/contracts/notifications/i-notification-repository.interface';
import { INotificationPreferenceRepository } from '@/application/contracts/notifications/i-notification-preference-repository.interface';
import { IQueue } from '@/application/contracts/providers/i-queue.interface';
import { InvalidChannelError } from '@/domain/errors/notifications/invalid-channel.error';
import { v4 as uuidv4 } from 'uuid';

export type NotificationChannel = 'email' | 'whatsapp' | 'push';
export type NotificationPriority = 'low' | 'normal' | 'high';

// Event types para a fila
export type NotificationEvent = {
  notification_id: string;
  message_id: string;
  target_user_id: string;
  channel: NotificationChannel;
  template_id: string;
  payload: Record<string, any>;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
};

class UseCase {
  constructor(
    private readonly notification_repository: INotificationRepository,
    private readonly preference_repository: INotificationPreferenceRepository,
    private readonly queue: IQueue
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const notifications: NotificationEntity[] = [];

    // 1. Validar canais
    const valid_channels: NotificationChannel[] = ['email', 'whatsapp', 'push'];
    for (const channel of input.channels) {
      if (!valid_channels.includes(channel)) {
        throw new InvalidChannelError(`Invalid channel: ${channel}`);
      }
    }

    // 2. Buscar preferências do usuário (se fornecido user_id)
    let enabled_channels = input.channels;

    if (input.target_user_id && !input.override_preferences) {
      const preferences = await this.preference_repository.list_by_user_id(
        input.target_user_id
      );

      // Filtrar canais com base nas preferências
      // Por padrão, se não houver preferências, permitir todos os canais
      if (preferences.length > 0) {
        const category = input.category || 'transactional';
        const user_pref = preferences.find((p) => p.category === category);

        if (user_pref) {
          enabled_channels = input.channels.filter((channel) =>
            user_pref.is_channel_enabled(channel)
          );
        }
      }
    }

    // Se override_preferences está ativo, usar todos os canais solicitados
    if (input.override_preferences) {
      enabled_channels = input.channels;
    }

    // 3. Gerar message_id único para idempotência
    const message_id = input.message_id || uuidv4();

    // 4. Verificar idempotência (se já existe notificação com este message_id)
    const existing = await this.notification_repository.find_by_message_id(
      message_id
    );

    if (existing) {
      // Já existe, retornar sem fazer nada (idempotente)
      return [];
    }

    // 5. Criar notificações para cada canal habilitado
    for (const channel of enabled_channels) {
      const notification = new NotificationEntity({
        target_user_id: input.target_user_id || 'system',
        channel,
        template_id: input.template_id,
        payload: input.payload,
        priority: input.priority,
        message_id,
        metadata: input.metadata,
      });

      // Persistir notificação
      const saved = await this.notification_repository.create(notification);
      notifications.push(saved);

      // 6. Publicar evento na fila para processamento assíncrono
      const event: NotificationEvent = {
        notification_id: saved.id,
        message_id,
        target_user_id: saved.target_user_id,
        channel: saved.channel,
        template_id: saved.template_id,
        payload: saved.payload,
        priority: saved.priority,
        metadata: saved.metadata,
      };

      const topic = `notifications.${channel}`;
      await this.queue.publish(topic, event);
    }

    return notifications;
  }
}

declare namespace UseCase {
  export type Input = {
    target_user_id?: string;
    channels: NotificationChannel[];
    template_id: string;
    payload: Record<string, any>;
    priority?: NotificationPriority;
    metadata?: Record<string, any>;
    category?: 'transactional' | 'marketing' | 'security' | 'billing';
    override_preferences?: boolean; // Permite override das preferências do usuário
    message_id?: string; // Para idempotência externa
  };

  export type Output = Promise<NotificationEntity[]>;
}

export { UseCase as SendNotificationUseCase };
