export interface ServiceSeed {
  specialty_code: string;
  code: string;
  name: string;
  description?: string;
  default_duration_minutes: number;
  default_price_cents: number;
}

export const SERVICE_SEEDS: ServiceSeed[] = [
  // Cabeleireiro(a)
  {
    specialty_code: 'cabeleireiro',
    code: 'corte_feminino',
    name: 'Corte Feminino',
    description: 'Corte de cabelo feminino com finalização',
    default_duration_minutes: 60,
    default_price_cents: 8000, // R$ 80,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'corte_masculino',
    name: 'Corte Masculino',
    description: 'Corte de cabelo masculino',
    default_duration_minutes: 40,
    default_price_cents: 5000, // R$ 50,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'corte_infantil',
    name: 'Corte Infantil',
    description: 'Corte de cabelo para crianças',
    default_duration_minutes: 30,
    default_price_cents: 4000, // R$ 40,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'coloracao',
    name: 'Coloração',
    description: 'Coloração completa do cabelo',
    default_duration_minutes: 120,
    default_price_cents: 15000, // R$ 150,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'mechas',
    name: 'Mechas',
    description: 'Aplicação de mechas ou reflexos',
    default_duration_minutes: 180,
    default_price_cents: 20000, // R$ 200,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'hidratacao',
    name: 'Hidratação',
    description: 'Tratamento hidratante para cabelos',
    default_duration_minutes: 45,
    default_price_cents: 6000, // R$ 60,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'escova',
    name: 'Escova',
    description: 'Escova modeladora',
    default_duration_minutes: 45,
    default_price_cents: 5000, // R$ 50,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'penteado',
    name: 'Penteado',
    description: 'Penteado para eventos',
    default_duration_minutes: 90,
    default_price_cents: 10000, // R$ 100,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'progressiva',
    name: 'Progressiva',
    description: 'Escova progressiva',
    default_duration_minutes: 240,
    default_price_cents: 30000, // R$ 300,00
  },
  {
    specialty_code: 'cabeleireiro',
    code: 'botox_capilar',
    name: 'Botox Capilar',
    description: 'Tratamento de botox para cabelos',
    default_duration_minutes: 120,
    default_price_cents: 18000, // R$ 180,00
  },

  // Barbeiro(a)
  {
    specialty_code: 'barbeiro',
    code: 'corte_barba',
    name: 'Corte + Barba',
    description: 'Corte de cabelo e barba completos',
    default_duration_minutes: 60,
    default_price_cents: 6000, // R$ 60,00
  },
  {
    specialty_code: 'barbeiro',
    code: 'barba',
    name: 'Barba',
    description: 'Aparar e modelar barba',
    default_duration_minutes: 30,
    default_price_cents: 3000, // R$ 30,00
  },
  {
    specialty_code: 'barbeiro',
    code: 'corte_navalha',
    name: 'Corte na Navalha',
    description: 'Corte tradicional na navalha',
    default_duration_minutes: 45,
    default_price_cents: 7000, // R$ 70,00
  },
  {
    specialty_code: 'barbeiro',
    code: 'pigmentacao_barba',
    name: 'Pigmentação de Barba',
    description: 'Pigmentação para preencher falhas na barba',
    default_duration_minutes: 45,
    default_price_cents: 8000, // R$ 80,00
  },
  {
    specialty_code: 'barbeiro',
    code: 'relaxamento_barba',
    name: 'Relaxamento de Barba',
    description: 'Tratamento para alisar a barba',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },

  // Manicure
  {
    specialty_code: 'manicure',
    code: 'manicure',
    name: 'Manicure',
    description: 'Cuidados com unhas das mãos',
    default_duration_minutes: 45,
    default_price_cents: 3500, // R$ 35,00
  },
  {
    specialty_code: 'manicure',
    code: 'pedicure',
    name: 'Pedicure',
    description: 'Cuidados com unhas dos pés',
    default_duration_minutes: 60,
    default_price_cents: 4500, // R$ 45,00
  },
  {
    specialty_code: 'manicure',
    code: 'manicure_pedicure',
    name: 'Manicure + Pedicure',
    description: 'Pacote completo de cuidados com as unhas',
    default_duration_minutes: 90,
    default_price_cents: 7000, // R$ 70,00
  },
  {
    specialty_code: 'manicure',
    code: 'unha_gel',
    name: 'Unha em Gel',
    description: 'Aplicação de unha em gel',
    default_duration_minutes: 90,
    default_price_cents: 8000, // R$ 80,00
  },
  {
    specialty_code: 'manicure',
    code: 'alongamento_unhas',
    name: 'Alongamento de Unhas',
    description: 'Alongamento de unhas com fibra ou gel',
    default_duration_minutes: 120,
    default_price_cents: 12000, // R$ 120,00
  },
  {
    specialty_code: 'manicure',
    code: 'unhas_decoradas',
    name: 'Unhas Decoradas',
    description: 'Decoração artística em unhas',
    default_duration_minutes: 60,
    default_price_cents: 5000, // R$ 50,00
  },

  // Esteticista
  {
    specialty_code: 'esteticista',
    code: 'limpeza_pele',
    name: 'Limpeza de Pele',
    description: 'Limpeza profunda facial',
    default_duration_minutes: 90,
    default_price_cents: 12000, // R$ 120,00
  },
  {
    specialty_code: 'esteticista',
    code: 'peeling',
    name: 'Peeling',
    description: 'Peeling facial para renovação da pele',
    default_duration_minutes: 60,
    default_price_cents: 15000, // R$ 150,00
  },
  {
    specialty_code: 'esteticista',
    code: 'drenagem_linfatica',
    name: 'Drenagem Linfática',
    description: 'Massagem de drenagem linfática corporal',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },
  {
    specialty_code: 'esteticista',
    code: 'massagem_modeladora',
    name: 'Massagem Modeladora',
    description: 'Massagem para modelagem corporal',
    default_duration_minutes: 60,
    default_price_cents: 12000, // R$ 120,00
  },
  {
    specialty_code: 'esteticista',
    code: 'tratamento_acne',
    name: 'Tratamento para Acne',
    description: 'Tratamento facial específico para acne',
    default_duration_minutes: 75,
    default_price_cents: 14000, // R$ 140,00
  },

  // Massagista
  {
    specialty_code: 'massagista',
    code: 'massagem_relaxante',
    name: 'Massagem Relaxante',
    description: 'Massagem corporal relaxante',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },
  {
    specialty_code: 'massagista',
    code: 'massagem_terapeutica',
    name: 'Massagem Terapêutica',
    description: 'Massagem terapêutica para alívio de dores',
    default_duration_minutes: 60,
    default_price_cents: 12000, // R$ 120,00
  },
  {
    specialty_code: 'massagista',
    code: 'quick_massage',
    name: 'Quick Massage',
    description: 'Massagem rápida de 15 minutos',
    default_duration_minutes: 15,
    default_price_cents: 3000, // R$ 30,00
  },
  {
    specialty_code: 'massagista',
    code: 'massagem_pedras_quentes',
    name: 'Massagem com Pedras Quentes',
    description: 'Massagem com pedras aquecidas',
    default_duration_minutes: 90,
    default_price_cents: 15000, // R$ 150,00
  },

  // Designer de Sobrancelhas
  {
    specialty_code: 'designer_sobrancelhas',
    code: 'design_sobrancelhas',
    name: 'Design de Sobrancelhas',
    description: 'Modelagem e design de sobrancelhas',
    default_duration_minutes: 30,
    default_price_cents: 4000, // R$ 40,00
  },
  {
    specialty_code: 'designer_sobrancelhas',
    code: 'micropigmentacao',
    name: 'Micropigmentação',
    description: 'Micropigmentação de sobrancelhas',
    default_duration_minutes: 120,
    default_price_cents: 50000, // R$ 500,00
  },
  {
    specialty_code: 'designer_sobrancelhas',
    code: 'henna',
    name: 'Henna',
    description: 'Aplicação de henna nas sobrancelhas',
    default_duration_minutes: 45,
    default_price_cents: 5000, // R$ 50,00
  },

  // Maquiador(a)
  {
    specialty_code: 'maquiador',
    code: 'maquiagem_social',
    name: 'Maquiagem Social',
    description: 'Maquiagem para eventos sociais',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },
  {
    specialty_code: 'maquiador',
    code: 'maquiagem_noiva',
    name: 'Maquiagem de Noiva',
    description: 'Maquiagem especial para noivas',
    default_duration_minutes: 90,
    default_price_cents: 20000, // R$ 200,00
  },
  {
    specialty_code: 'maquiador',
    code: 'automaquiagem',
    name: 'Curso de Automaquiagem',
    description: 'Aula de automaquiagem',
    default_duration_minutes: 120,
    default_price_cents: 15000, // R$ 150,00
  },

  // Depilador(a)
  {
    specialty_code: 'depilador',
    code: 'depilacao_cera',
    name: 'Depilação com Cera',
    description: 'Depilação corporal com cera',
    default_duration_minutes: 45,
    default_price_cents: 8000, // R$ 80,00
  },
  {
    specialty_code: 'depilador',
    code: 'depilacao_laser',
    name: 'Depilação a Laser',
    description: 'Sessão de depilação a laser',
    default_duration_minutes: 60,
    default_price_cents: 20000, // R$ 200,00
  },
  {
    specialty_code: 'depilador',
    code: 'depilacao_luz_pulsada',
    name: 'Depilação Luz Pulsada',
    description: 'Sessão de depilação com luz pulsada',
    default_duration_minutes: 60,
    default_price_cents: 18000, // R$ 180,00
  },

  // Podólogo(a)
  {
    specialty_code: 'podologo',
    code: 'podologia',
    name: 'Podologia',
    description: 'Cuidados profissionais com os pés',
    default_duration_minutes: 60,
    default_price_cents: 8000, // R$ 80,00
  },
  {
    specialty_code: 'podologo',
    code: 'tratamento_calos',
    name: 'Tratamento de Calos',
    description: 'Remoção e tratamento de calos',
    default_duration_minutes: 45,
    default_price_cents: 6000, // R$ 60,00
  },
  {
    specialty_code: 'podologo',
    code: 'tratamento_unhas_encravadas',
    name: 'Tratamento de Unhas Encravadas',
    description: 'Tratamento para unhas encravadas',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },

  // Lash Designer
  {
    specialty_code: 'lash_designer',
    code: 'extensao_cilios',
    name: 'Extensão de Cílios',
    description: 'Aplicação de extensão de cílios fio a fio',
    default_duration_minutes: 120,
    default_price_cents: 15000, // R$ 150,00
  },
  {
    specialty_code: 'lash_designer',
    code: 'lifting_cilios',
    name: 'Lifting de Cílios',
    description: 'Curvatura e tratamento dos cílios naturais',
    default_duration_minutes: 60,
    default_price_cents: 10000, // R$ 100,00
  },
];
