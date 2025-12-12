export interface AddressProps {
  id?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country?: string;
  complement?: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  unit_id?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class AddressVO {
  constructor(private readonly props: AddressProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get street(): string {
    return this.props.street;
  }

  get number(): string {
    return this.props.number;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get zipcode(): string {
    return this.props.zipcode;
  }

  get country(): string {
    return this.props.country ?? 'BR';
  }

  get complement(): string | undefined {
    return this.props.complement;
  }

  get reference(): string | undefined {
    return this.props.reference;
  }

  get latitude(): number | undefined {
    return this.props.latitude;
  }

  get longitude(): number | undefined {
    return this.props.longitude;
  }

  get unit_id(): string | undefined {
    return this.props.unit_id;
  }

  get user_id(): string | undefined {
    return this.props.user_id;
  }

  get created_at(): Date | undefined {
    return this.props.created_at;
  }

  get updated_at(): Date | undefined {
    return this.props.updated_at;
  }

  /** Retorna o endereço formatado em uma linha */
  get formatted(): string {
    const parts = [
      this.street,
      this.number,
      this.complement,
      this.neighborhood,
      `${this.city} - ${this.state}`,
      this.zipcode,
    ].filter(Boolean);
    return parts.join(', ');
  }

  toObject(): AddressProps {
    return { ...this.props };
  }
}
