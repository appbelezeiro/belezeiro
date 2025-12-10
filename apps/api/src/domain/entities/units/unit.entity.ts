import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import {
  InvalidWorkingHoursError,
  InvalidCepError,
  InvalidPhoneError,
  InvalidServiceTypeError,
  InvalidProfessionError,
  InvalidServiceError,
  InvalidAmenityError,
} from '@/domain/errors/units/unit.errors';
import { PREDEFINED_PROFESSIONS } from '@/domain/constants/professions';
import { PREDEFINED_SERVICES } from '@/domain/constants/services';
import { PREDEFINED_AMENITIES, AmenityId } from '@/domain/constants/amenities';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type ServiceType = 'local' | 'home' | 'both';

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

interface ProfessionRef {
  id: string;
  name: string;
  icon: string;
}

interface ServiceRef {
  id: string;
  name: string;
  professionId: string;
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
  logo?: string;
  gallery: string[];
  isActive: boolean;
  whatsapp: string;
  phone?: string;
  address: Address;
  professions: ProfessionRef[];
  services: ServiceRef[];
  serviceType: ServiceType;
  amenities: AmenityId[];
  workingHours: WorkingHours;
  lunchBreak?: LunchBreak;
};

type UnitEntityCreationProps = Omit<UnitEntityOwnProps, 'isActive' | 'gallery'> &
  Partial<Pick<UnitEntityOwnProps, 'isActive' | 'gallery'>> &
  BaseEntityCreationProps;

type UnitEntityProps = Required<UnitEntityOwnProps> & BaseEntityProps;

export class UnitEntity extends BaseEntity<UnitEntityProps> {
  protected prefix(): string {
    return 'unit';
  }

  constructor(props: UnitEntityCreationProps) {
    UnitEntity.validateCep(props.address.cep);
    UnitEntity.validatePhone(props.whatsapp);
    if (props.phone) {
      UnitEntity.validatePhone(props.phone);
    }
    UnitEntity.validateServiceType(props.serviceType);
    UnitEntity.validateWorkingHours(props.workingHours);
    UnitEntity.validateProfessions(props.professions);
    UnitEntity.validateServices(props.services, props.professions);
    UnitEntity.validateAmenities(props.amenities);

    if (props.lunchBreak) {
      UnitEntity.validateLunchBreak(props.lunchBreak);
    }

    super({
      ...props,
      isActive: props.isActive ?? true,
      gallery: props.gallery ?? [],
    });
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

  private static validateTimeFormat(time: string, fieldName: string): void {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      throw new InvalidWorkingHoursError(
        `${fieldName} must be in HH:MM format (e.g., 09:00, 18:30)`
      );
    }
  }

  private static validateWorkingHours(workingHours: WorkingHours): void {
    const days: DayOfWeek[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    for (const day of days) {
      const schedule = workingHours[day];
      if (!schedule) {
        throw new InvalidWorkingHoursError(`Missing schedule for ${day}`);
      }

      if (schedule.enabled) {
        UnitEntity.validateTimeFormat(schedule.open, `${day} open time`);
        UnitEntity.validateTimeFormat(schedule.close, `${day} close time`);

        if (schedule.open >= schedule.close) {
          throw new InvalidWorkingHoursError(
            `${day}: open time (${schedule.open}) must be before close time (${schedule.close})`
          );
        }
      }
    }
  }

  private static validateLunchBreak(lunchBreak: LunchBreak): void {
    if (lunchBreak.enabled) {
      UnitEntity.validateTimeFormat(lunchBreak.start, 'lunch break start');
      UnitEntity.validateTimeFormat(lunchBreak.end, 'lunch break end');

      if (lunchBreak.start >= lunchBreak.end) {
        throw new InvalidWorkingHoursError(
          `Lunch break: start time (${lunchBreak.start}) must be before end time (${lunchBreak.end})`
        );
      }
    }
  }

  private static validateProfessions(professions: ProfessionRef[]): void {
    if (professions.length === 0) {
      throw new InvalidProfessionError('At least one profession must be selected');
    }

    const validProfessionIds = PREDEFINED_PROFESSIONS.map((p) => p.id);

    for (const prof of professions) {
      if (!validProfessionIds.includes(prof.id)) {
        throw new InvalidProfessionError(`Invalid profession ID: ${prof.id}`);
      }
    }
  }

  private static validateServices(services: ServiceRef[], professions: ProfessionRef[]): void {
    if (services.length === 0) {
      throw new InvalidServiceError('At least one service must be selected');
    }

    const validServiceIds = PREDEFINED_SERVICES.map((s) => s.id);
    const professionIds = professions.map((p) => p.id);

    for (const service of services) {
      if (!validServiceIds.includes(service.id)) {
        throw new InvalidServiceError(`Invalid service ID: ${service.id}`);
      }

      // Validate that the service's profession is in the selected professions
      if (!professionIds.includes(service.professionId)) {
        throw new InvalidServiceError(
          `Service ${service.id} requires profession ${service.professionId} which is not selected`
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

  get professions(): ProfessionRef[] {
    return this.props.professions;
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

  update_professions(professions: ProfessionRef[]): void {
    UnitEntity.validateProfessions(professions);
    // Re-validate services when professions change
    UnitEntity.validateServices(this.props.services, professions);
    this.props.professions = professions;
    this.touch();
  }

  update_services(services: ServiceRef[]): void {
    UnitEntity.validateServices(services, this.props.professions);
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
  ProfessionRef,
  ServiceRef,
  LunchBreak,
  WorkingHours,
};
