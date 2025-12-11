import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type UserEntityOwnProps = {
  name: string;
  email: string;
  providerId: string;
  photoUrl?: string;
  onboardingCompleted: boolean;
};

type UserEntityCreationProps = Omit<UserEntityOwnProps, 'onboardingCompleted'> &
  Partial<Pick<UserEntityOwnProps, 'onboardingCompleted'>> &
  BaseEntityCreationProps;

type UserEntityProps = UserEntityOwnProps & BaseEntityProps;

export class UserEntity extends BaseEntity<UserEntityProps> {
  protected prefix(): string {
    return 'usr';
  }

  constructor(props: UserEntityCreationProps) {
    super({
      ...props,
      onboardingCompleted: props.onboardingCompleted ?? false,
    });
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

  get onboardingCompleted(): boolean {
    return this.props.onboardingCompleted;
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

  complete_onboarding(): void {
    this.props.onboardingCompleted = true;
    this.touch();
  }
}
