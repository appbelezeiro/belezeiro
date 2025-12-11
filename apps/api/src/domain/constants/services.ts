export interface Service {
  id: string;
  name: string;
  especialidadeId: string;
}

export const PREDEFINED_SERVICES: Service[] = [
  // Cabeleireiro(a)
  { id: 'serv_corte_feminino', name: 'Corte Feminino', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_corte_masculino', name: 'Corte Masculino', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_corte_infantil', name: 'Corte Infantil', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_coloracao', name: 'Coloração', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_mechas', name: 'Mechas', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_hidratacao', name: 'Hidratação', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_escova', name: 'Escova', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_penteado', name: 'Penteado', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_progressiva', name: 'Progressiva', especialidadeId: 'spec_cabeleireiro' },
  { id: 'serv_botox_capilar', name: 'Botox Capilar', especialidadeId: 'spec_cabeleireiro' },

  // Barbeiro(a)
  { id: 'serv_corte_barba', name: 'Corte + Barba', especialidadeId: 'spec_barbeiro' },
  { id: 'serv_barba', name: 'Barba', especialidadeId: 'spec_barbeiro' },
  { id: 'serv_corte_navalha', name: 'Corte na Navalha', especialidadeId: 'spec_barbeiro' },
  { id: 'serv_pigmentacao_barba', name: 'Pigmentação de Barba', especialidadeId: 'spec_barbeiro' },
  { id: 'serv_relaxamento_barba', name: 'Relaxamento de Barba', especialidadeId: 'spec_barbeiro' },

  // Manicure
  { id: 'serv_manicure', name: 'Manicure', especialidadeId: 'spec_manicure' },
  { id: 'serv_pedicure', name: 'Pedicure', especialidadeId: 'spec_manicure' },
  { id: 'serv_manicure_pedicure', name: 'Manicure + Pedicure', especialidadeId: 'spec_manicure' },
  { id: 'serv_unha_gel', name: 'Unha em Gel', especialidadeId: 'spec_manicure' },
  { id: 'serv_alongamento_unhas', name: 'Alongamento de Unhas', especialidadeId: 'spec_manicure' },
  { id: 'serv_unhas_decoradas', name: 'Unhas Decoradas', especialidadeId: 'spec_manicure' },

  // Esteticista
  { id: 'serv_limpeza_pele', name: 'Limpeza de Pele', especialidadeId: 'spec_esteticista' },
  { id: 'serv_peeling', name: 'Peeling', especialidadeId: 'spec_esteticista' },
  { id: 'serv_drenagem_linfatica', name: 'Drenagem Linfática', especialidadeId: 'spec_esteticista' },
  { id: 'serv_massagem_modeladora', name: 'Massagem Modeladora', especialidadeId: 'spec_esteticista' },
  { id: 'serv_tratamento_acne', name: 'Tratamento para Acne', especialidadeId: 'spec_esteticista' },

  // Massagista
  { id: 'serv_massagem_relaxante', name: 'Massagem Relaxante', especialidadeId: 'spec_massagista' },
  { id: 'serv_massagem_terapeutica', name: 'Massagem Terapêutica', especialidadeId: 'spec_massagista' },
  { id: 'serv_quick_massage', name: 'Quick Massage', especialidadeId: 'spec_massagista' },
  {
    id: 'serv_massagem_pedras_quentes',
    name: 'Massagem com Pedras Quentes',
    especialidadeId: 'spec_massagista',
  },

  // Designer de Sobrancelhas
  {
    id: 'serv_design_sobrancelhas',
    name: 'Design de Sobrancelhas',
    especialidadeId: 'spec_designer_sobrancelhas',
  },
  {
    id: 'serv_micropigmentacao',
    name: 'Micropigmentação',
    especialidadeId: 'spec_designer_sobrancelhas',
  },
  { id: 'serv_henna', name: 'Henna', especialidadeId: 'spec_designer_sobrancelhas' },

  // Maquiador(a)
  { id: 'serv_maquiagem_social', name: 'Maquiagem Social', especialidadeId: 'spec_maquiador' },
  { id: 'serv_maquiagem_noiva', name: 'Maquiagem de Noiva', especialidadeId: 'spec_maquiador' },
  { id: 'serv_automaquiagem', name: 'Curso de Automaquiagem', especialidadeId: 'spec_maquiador' },

  // Depilador(a)
  { id: 'serv_depilacao_cera', name: 'Depilação com Cera', especialidadeId: 'spec_depilador' },
  { id: 'serv_depilacao_laser', name: 'Depilação a Laser', especialidadeId: 'spec_depilador' },
  { id: 'serv_depilacao_luz_pulsada', name: 'Depilação Luz Pulsada', especialidadeId: 'spec_depilador' },

  // Podólogo(a)
  { id: 'serv_podologia', name: 'Podologia', especialidadeId: 'spec_podologo' },
  { id: 'serv_tratamento_calos', name: 'Tratamento de Calos', especialidadeId: 'spec_podologo' },
  { id: 'serv_tratamento_unhas_encravadas', name: 'Tratamento de Unhas Encravadas', especialidadeId: 'spec_podologo' },

  // Lash Designer
  { id: 'serv_extensao_cilios', name: 'Extensão de Cílios', especialidadeId: 'spec_lash_designer' },
  { id: 'serv_lifting_cilios', name: 'Lifting de Cílios', especialidadeId: 'spec_lash_designer' },
];
