import { BaseEntity } from '../base.entity';
import { UnityEnityProps, UnityEntityCreationProps } from './unit.entity.types';
import { PhoneVO } from '@/domain/value-objects/phone.value-object';
import { AddressVO } from '@/domain/value-objects/address.value-object';
import type { SpecialtyEntity } from '../specialty.entity';
import type { ServiceEntity } from '../service.entity';
import type { AmenityEntity } from '../amenity.entity';
import { URLAddressVO } from '@/domain/value-objects/url-address.value-object';

export class UnitEntity extends BaseEntity<UnityEnityProps> {
  protected prefix(): string {
    return 'unit';
  }

  constructor(props: UnityEntityCreationProps) {
    const phones = props.phones.map((phoneProps) => new PhoneVO(phoneProps));
    const gallery_addresses = props.gallery.length > 0
      ? props.gallery.map((url) => new URLAddressVO(url))
      : [];
    const logo_url = props.logo ? new URLAddressVO(props.logo) : undefined;
    const address = props.address ? new AddressVO(props.address) : undefined;

    super({
      id: props.id,
      orgId: props.orgId,
      name: props.name,
      active: props.active ?? true,
      amenities: props.amenities,
      especialidades: props.especialidades,
      services: props.services,
      gallery: gallery_addresses,
      logo: logo_url,
      preferences: props.preferences ?? {},
      serviceType: props.serviceType,
      created_at: props.created_at,
      updated_at: props.updated_at,
      address,
      phones
    });
  }

  get orgId(): string {
    return this.props.orgId;
  }

  get name(): string {
    return this.props.name;
  }

  get preferences(): UnityEnityProps['preferences'] {
    return this.props.preferences;
  }

  get logo(): URLAddressVO | undefined {
    return this.props.logo;
  }

  get gallery(): URLAddressVO[] {
    return this.props.gallery;
  }

  get active(): boolean {
    return this.props.active;
  }

  get phones(): PhoneVO[] {
    return this.props.phones;
  }

  get address(): AddressVO | undefined {
    return this.props.address;
  }

  get especialidades(): SpecialtyEntity[] {
    return this.props.especialidades;
  }

  get services(): ServiceEntity[] {
    return this.props.services;
  }

  get serviceType(): UnityEnityProps['serviceType'] {
    return this.props.serviceType;
  }

  get amenities(): AmenityEntity[] {
    return this.props.amenities;
  }

  // Update methods
  update_name(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    if (newName === this.props.name) {
      return;
    }

    this.props.name = newName;
    this.touch();
  }

  update_logo(logoUrl: URLAddressVO): void {
    this.props.logo = logoUrl;
    this.touch();
  }

  update_gallery(gallery: URLAddressVO[]): void {
    this.props.gallery = gallery;
    this.touch();
  }

  activate(): void {
    this.props.active = true;
    this.touch();
  }

  deactivate(): void {
    this.props.active = false;
    this.touch();
  }

  update_phones(phones: PhoneVO[]): void {
    this.props.phones = phones;
    this.touch();
  }

  update_address(address: AddressVO | undefined): void {
    this.props.address = address;
    this.touch();
  }

  update_especialidades(especialidades: SpecialtyEntity[]): void {
    this.props.especialidades = especialidades;
    this.touch();
  }

  update_services(services: ServiceEntity[]): void {
    this.props.services = services;
    this.touch();
  }

  update_service_type(serviceType: UnityEnityProps['serviceType']): void {
    this.props.serviceType = serviceType;
    this.touch();
  }

  update_amenities(amenities: AmenityEntity[]): void {
    this.props.amenities = amenities;
    this.touch();
  }

  update_preferences(preferences: UnityEnityProps['preferences']): void {
    this.props.preferences = preferences;
    this.touch();
  }
}
