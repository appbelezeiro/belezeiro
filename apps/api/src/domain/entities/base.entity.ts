import { IIDGeneratorService } from '@/domain/services/i-id-generator.service';

export interface BaseEntityConfig {
  id_generator: IIDGeneratorService;
}

export interface BaseEntityProps {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface BaseEntityCreationProps {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

type Props<T> = BaseEntityProps & T;

export abstract class BaseEntity<EProps = {}> {
  private static config: BaseEntityConfig;
  protected props: Props<EProps>;

  protected abstract prefix(): string;

  static configure(config: BaseEntityConfig): void {
    BaseEntity.config = config;
  }

  protected static getConfig(): BaseEntityConfig {
    if (!BaseEntity.config) {
      throw new Error(
        'BaseEntity must be configured before use. Call BaseEntity.configure() first.',
      );
    }
    return BaseEntity.config;
  }

  constructor(props: Omit<Props<EProps>, keyof BaseEntityProps> & BaseEntityCreationProps) {
    const now = new Date();
    const id_generator = BaseEntity.getConfig().id_generator;

    this.props = {
      ...props,
      id: props.id ?? id_generator.generate(this.prefix()),
      created_at: props.created_at ?? now,
      updated_at: props.updated_at ?? now,
    } as Props<EProps>;
  }

  get id(): string {
    return this.props.id;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }

  touch(): void {
    this.props.updated_at = new Date();
  }
}
