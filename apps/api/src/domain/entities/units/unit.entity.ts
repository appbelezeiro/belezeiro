import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import {
  InvalidWorkingHoursError,
  InvalidCepError,
  InvalidPhoneError,
  InvalidServiceTypeError,
  InvalidEspecialidadeError,
  InvalidServiceError,
  InvalidAmenityError,
  InvalidBrandColorError,
} from '@/domain/errors/units/unit.errors';
import { PREDEFINED_ESPECIALIDADES } from '@/domain/constants/professions';
import { PREDEFINED_SERVICES } from '@/domain/constants/services';
import { PREDEFINED_AMENITIES, AmenityId } from '@/domain/constants/amenities';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type ServiceType = 'local' | 'home' | 'both';

type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
type SubscriptionStatus = 'active' | 'inactive' | 'suspended';

interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt?: Date;
}

interface DaySchedule {
  enabled: boolean;
  open: string; // HH:MM format
  close: string; // HH:MM format
}

interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface EspecialidadeRef {
  id: string;
  name: string;
  icon: string;
}

interface ServiceRef {
  id: string;
  name: string;
  especialidadeId: string;
}

interface LunchBreak {
  enabled: boolean;
  start: string; // HH:MM format
  end: string; // HH:MM format
}

type WorkingHours = Record<DayOfWeek, DaySchedule>;

type UnitEntityOwnProps = {
  organizationId: string;
  name: string;
  brandColor: string;
  logo?: string;
  gallery: string[];
  isActive: boolean;
  whatsapp: string;
  phone?: string;
  address: Address;
  especialidades: EspecialidadeRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  subscription?: Subscription;
};

type UnitEntityCreationProps = Omit<UnitEntityOwnProps, 'isActive' | 'gallery'> &
  Partial<Pick<UnitEntityOwnProps, 'isActive' | 'gallery'>> &
  BaseEntityCreationProps;

type UnitEntityProps = Omit<UnitEntityOwnProps, 'logo' | 'phone'> &
  Pick<UnitEntityOwnProps, 'logo' | 'phone'> &
  BaseEntityProps;

export class UnitEntity extends BaseEntity<UnitEntityProps> {
  protected prefix(): string {
    return 'unit';
  }

  constructor(props: UnitEntityCreationProps) {
    UnitEntity.validateBrandColor(props.brandColor);
    UnitEntity.validateCep(props.address.cep);
    UnitEntity.validatePhone(props.whatsapp);
    if (props.phone) {
      UnitEntity.validatePhone(props.phone);
    }
    UnitEntity.validateServiceType(props.serviceType);
    UnitEntity.validateEspecialidades(props.especialidades);
    UnitEntity.validateServices(props.services, props.especialidades);
    UnitEntity.validateAmenities(props.amenities);

    super({
      ...props,
      isActive: props.isActive ?? true,
      gallery: props.gallery ?? [],
    });
  }

  private static validateBrandColor(color: string): void {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      throw new InvalidBrandColorError('Brand color must be a valid hex color (e.g., #FF0000)');
    }
  }

  private static validateCep(cep: string): void {
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) {
      throw new InvalidCepError('CEP must be in format XXXXX-XXX or XXXXXXXX');
    }
  }

  private static validatePhone(phone: string): void {
    const phoneRegex = /^\+?[\d\s()-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      throw new InvalidPhoneError('Phone must be a valid phone number');
    }
  }

  private static validateServiceType(serviceType: string): void {
    const validTypes: ServiceType[] = ['local', 'home', 'both'];
    if (!validTypes.includes(serviceType as ServiceType)) {
      throw new InvalidServiceTypeError('Service type must be: local, home, or both');
    }
  }

  private static validateEspecialidades(especialidades: EspecialidadeRef[]): void {
    if (especialidades.length === 0) {
      throw new InvalidEspecialidadeError('At least one especialidade must be selected');
    }

    const validEspecialidadeIds = PREDEFINED_ESPECIALIDADES.map((e) => e.id);

    for (const espec of especialidades) {
      if (!validEspecialidadeIds.includes(espec.id)) {
        throw new InvalidEspecialidadeError(`Invalid especialidade ID: ${espec.id}`);
      }
    }
  }

  private static validateServices(services: ServiceRef[], especialidades: EspecialidadeRef[]): void {
    if (services.length === 0) {
      throw new InvalidServiceError('At least one service must be selected');
    }

    const validServiceIds = PREDEFINED_SERVICES.map((s) => s.id);
    const especialidadeIds = especialidades.map((e) => e.id);

    for (const service of services) {
      if (!validServiceIds.includes(service.id)) {
        throw new InvalidServiceError(`Invalid service ID: ${service.id}`);
      }

      // Validate that the service's especialidade is in the selected especialidades
      if (!especialidadeIds.includes(service.especialidadeId)) {
        throw new InvalidServiceError(
          `Service ${service.id} requires especialidade ${service.especialidadeId} which is not selected`
        );
      }
    }
  }

  private static validateAmenities(amenities: AmenityId[]): void {
    const validAmenityIds = PREDEFINED_AMENITIES.map((a) => a.id);

    for (const amenity of amenities) {
      if (!validAmenityIds.includes(amenity)) {
        throw new InvalidAmenityError(`Invalid amenity ID: ${amenity}`);
      }
    }
  }

  // Getters

  get organizationId(): string {
    return this.props.organizationId;
  }

  get name(): string {
    return this.props.name;
  }

  get brandColor(): string {
    return this.props.brandColor;
  }

  get subscription(): Subscription | undefined {
    return this.props.subscription;
  }

  get logo(): string | undefined {
    return this.props.logo;
  }

  get gallery(): string[] {
    return this.props.gallery;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get whatsapp(): string {
    return this.props.whatsapp;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get address(): Address {
    return this.props.address;
  }

  get especialidades(): EspecialidadeRef[] {
    return this.props.especialidades;
  }

  get services(): ServiceRef[] {
    return this.props.services;
  }

  get serviceType(): ServiceType {
    return this.props.serviceType;
  }

  get amenities(): AmenityId[] {
    return this.props.amenities;
  }

  get workingHours(): WorkingHours {
    return this.props.workingHours;
  }

  get lunchBreak(): LunchBreak | undefined {
    return this.props.lunchBreak;
  }

  // Update methods

  update_name(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.props.name = newName;
    this.touch();
  }

  update_brand_color(newColor: string): void {
    UnitEntity.validateBrandColor(newColor);
    this.props.brandColor = newColor;
    this.touch();
  }

  update_subscription(subscription: Subscription): void {
    this.props.subscription = subscription;
    this.touch();
  }

  has_active_subscription(): boolean {
    return this.props.subscription?.status === 'active';
  }

  is_subscription_expired(): boolean {
    if (!this.props.subscription || !this.props.subscription.expiresAt) {
      return false;
    }

    return this.props.subscription.expiresAt < new Date();
  }

  update_logo(logoUrl: string | undefined): void {
    this.props.logo = logoUrl;
    this.touch();
  }

  update_gallery(gallery: string[]): void {
    this.props.gallery = gallery;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  update_contact(whatsapp: string, phone?: string): void {
    UnitEntity.validatePhone(whatsapp);
    if (phone) {
      UnitEntity.validatePhone(phone);
    }
    this.props.whatsapp = whatsapp;
    this.props.phone = phone;
    this.touch();
  }

  update_address(address: Address): void {
    UnitEntity.validateCep(address.cep);
    this.props.address = address;
    this.touch();
  }

  update_especialidades(especialidades: EspecialidadeRef[]): void {
    UnitEntity.validateEspecialidades(especialidades);
    // Re-validate services when especialidades change
    UnitEntity.validateServices(this.props.services, especialidades);
    this.props.especialidades = especialidades;
    this.touch();
  }

  update_services(services: ServiceRef[]): void {
    UnitEntity.validateServices(services, this.props.especialidades);
    this.props.services = services;
    this.touch();
  }

  update_service_type(serviceType: ServiceType): void {
    UnitEntity.validateServiceType(serviceType);
    this.props.serviceType = serviceType;
    this.touch();
  }

  update_amenities(amenities: AmenityId[]): void {
    UnitEntity.validateAmenities(amenities);
    this.props.amenities = amenities;
    this.touch();
  }

  update_working_hours(workingHours: WorkingHours): void {
    UnitEntity.validateWorkingHours(workingHours);
    this.props.workingHours = workingHours;
    this.touch();
  }

  update_lunch_break(lunchBreak: LunchBreak | undefined): void {
    if (lunchBreak) {
      UnitEntity.validateLunchBreak(lunchBreak);
    }
    this.props.lunchBreak = lunchBreak;
    this.touch();
  }

  is_open_on_day(day: DayOfWeek): boolean {
    return this.props.workingHours[day].enabled;
  }
}

export type {
  DayOfWeek,
  DaySchedule,
  ServiceType,
  Address,
  EspecialidadeRef,
  ServiceRef,
  LunchBreak,
  WorkingHours,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
};
