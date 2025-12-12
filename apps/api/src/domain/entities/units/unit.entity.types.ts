import { AddressVO, AddressProps } from "@/domain/value-objects/address.value-object";
import { PhoneVO, PhoneProps } from "@/domain/value-objects/phone.value-object";
import { SpecialtyEntity } from "../specialty.entity";
import { ServiceEntity } from "../service.entity";
import { AmenityEntity } from "../amenity.entity";
import { BaseEntityProps } from "../base.entity";
import { URLAddressVO } from "@/domain/value-objects/url-address.value-object";

type UnitPreferences = {
  palletColor: string;
};

export type UnitServiceType = 'on-site' | 'home-care' | 'both';

export type UnityEnityProps = {
  orgId: string;
  name: string;
  preferences: Partial<UnitPreferences>;
  logo: URLAddressVO | undefined;
  gallery: URLAddressVO[];
  active: boolean;
  phones: PhoneVO[];
  address: AddressVO | undefined;
  especialidades: SpecialtyEntity[];
  services: ServiceEntity[];
  serviceType: UnitServiceType;
  amenities: AmenityEntity[];
};

export type UnityEntityCreationProps = {
  orgId: string;
  name: string;
  preferences: Partial<UnitPreferences>;
  logo: string;
  gallery: string[];
  active?: boolean;
  phones: PhoneProps[];
  address?: AddressProps;
  especialidades: SpecialtyEntity[];
  services: ServiceEntity[];
  serviceType: UnitServiceType;
  amenities: AmenityEntity[];
} & Partial<BaseEntityProps>;
