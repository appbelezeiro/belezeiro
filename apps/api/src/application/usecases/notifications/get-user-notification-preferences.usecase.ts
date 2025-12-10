import { NotificationPreferenceEntity } from '@/domain/entities/notifications/notification-preference.entity';
import { INotificationPreferenceRepository } from '@/application/contracts/notifications/i-notification-preference-repository.interface';

class UseCase {
  constructor(
    private readonly preference_repository: INotificationPreferenceRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const preferences = await this.preference_repository.list_by_user_id(
      input.user_id
    );

    return preferences;
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = Promise<NotificationPreferenceEntity[]>;
}

export { UseCase as GetUserNotificationPreferencesUseCase };
