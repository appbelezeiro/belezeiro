export interface SpecialtySeed {
  code: string;
  name: string;
  description?: string;
  icon: string;
}

export const SPECIALTY_SEEDS: SpecialtySeed[] = [
  {
    code: 'cabeleireiro',
    name: 'Cabeleireiro(a)',
    description: 'Profissional especializado em cortes, coloração, tratamentos e penteados',
    icon: '✂️',
  },
  {
    code: 'barbeiro',
    name: 'Barbeiro(a)',
    description: 'Especialista em cortes masculinos, barba e tratamentos capilares masculinos',
    icon: '💈',
  },
  {
    code: 'manicure',
    name: 'Manicure',
    description: 'Profissional de cuidados com unhas das mãos e pés',
    icon: '💅',
  },
  {
    code: 'esteticista',
    name: 'Esteticista',
    description: 'Especialista em tratamentos faciais e corporais',
    icon: '✨',
  },
  {
    code: 'massagista',
    name: 'Massagista',
    description: 'Profissional de massagens relaxantes e terapêuticas',
    icon: '💆',
  },
  {
    code: 'designer_sobrancelhas',
    name: 'Designer de Sobrancelhas',
    description: 'Especialista em design e tratamento de sobrancelhas',
    icon: '👁️',
  },
  {
    code: 'maquiador',
    name: 'Maquiador(a)',
    description: 'Profissional de maquiagem para diversos eventos',
    icon: '💄',
  },
  {
    code: 'depilador',
    name: 'Depilador(a)',
    description: 'Especialista em depilação e remoção de pelos',
    icon: '🌸',
  },
  {
    code: 'podologo',
    name: 'Podólogo(a)',
    description: 'Profissional de cuidados com os pés',
    icon: '🦶',
  },
  {
    code: 'lash_designer',
    name: 'Lash Designer',
    description: 'Especialista em extensão e design de cílios',
    icon: '👁️‍🗨️',
  },
];
