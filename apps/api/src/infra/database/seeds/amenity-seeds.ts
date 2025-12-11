export interface AmenitySeed {
  code: string;
  name: string;
  description?: string;
  icon: string;
}

export const AMENITY_SEEDS: AmenitySeed[] = [
  {
    code: 'wifi',
    name: 'Wi-Fi',
    description: 'Internet sem fio gratuita para clientes',
    icon: 'wifi',
  },
  {
    code: 'parking',
    name: 'Estacionamento',
    description: 'Vagas de estacionamento disponíveis',
    icon: 'car',
  },
  {
    code: 'coffee',
    name: 'Café / Água',
    description: 'Bebidas quentes e água disponíveis',
    icon: 'coffee',
  },
  {
    code: 'ac',
    name: 'Ar-condicionado',
    description: 'Ambiente climatizado',
    icon: 'wind',
  },
  {
    code: 'snacks',
    name: 'Snacks',
    description: 'Lanches e petiscos disponíveis',
    icon: 'cookie',
  },
  {
    code: 'waiting-room',
    name: 'Sala de espera',
    description: 'Área confortável para aguardar atendimento',
    icon: 'sofa',
  },
  {
    code: 'accessibility',
    name: 'Acessibilidade',
    description: 'Instalações acessíveis para pessoas com deficiência',
    icon: 'accessibility',
  },
];
