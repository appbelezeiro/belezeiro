import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type UserEntityOwnProps = {
  name: string;
  email: string;
};

type UserEntityCreationProps = UserEntityOwnProps & BaseEntityCreationProps;
type UserEntityProps = Required<UserEntityOwnProps> & BaseEntityProps;

export class UserEntity extends BaseEntity<UserEntityProps> {
  protected prefix(): string {
    return 'usr';
  }

  constructor(props: UserEntityCreationProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  update_name(new_name: string): void {
    this.props.name = new_name;
    this.touch();
  }

  update_email(new_email: string): void {
    this.props.email = new_email;
    this.touch();
  }
}
