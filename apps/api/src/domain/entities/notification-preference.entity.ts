import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

export type NotificationCategory = 'transactional' | 'marketing' | 'security' | 'billing';

type ChannelPreferences = {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
};

type NotificationPreferenceEntityOwnProps = {
  user_id: string;
  category: NotificationCategory;
  channels: ChannelPreferences;
  metadata?: Record<string, any>;
};

type NotificationPreferenceEntityCreationProps =
  NotificationPreferenceEntityOwnProps & BaseEntityCreationProps;

type NotificationPreferenceEntityProps =
  Required<NotificationPreferenceEntityOwnProps> & BaseEntityProps;

export class NotificationPreferenceEntity extends BaseEntity<NotificationPreferenceEntityProps> {
  protected prefix(): string {
    return 'npref';
  }

  constructor(props: NotificationPreferenceEntityCreationProps) {
    super(props);
  }

  // Getters
  get user_id(): string {
    return this.props.user_id;
  }

  get category(): NotificationCategory {
    return this.props.category;
  }

  get channels(): ChannelPreferences {
    return this.props.channels;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  // Métodos de negócio
  is_channel_enabled(channel: 'email' | 'whatsapp' | 'push'): boolean {
    return this.props.channels[channel];
  }

  enable_channel(channel: 'email' | 'whatsapp' | 'push'): void {
    this.props.channels[channel] = true;
    this.touch();
  }

  disable_channel(channel: 'email' | 'whatsapp' | 'push'): void {
    this.props.channels[channel] = false;
    this.touch();
  }

  update_channels(channels: Partial<ChannelPreferences>): void {
    this.props.channels = { ...this.props.channels, ...channels };
    this.touch();
  }

  get_enabled_channels(): Array<'email' | 'whatsapp' | 'push'> {
    const enabled: Array<'email' | 'whatsapp' | 'push'> = [];
    if (this.props.channels.email) enabled.push('email');
    if (this.props.channels.whatsapp) enabled.push('whatsapp');
    if (this.props.channels.push) enabled.push('push');
    return enabled;
  }
}
