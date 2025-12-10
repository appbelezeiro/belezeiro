import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

export type NotificationChannel = 'email' | 'whatsapp' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'delivered';
export type NotificationPriority = 'low' | 'normal' | 'high';

type NotificationEntityOwnProps = {
  target_user_id: string;
  channel: NotificationChannel;
  template_id: string;
  payload: Record<string, any>;
  priority: NotificationPriority;
  status: NotificationStatus;
  provider_id?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  message_id: string; // Para idempotência
  sent_at?: Date;
  delivered_at?: Date;
};

type NotificationEntityCreationProps = Omit<
  NotificationEntityOwnProps,
  'status' | 'priority'
> &
  Partial<Pick<NotificationEntityOwnProps, 'status' | 'priority'>> &
  BaseEntityCreationProps;

type NotificationEntityProps = Required<NotificationEntityOwnProps> &
  BaseEntityProps;

export class NotificationEntity extends BaseEntity<NotificationEntityProps> {
  protected prefix(): string {
    return 'notif';
  }

  constructor(props: NotificationEntityCreationProps) {
    super({
      ...props,
      status: props.status ?? 'pending',
      priority: props.priority ?? 'normal',
    });
  }

  // Getters
  get target_user_id(): string {
    return this.props.target_user_id;
  }

  get channel(): NotificationChannel {
    return this.props.channel;
  }

  get template_id(): string {
    return this.props.template_id;
  }

  get payload(): Record<string, any> {
    return this.props.payload;
  }

  get priority(): NotificationPriority {
    return this.props.priority;
  }

  get status(): NotificationStatus {
    return this.props.status;
  }

  get provider_id(): string | undefined {
    return this.props.provider_id;
  }

  get error_message(): string | undefined {
    return this.props.error_message;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get message_id(): string {
    return this.props.message_id;
  }

  get sent_at(): Date | undefined {
    return this.props.sent_at;
  }

  get delivered_at(): Date | undefined {
    return this.props.delivered_at;
  }

  // Métodos de negócio
  mark_as_sent(provider_id: string): void {
    this.props.status = 'sent';
    this.props.provider_id = provider_id;
    this.props.sent_at = new Date();
    this.touch();
  }

  mark_as_delivered(): void {
    this.props.status = 'delivered';
    this.props.delivered_at = new Date();
    this.touch();
  }

  mark_as_failed(error_message: string): void {
    this.props.status = 'failed';
    this.props.error_message = error_message;
    this.touch();
  }

  is_pending(): boolean {
    return this.props.status === 'pending';
  }

  is_sent(): boolean {
    return this.props.status === 'sent';
  }

  is_failed(): boolean {
    return this.props.status === 'failed';
  }

  is_delivered(): boolean {
    return this.props.status === 'delivered';
  }
}
