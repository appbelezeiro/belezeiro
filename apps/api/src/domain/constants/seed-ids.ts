/**
 * Seed IDs - Deterministic IDs for seeded data
 *
 * This file provides deterministic IDs for all seeded data, allowing
 * lookup without knowing the exact ID. IDs are generated using the pattern:
 * `{prefix}_{code}` - e.g., `spec_cabeleireiro`, `serv_corte_feminino`
 *
 * Usage:
 *   import { SEED_IDS } from '@/domain/constants/seed-ids';
 *   const specialtyId = SEED_IDS.SPECIALTY.CABELEIREIRO;
 *   const serviceId = SEED_IDS.SERVICE.CORTE_FEMININO;
 */

// ============================================
// ID Generation Helper
// ============================================

type SeedPrefix = 'spec' | 'serv' | 'amen';

/**
 * Generates a deterministic ID from prefix and code
 */
export function generateSeedId(prefix: SeedPrefix, code: string): string {
  return `${prefix}_${code}`;
}

// ============================================
// SPECIALTY IDS
// ============================================

export const SPECIALTY_CODES = {
  CABELEIREIRO: 'cabeleireiro',
  BARBEIRO: 'barbeiro',
  MANICURE: 'manicure',
  ESTETICISTA: 'esteticista',
  MASSAGISTA: 'massagista',
  DESIGNER_SOBRANCELHAS: 'designer_sobrancelhas',
  MAQUIADOR: 'maquiador',
  DEPILADOR: 'depilador',
  PODOLOGO: 'podologo',
  LASH_DESIGNER: 'lash_designer',
} as const;

export type SpecialtyCode = (typeof SPECIALTY_CODES)[keyof typeof SPECIALTY_CODES];

export const SPECIALTY_IDS = {
  CABELEIREIRO: generateSeedId('spec', SPECIALTY_CODES.CABELEIREIRO),
  BARBEIRO: generateSeedId('spec', SPECIALTY_CODES.BARBEIRO),
  MANICURE: generateSeedId('spec', SPECIALTY_CODES.MANICURE),
  ESTETICISTA: generateSeedId('spec', SPECIALTY_CODES.ESTETICISTA),
  MASSAGISTA: generateSeedId('spec', SPECIALTY_CODES.MASSAGISTA),
  DESIGNER_SOBRANCELHAS: generateSeedId('spec', SPECIALTY_CODES.DESIGNER_SOBRANCELHAS),
  MAQUIADOR: generateSeedId('spec', SPECIALTY_CODES.MAQUIADOR),
  DEPILADOR: generateSeedId('spec', SPECIALTY_CODES.DEPILADOR),
  PODOLOGO: generateSeedId('spec', SPECIALTY_CODES.PODOLOGO),
  LASH_DESIGNER: generateSeedId('spec', SPECIALTY_CODES.LASH_DESIGNER),
} as const;

export type SpecialtyId = (typeof SPECIALTY_IDS)[keyof typeof SPECIALTY_IDS];

// ============================================
// AMENITY IDS
// ============================================

export const AMENITY_CODES = {
  WIFI: 'wifi',
  PARKING: 'parking',
  COFFEE: 'coffee',
  AC: 'ac',
  SNACKS: 'snacks',
  WAITING_ROOM: 'waiting-room',
  ACCESSIBILITY: 'accessibility',
} as const;

export type AmenityCode = (typeof AMENITY_CODES)[keyof typeof AMENITY_CODES];

export const AMENITY_IDS = {
  WIFI: generateSeedId('amen', AMENITY_CODES.WIFI),
  PARKING: generateSeedId('amen', AMENITY_CODES.PARKING),
  COFFEE: generateSeedId('amen', AMENITY_CODES.COFFEE),
  AC: generateSeedId('amen', AMENITY_CODES.AC),
  SNACKS: generateSeedId('amen', AMENITY_CODES.SNACKS),
  WAITING_ROOM: generateSeedId('amen', AMENITY_CODES.WAITING_ROOM),
  ACCESSIBILITY: generateSeedId('amen', AMENITY_CODES.ACCESSIBILITY),
} as const;

export type AmenityId = (typeof AMENITY_IDS)[keyof typeof AMENITY_IDS];

// ============================================
// SERVICE IDS
// ============================================

export const SERVICE_CODES = {
  // Cabeleireiro
  CORTE_FEMININO: 'corte_feminino',
  CORTE_MASCULINO: 'corte_masculino',
  CORTE_INFANTIL: 'corte_infantil',
  COLORACAO: 'coloracao',
  MECHAS: 'mechas',
  HIDRATACAO: 'hidratacao',
  ESCOVA: 'escova',
  PENTEADO: 'penteado',
  PROGRESSIVA: 'progressiva',
  BOTOX_CAPILAR: 'botox_capilar',

  // Barbeiro
  CORTE_BARBA: 'corte_barba',
  BARBA: 'barba',
  CORTE_NAVALHA: 'corte_navalha',
  PIGMENTACAO_BARBA: 'pigmentacao_barba',
  RELAXAMENTO_BARBA: 'relaxamento_barba',

  // Manicure
  MANICURE: 'manicure',
  PEDICURE: 'pedicure',
  MANICURE_PEDICURE: 'manicure_pedicure',
  UNHA_GEL: 'unha_gel',
  ALONGAMENTO_UNHAS: 'alongamento_unhas',
  UNHAS_DECORADAS: 'unhas_decoradas',

  // Esteticista
  LIMPEZA_PELE: 'limpeza_pele',
  PEELING: 'peeling',
  DRENAGEM_LINFATICA: 'drenagem_linfatica',
  MASSAGEM_MODELADORA: 'massagem_modeladora',
  TRATAMENTO_ACNE: 'tratamento_acne',

  // Massagista
  MASSAGEM_RELAXANTE: 'massagem_relaxante',
  MASSAGEM_TERAPEUTICA: 'massagem_terapeutica',
  QUICK_MASSAGE: 'quick_massage',
  MASSAGEM_PEDRAS_QUENTES: 'massagem_pedras_quentes',

  // Designer de Sobrancelhas
  DESIGN_SOBRANCELHAS: 'design_sobrancelhas',
  MICROPIGMENTACAO: 'micropigmentacao',
  HENNA: 'henna',

  // Maquiador
  MAQUIAGEM_SOCIAL: 'maquiagem_social',
  MAQUIAGEM_NOIVA: 'maquiagem_noiva',
  AUTOMAQUIAGEM: 'automaquiagem',

  // Depilador
  DEPILACAO_CERA: 'depilacao_cera',
  DEPILACAO_LASER: 'depilacao_laser',
  DEPILACAO_LUZ_PULSADA: 'depilacao_luz_pulsada',

  // Podólogo
  PODOLOGIA: 'podologia',
  TRATAMENTO_CALOS: 'tratamento_calos',
  TRATAMENTO_UNHAS_ENCRAVADAS: 'tratamento_unhas_encravadas',

  // Lash Designer
  EXTENSAO_CILIOS: 'extensao_cilios',
  LIFTING_CILIOS: 'lifting_cilios',
} as const;

export type ServiceCode = (typeof SERVICE_CODES)[keyof typeof SERVICE_CODES];

export const SERVICE_IDS = {
  // Cabeleireiro
  CORTE_FEMININO: generateSeedId('serv', SERVICE_CODES.CORTE_FEMININO),
  CORTE_MASCULINO: generateSeedId('serv', SERVICE_CODES.CORTE_MASCULINO),
  CORTE_INFANTIL: generateSeedId('serv', SERVICE_CODES.CORTE_INFANTIL),
  COLORACAO: generateSeedId('serv', SERVICE_CODES.COLORACAO),
  MECHAS: generateSeedId('serv', SERVICE_CODES.MECHAS),
  HIDRATACAO: generateSeedId('serv', SERVICE_CODES.HIDRATACAO),
  ESCOVA: generateSeedId('serv', SERVICE_CODES.ESCOVA),
  PENTEADO: generateSeedId('serv', SERVICE_CODES.PENTEADO),
  PROGRESSIVA: generateSeedId('serv', SERVICE_CODES.PROGRESSIVA),
  BOTOX_CAPILAR: generateSeedId('serv', SERVICE_CODES.BOTOX_CAPILAR),

  // Barbeiro
  CORTE_BARBA: generateSeedId('serv', SERVICE_CODES.CORTE_BARBA),
  BARBA: generateSeedId('serv', SERVICE_CODES.BARBA),
  CORTE_NAVALHA: generateSeedId('serv', SERVICE_CODES.CORTE_NAVALHA),
  PIGMENTACAO_BARBA: generateSeedId('serv', SERVICE_CODES.PIGMENTACAO_BARBA),
  RELAXAMENTO_BARBA: generateSeedId('serv', SERVICE_CODES.RELAXAMENTO_BARBA),

  // Manicure
  MANICURE: generateSeedId('serv', SERVICE_CODES.MANICURE),
  PEDICURE: generateSeedId('serv', SERVICE_CODES.PEDICURE),
  MANICURE_PEDICURE: generateSeedId('serv', SERVICE_CODES.MANICURE_PEDICURE),
  UNHA_GEL: generateSeedId('serv', SERVICE_CODES.UNHA_GEL),
  ALONGAMENTO_UNHAS: generateSeedId('serv', SERVICE_CODES.ALONGAMENTO_UNHAS),
  UNHAS_DECORADAS: generateSeedId('serv', SERVICE_CODES.UNHAS_DECORADAS),

  // Esteticista
  LIMPEZA_PELE: generateSeedId('serv', SERVICE_CODES.LIMPEZA_PELE),
  PEELING: generateSeedId('serv', SERVICE_CODES.PEELING),
  DRENAGEM_LINFATICA: generateSeedId('serv', SERVICE_CODES.DRENAGEM_LINFATICA),
  MASSAGEM_MODELADORA: generateSeedId('serv', SERVICE_CODES.MASSAGEM_MODELADORA),
  TRATAMENTO_ACNE: generateSeedId('serv', SERVICE_CODES.TRATAMENTO_ACNE),

  // Massagista
  MASSAGEM_RELAXANTE: generateSeedId('serv', SERVICE_CODES.MASSAGEM_RELAXANTE),
  MASSAGEM_TERAPEUTICA: generateSeedId('serv', SERVICE_CODES.MASSAGEM_TERAPEUTICA),
  QUICK_MASSAGE: generateSeedId('serv', SERVICE_CODES.QUICK_MASSAGE),
  MASSAGEM_PEDRAS_QUENTES: generateSeedId('serv', SERVICE_CODES.MASSAGEM_PEDRAS_QUENTES),

  // Designer de Sobrancelhas
  DESIGN_SOBRANCELHAS: generateSeedId('serv', SERVICE_CODES.DESIGN_SOBRANCELHAS),
  MICROPIGMENTACAO: generateSeedId('serv', SERVICE_CODES.MICROPIGMENTACAO),
  HENNA: generateSeedId('serv', SERVICE_CODES.HENNA),

  // Maquiador
  MAQUIAGEM_SOCIAL: generateSeedId('serv', SERVICE_CODES.MAQUIAGEM_SOCIAL),
  MAQUIAGEM_NOIVA: generateSeedId('serv', SERVICE_CODES.MAQUIAGEM_NOIVA),
  AUTOMAQUIAGEM: generateSeedId('serv', SERVICE_CODES.AUTOMAQUIAGEM),

  // Depilador
  DEPILACAO_CERA: generateSeedId('serv', SERVICE_CODES.DEPILACAO_CERA),
  DEPILACAO_LASER: generateSeedId('serv', SERVICE_CODES.DEPILACAO_LASER),
  DEPILACAO_LUZ_PULSADA: generateSeedId('serv', SERVICE_CODES.DEPILACAO_LUZ_PULSADA),

  // Podólogo
  PODOLOGIA: generateSeedId('serv', SERVICE_CODES.PODOLOGIA),
  TRATAMENTO_CALOS: generateSeedId('serv', SERVICE_CODES.TRATAMENTO_CALOS),
  TRATAMENTO_UNHAS_ENCRAVADAS: generateSeedId('serv', SERVICE_CODES.TRATAMENTO_UNHAS_ENCRAVADAS),

  // Lash Designer
  EXTENSAO_CILIOS: generateSeedId('serv', SERVICE_CODES.EXTENSAO_CILIOS),
  LIFTING_CILIOS: generateSeedId('serv', SERVICE_CODES.LIFTING_CILIOS),
} as const;

export type ServiceId = (typeof SERVICE_IDS)[keyof typeof SERVICE_IDS];

// ============================================
// UNIFIED SEED_IDS OBJECT
// ============================================

/**
 * Central object to access all seed IDs
 *
 * @example
 * ```ts
 * import { SEED_IDS } from '@/domain/constants/seed-ids';
 *
 * // Get specialty ID
 * const cabeleireiroId = SEED_IDS.SPECIALTY.CABELEIREIRO; // 'spec_cabeleireiro'
 *
 * // Get service ID
 * const corteId = SEED_IDS.SERVICE.CORTE_FEMININO; // 'serv_corte_feminino'
 *
 * // Get amenity ID
 * const wifiId = SEED_IDS.AMENITY.WIFI; // 'amen_wifi'
 * ```
 */
export const SEED_IDS = {
  SPECIALTY: SPECIALTY_IDS,
  SERVICE: SERVICE_IDS,
  AMENITY: AMENITY_IDS,
} as const;

/**
 * Central object to access all seed codes
 */
export const SEED_CODES = {
  SPECIALTY: SPECIALTY_CODES,
  SERVICE: SERVICE_CODES,
  AMENITY: AMENITY_CODES,
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get specialty ID by code
 */
export function getSpecialtyIdByCode(code: SpecialtyCode): string {
  return generateSeedId('spec', code);
}

/**
 * Get service ID by code
 */
export function getServiceIdByCode(code: ServiceCode): string {
  return generateSeedId('serv', code);
}

/**
 * Get amenity ID by code
 */
export function getAmenityIdByCode(code: AmenityCode): string {
  return generateSeedId('amen', code);
}

/**
 * Check if an ID is a seed ID (deterministic)
 */
export function isSeedId(id: string): boolean {
  const allIds = [
    ...Object.values(SPECIALTY_IDS),
    ...Object.values(SERVICE_IDS),
    ...Object.values(AMENITY_IDS),
  ];
  return allIds.includes(id as any);
}
