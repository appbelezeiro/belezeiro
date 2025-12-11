import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type SpecialtyEntityOwnProps = {
  code: string;
  name: string;
  description: string | undefined;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
};

type SpecialtyEntityCreationProps = Omit<SpecialtyEntityOwnProps, 'is_active' | 'description'> &
  Partial<Pick<SpecialtyEntityOwnProps, 'is_active'>> &
  { description?: string } &
  BaseEntityCreationProps;

type SpecialtyEntityProps = SpecialtyEntityOwnProps & BaseEntityProps;

export class SpecialtyEntity extends BaseEntity<SpecialtyEntityProps> {
  protected prefix(): string {
    return 'spec';
  }

  constructor(props: SpecialtyEntityCreationProps) {
    super({
      ...props,
      description: props.description,
      is_active: props.is_active ?? true,
    });
  }

  // Getters
  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get icon(): string {
    return this.props.icon;
  }

  get is_predefined(): boolean {
    return this.props.is_predefined;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  // Methods
  update_name(name: string): void {
    this.props.name = name;
    this.touch();
  }

  update_description(description: string | undefined): void {
    this.props.description = description;
    this.touch();
  }

  update_icon(icon: string): void {
    this.props.icon = icon;
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
}
