import { SERVICE_IDS, SPECIALTY_IDS } from './seed-ids';

export interface Service {
  id: string;
  name: string;
  especialidadeId: string;
}

export const PREDEFINED_SERVICES: Service[] = [
  // Cabeleireiro(a)
  { id: SERVICE_IDS.CORTE_FEMININO, name: 'Corte Feminino', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.CORTE_MASCULINO, name: 'Corte Masculino', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.CORTE_INFANTIL, name: 'Corte Infantil', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.COLORACAO, name: 'Coloração', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.MECHAS, name: 'Mechas', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.HIDRATACAO, name: 'Hidratação', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.ESCOVA, name: 'Escova', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.PENTEADO, name: 'Penteado', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.PROGRESSIVA, name: 'Progressiva', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },
  { id: SERVICE_IDS.BOTOX_CAPILAR, name: 'Botox Capilar', especialidadeId: SPECIALTY_IDS.CABELEIREIRO },

  // Barbeiro(a)
  { id: SERVICE_IDS.CORTE_BARBA, name: 'Corte + Barba', especialidadeId: SPECIALTY_IDS.BARBEIRO },
  { id: SERVICE_IDS.BARBA, name: 'Barba', especialidadeId: SPECIALTY_IDS.BARBEIRO },
  { id: SERVICE_IDS.CORTE_NAVALHA, name: 'Corte na Navalha', especialidadeId: SPECIALTY_IDS.BARBEIRO },
  { id: SERVICE_IDS.PIGMENTACAO_BARBA, name: 'Pigmentação de Barba', especialidadeId: SPECIALTY_IDS.BARBEIRO },
  { id: SERVICE_IDS.RELAXAMENTO_BARBA, name: 'Relaxamento de Barba', especialidadeId: SPECIALTY_IDS.BARBEIRO },

  // Manicure
  { id: SERVICE_IDS.MANICURE, name: 'Manicure', especialidadeId: SPECIALTY_IDS.MANICURE },
  { id: SERVICE_IDS.PEDICURE, name: 'Pedicure', especialidadeId: SPECIALTY_IDS.MANICURE },
  { id: SERVICE_IDS.MANICURE_PEDICURE, name: 'Manicure + Pedicure', especialidadeId: SPECIALTY_IDS.MANICURE },
  { id: SERVICE_IDS.UNHA_GEL, name: 'Unha em Gel', especialidadeId: SPECIALTY_IDS.MANICURE },
  { id: SERVICE_IDS.ALONGAMENTO_UNHAS, name: 'Alongamento de Unhas', especialidadeId: SPECIALTY_IDS.MANICURE },
  { id: SERVICE_IDS.UNHAS_DECORADAS, name: 'Unhas Decoradas', especialidadeId: SPECIALTY_IDS.MANICURE },

  // Esteticista
  { id: SERVICE_IDS.LIMPEZA_PELE, name: 'Limpeza de Pele', especialidadeId: SPECIALTY_IDS.ESTETICISTA },
  { id: SERVICE_IDS.PEELING, name: 'Peeling', especialidadeId: SPECIALTY_IDS.ESTETICISTA },
  { id: SERVICE_IDS.DRENAGEM_LINFATICA, name: 'Drenagem Linfática', especialidadeId: SPECIALTY_IDS.ESTETICISTA },
  { id: SERVICE_IDS.MASSAGEM_MODELADORA, name: 'Massagem Modeladora', especialidadeId: SPECIALTY_IDS.ESTETICISTA },
  { id: SERVICE_IDS.TRATAMENTO_ACNE, name: 'Tratamento para Acne', especialidadeId: SPECIALTY_IDS.ESTETICISTA },

  // Massagista
  { id: SERVICE_IDS.MASSAGEM_RELAXANTE, name: 'Massagem Relaxante', especialidadeId: SPECIALTY_IDS.MASSAGISTA },
  { id: SERVICE_IDS.MASSAGEM_TERAPEUTICA, name: 'Massagem Terapêutica', especialidadeId: SPECIALTY_IDS.MASSAGISTA },
  { id: SERVICE_IDS.QUICK_MASSAGE, name: 'Quick Massage', especialidadeId: SPECIALTY_IDS.MASSAGISTA },
  {
    id: SERVICE_IDS.MASSAGEM_PEDRAS_QUENTES,
    name: 'Massagem com Pedras Quentes',
    especialidadeId: SPECIALTY_IDS.MASSAGISTA,
  },

  // Designer de Sobrancelhas
  {
    id: SERVICE_IDS.DESIGN_SOBRANCELHAS,
    name: 'Design de Sobrancelhas',
    especialidadeId: SPECIALTY_IDS.DESIGNER_SOBRANCELHAS,
  },
  {
    id: SERVICE_IDS.MICROPIGMENTACAO,
    name: 'Micropigmentação',
    especialidadeId: SPECIALTY_IDS.DESIGNER_SOBRANCELHAS,
  },
  { id: SERVICE_IDS.HENNA, name: 'Henna', especialidadeId: SPECIALTY_IDS.DESIGNER_SOBRANCELHAS },

  // Maquiador(a)
  { id: SERVICE_IDS.MAQUIAGEM_SOCIAL, name: 'Maquiagem Social', especialidadeId: SPECIALTY_IDS.MAQUIADOR },
  { id: SERVICE_IDS.MAQUIAGEM_NOIVA, name: 'Maquiagem de Noiva', especialidadeId: SPECIALTY_IDS.MAQUIADOR },
  { id: SERVICE_IDS.AUTOMAQUIAGEM, name: 'Curso de Automaquiagem', especialidadeId: SPECIALTY_IDS.MAQUIADOR },

  // Depilador(a)
  { id: SERVICE_IDS.DEPILACAO_CERA, name: 'Depilação com Cera', especialidadeId: SPECIALTY_IDS.DEPILADOR },
  { id: SERVICE_IDS.DEPILACAO_LASER, name: 'Depilação a Laser', especialidadeId: SPECIALTY_IDS.DEPILADOR },
  { id: SERVICE_IDS.DEPILACAO_LUZ_PULSADA, name: 'Depilação Luz Pulsada', especialidadeId: SPECIALTY_IDS.DEPILADOR },

  // Podólogo(a)
  { id: SERVICE_IDS.PODOLOGIA, name: 'Podologia', especialidadeId: SPECIALTY_IDS.PODOLOGO },
  { id: SERVICE_IDS.TRATAMENTO_CALOS, name: 'Tratamento de Calos', especialidadeId: SPECIALTY_IDS.PODOLOGO },
  { id: SERVICE_IDS.TRATAMENTO_UNHAS_ENCRAVADAS, name: 'Tratamento de Unhas Encravadas', especialidadeId: SPECIALTY_IDS.PODOLOGO },

  // Lash Designer
  { id: SERVICE_IDS.EXTENSAO_CILIOS, name: 'Extensão de Cílios', especialidadeId: SPECIALTY_IDS.LASH_DESIGNER },
  { id: SERVICE_IDS.LIFTING_CILIOS, name: 'Lifting de Cílios', especialidadeId: SPECIALTY_IDS.LASH_DESIGNER },
];
