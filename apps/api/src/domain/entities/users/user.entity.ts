import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type UserEntityOwnProps = {
  name: string;
  email: string;
  providerId: string;
  photoUrl?: string;
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

  get providerId(): string {
    return this.props.providerId;
  }

  get photoUrl(): string | undefined {
    return this.props.photoUrl;
  }

  update_name(new_name: string): void {
    this.props.name = new_name;
    this.touch();
  }

  update_email(new_email: string): void {
    this.props.email = new_email;
    this.touch();
  }

  update_photo_url(new_photo_url: string | undefined): void {
    this.props.photoUrl = new_photo_url;
    this.touch();
  }
}
