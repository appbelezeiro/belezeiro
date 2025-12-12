export interface PhoneProps {
  id?: string;
  country_code: string; // Ex: "+55"
  area_code: string; // DDD: "11", "21", etc.
  number: string; // Número sem DDD: "999999999"
  label?: string;
  is_whatsapp?: boolean;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface PhoneInputProps {
  id?: string;
  raw_number: string;
  label?: string;
  is_whatsapp?: boolean;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class PhoneVO {
  private readonly _id?: string;
  private readonly _country_code: string;
  private readonly _area_code: string;
  private readonly _number: string;
  private readonly _label?: string;
  private readonly _is_whatsapp: boolean;
  private readonly _is_verified: boolean;
  private readonly _created_at?: Date;
  private readonly _updated_at?: Date;

  constructor(input: PhoneInputProps | PhoneProps) {
    if ('raw_number' in input) {
      const parsed = PhoneVO.parse(input.raw_number);
      this._country_code = parsed.country_code;
      this._area_code = parsed.area_code;
      this._number = parsed.number;
    } else {
      this._country_code = input.country_code;
      this._area_code = input.area_code;
      this._number = input.number;
    }

    this._id = input.id;
    this._label = input.label;
    this._is_whatsapp = input.is_whatsapp ?? false;
    this._is_verified = input.is_verified ?? false;
    this._created_at = input.created_at;
    this._updated_at = input.updated_at;
  }

  /**
   * Parseia um número de telefone brasileiro
   * Aceita formatos:
   * - "+5511999999999" (completo com código do país)
   * - "5511999999999" (sem +)
   * - "11999999999" (apenas DDD + número)
   * - "999999999" (apenas número - assume DDD padrão)
   */
  private static parse(raw: string): {
    country_code: string;
    area_code: string;
    number: string;
  } {
    // Remove tudo que não é dígito ou +
    const cleaned = raw.replace(/[^\d+]/g, '');

    // Regex para capturar os componentes
    // Grupo 1: código do país (opcional, com ou sem +)
    // Grupo 2: DDD (2 dígitos)
    // Grupo 3: número (8 ou 9 dígitos)
    const fullRegex = /^(\+?55)?(\d{2})(\d{8,9})$/;
    const match = cleaned.match(fullRegex);

    if (match) {
      const [, , areaCode, number] = match;
      return {
        country_code: '+55',
        area_code: areaCode,
        number: number,
      };
    }

    // Se não tem DDD, assume que é apenas o número (8 ou 9 dígitos)
    const numberOnlyRegex = /^(\d{8,9})$/;
    const numberMatch = cleaned.match(numberOnlyRegex);

    if (numberMatch) {
      throw new Error(
        'Número de telefone inválido: DDD é obrigatório. Formato esperado: (DD) NNNNN-NNNN'
      );
    }

    throw new Error(
      `Número de telefone inválido: "${raw}". Formato esperado: +55 (DD) NNNNN-NNNN`
    );
  }

  get id(): string | undefined {
    return this._id;
  }

  get country_code(): string {
    return this._country_code;
  }

  get area_code(): string {
    return this._area_code;
  }

  get number(): string {
    return this._number;
  }

  /** Retorna o número completo formatado: +55 11 999999999 */
  get full_number(): string {
    return `${this._country_code} ${this._area_code} ${this._number}`;
  }

  /** Retorna o número formatado para exibição: (11) 99999-9999 */
  get formatted(): string {
    const num = this._number;
    if (num.length === 9) {
      return `(${this._area_code}) ${num.slice(0, 5)}-${num.slice(5)}`;
    }
    return `(${this._area_code}) ${num.slice(0, 4)}-${num.slice(4)}`;
  }

  get label(): string | undefined {
    return this._label;
  }

  get is_whatsapp(): boolean {
    return this._is_whatsapp;
  }

  get is_verified(): boolean {
    return this._is_verified;
  }

  get created_at(): Date | undefined {
    return this._created_at;
  }

  get updated_at(): Date | undefined {
    return this._updated_at;
  }

  toObject(): PhoneProps {
    return {
      id: this._id,
      country_code: this._country_code,
      area_code: this._area_code,
      number: this._number,
      label: this._label,
      is_whatsapp: this._is_whatsapp,
      is_verified: this._is_verified,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };
  }
}
