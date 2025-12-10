import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

export type TemplateChannel = 'email' | 'whatsapp' | 'push';

type NotificationTemplateEntityOwnProps = {
  name: string;
  channel: TemplateChannel;
  subject?: string; // Para email
  body_template: string; // Template com placeholders (ex: Handlebars)
  title_template?: string; // Para push notifications
  variables: string[]; // Lista de variáveis aceitas
  version: number;
  is_active: boolean;
  metadata?: Record<string, any>;
};

type NotificationTemplateEntityCreationProps = Omit<
  NotificationTemplateEntityOwnProps,
  'version' | 'is_active'
> &
  Partial<Pick<NotificationTemplateEntityOwnProps, 'version' | 'is_active'>> &
  BaseEntityCreationProps;

type NotificationTemplateEntityProps = Required<NotificationTemplateEntityOwnProps> &
  BaseEntityProps;

export class NotificationTemplateEntity extends BaseEntity<NotificationTemplateEntityProps> {
  protected prefix(): string {
    return 'tmpl';
  }

  constructor(props: NotificationTemplateEntityCreationProps) {
    super({
      ...props,
      version: props.version ?? 1,
      is_active: props.is_active ?? true,
    });
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get channel(): TemplateChannel {
    return this.props.channel;
  }

  get subject(): string | undefined {
    return this.props.subject;
  }

  get body_template(): string {
    return this.props.body_template;
  }

  get title_template(): string | undefined {
    return this.props.title_template;
  }

  get variables(): string[] {
    return this.props.variables;
  }

  get version(): number {
    return this.props.version;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  // Métodos de negócio
  update_template(body_template: string, variables: string[]): void {
    this.props.body_template = body_template;
    this.props.variables = variables;
    this.props.version += 1;
    this.touch();
  }

  update_subject(subject: string): void {
    this.props.subject = subject;
    this.touch();
  }

  update_title_template(title_template: string): void {
    this.props.title_template = title_template;
    this.touch();
  }

  activate(): void {
    this.props.is_active = true;
    this.touch();
  }

  deactivate(): void {
    this.props.is_active = false;
    this.touch();
  }

  validate_variables(payload: Record<string, any>): boolean {
    return this.props.variables.every((variable) => variable in payload);
  }
}
