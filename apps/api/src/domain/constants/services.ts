export interface Service {
  id: string;
  name: string;
  professionId: string;
}

export const PREDEFINED_SERVICES: Service[] = [
  // Cabeleireiro(a)
  { id: 'serv_corte_feminino', name: 'Corte Feminino', professionId: 'prof_cabeleireiro' },
  { id: 'serv_corte_masculino', name: 'Corte Masculino', professionId: 'prof_cabeleireiro' },
  { id: 'serv_corte_infantil', name: 'Corte Infantil', professionId: 'prof_cabeleireiro' },
  { id: 'serv_coloracao', name: 'Coloração', professionId: 'prof_cabeleireiro' },
  { id: 'serv_mechas', name: 'Mechas', professionId: 'prof_cabeleireiro' },
  { id: 'serv_hidratacao', name: 'Hidratação', professionId: 'prof_cabeleireiro' },
  { id: 'serv_escova', name: 'Escova', professionId: 'prof_cabeleireiro' },
  { id: 'serv_penteado', name: 'Penteado', professionId: 'prof_cabeleireiro' },
  { id: 'serv_progressiva', name: 'Progressiva', professionId: 'prof_cabeleireiro' },
  { id: 'serv_botox_capilar', name: 'Botox Capilar', professionId: 'prof_cabeleireiro' },

  // Barbeiro(a)
  { id: 'serv_corte_barba', name: 'Corte + Barba', professionId: 'prof_barbeiro' },
  { id: 'serv_barba', name: 'Barba', professionId: 'prof_barbeiro' },
  { id: 'serv_corte_navalha', name: 'Corte na Navalha', professionId: 'prof_barbeiro' },
  { id: 'serv_pigmentacao_barba', name: 'Pigmentação de Barba', professionId: 'prof_barbeiro' },
  { id: 'serv_relaxamento_barba', name: 'Relaxamento de Barba', professionId: 'prof_barbeiro' },

  // Manicure
  { id: 'serv_manicure', name: 'Manicure', professionId: 'prof_manicure' },
  { id: 'serv_pedicure', name: 'Pedicure', professionId: 'prof_manicure' },
  { id: 'serv_manicure_pedicure', name: 'Manicure + Pedicure', professionId: 'prof_manicure' },
  { id: 'serv_unha_gel', name: 'Unha em Gel', professionId: 'prof_manicure' },
  { id: 'serv_alongamento_unhas', name: 'Alongamento de Unhas', professionId: 'prof_manicure' },
  { id: 'serv_unhas_decoradas', name: 'Unhas Decoradas', professionId: 'prof_manicure' },

  // Esteticista
  { id: 'serv_limpeza_pele', name: 'Limpeza de Pele', professionId: 'prof_esteticista' },
  { id: 'serv_peeling', name: 'Peeling', professionId: 'prof_esteticista' },
  { id: 'serv_drenagem_linfatica', name: 'Drenagem Linfática', professionId: 'prof_esteticista' },
  { id: 'serv_massagem_modeladora', name: 'Massagem Modeladora', professionId: 'prof_esteticista' },
  { id: 'serv_tratamento_acne', name: 'Tratamento para Acne', professionId: 'prof_esteticista' },

  // Massagista
  { id: 'serv_massagem_relaxante', name: 'Massagem Relaxante', professionId: 'prof_massagista' },
  { id: 'serv_massagem_terapeutica', name: 'Massagem Terapêutica', professionId: 'prof_massagista' },
  { id: 'serv_quick_massage', name: 'Quick Massage', professionId: 'prof_massagista' },
  {
    id: 'serv_massagem_pedras_quentes',
    name: 'Massagem com Pedras Quentes',
    professionId: 'prof_massagista',
  },

  // Designer de Sobrancelhas
  {
    id: 'serv_design_sobrancelhas',
    name: 'Design de Sobrancelhas',
    professionId: 'prof_designer_sobrancelhas',
  },
  {
    id: 'serv_micropigmentacao',
    name: 'Micropigmentação',
    professionId: 'prof_designer_sobrancelhas',
  },
  { id: 'serv_henna', name: 'Henna', professionId: 'prof_designer_sobrancelhas' },

  // Maquiador(a)
  { id: 'serv_maquiagem_social', name: 'Maquiagem Social', professionId: 'prof_maquiador' },
  { id: 'serv_maquiagem_noiva', name: 'Maquiagem de Noiva', professionId: 'prof_maquiador' },
  { id: 'serv_automaquiagem', name: 'Curso de Automaquiagem', professionId: 'prof_maquiador' },

  // Depilador(a)
  { id: 'serv_depilacao_cera', name: 'Depilação com Cera', professionId: 'prof_depilador' },
  { id: 'serv_depilacao_laser', name: 'Depilação a Laser', professionId: 'prof_depilador' },
  { id: 'serv_depilacao_luz_pulsada', name: 'Depilação Luz Pulsada', professionId: 'prof_depilador' },

  // Podólogo(a)
  { id: 'serv_podologia', name: 'Podologia', professionId: 'prof_podologo' },
  { id: 'serv_tratamento_calos', name: 'Tratamento de Calos', professionId: 'prof_podologo' },
  { id: 'serv_tratamento_unhas_encravadas', name: 'Tratamento de Unhas Encravadas', professionId: 'prof_podologo' },

  // Lash Designer
  { id: 'serv_extensao_cilios', name: 'Extensão de Cílios', professionId: 'prof_lash_designer' },
  { id: 'serv_lifting_cilios', name: 'Lifting de Cílios', professionId: 'prof_lash_designer' },
];
