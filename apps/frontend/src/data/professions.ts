export interface Especialidade {
  id: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  especialidadeIds: string[];
}

export const especialidades: Especialidade[] = [
  { id: "spec_cabeleireiro", name: "Cabeleireiro(a)", icon: "✂️" },
  { id: "spec_barbeiro", name: "Barbeiro(a)", icon: "💈" },
  { id: "spec_manicure", name: "Manicure", icon: "💅" },
  { id: "spec_esteticista", name: "Esteticista", icon: "✨" },
  { id: "spec_massagista", name: "Massagista", icon: "💆" },
  { id: "spec_designer_sobrancelhas", name: "Designer de Sobrancelhas", icon: "👁️" },
  { id: "spec_maquiador", name: "Maquiador(a)", icon: "💄" },
  { id: "spec_depilador", name: "Depilador(a)", icon: "🌸" },
  { id: "spec_podologo", name: "Podólogo(a)", icon: "🦶" },
  { id: "spec_lash_designer", name: "Lash Designer", icon: "👁️‍🗨️" },
];

export const services: Service[] = [
  // Cabeleireiro - IDs must match backend PREDEFINED_SERVICES
  { id: "serv_corte_feminino", name: "Corte Feminino", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_corte_masculino", name: "Corte Masculino", especialidadeIds: ["spec_cabeleireiro", "spec_barbeiro"] },
  { id: "serv_corte_infantil", name: "Corte Infantil", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_coloracao", name: "Coloração", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_mechas", name: "Mechas", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_hidratacao", name: "Hidratação", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_escova", name: "Escova", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_penteado", name: "Penteado", especialidadeIds: ["spec_cabeleireiro", "spec_maquiador"] },
  { id: "serv_progressiva", name: "Progressiva", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "serv_botox_capilar", name: "Botox Capilar", especialidadeIds: ["spec_cabeleireiro"] },

  // Barbeiro
  { id: "serv_corte_barba", name: "Corte + Barba", especialidadeIds: ["spec_barbeiro"] },
  { id: "serv_barba", name: "Barba", especialidadeIds: ["spec_barbeiro"] },
  { id: "serv_corte_navalha", name: "Corte na Navalha", especialidadeIds: ["spec_barbeiro"] },
  { id: "serv_pigmentacao_barba", name: "Pigmentação de Barba", especialidadeIds: ["spec_barbeiro"] },
  { id: "serv_relaxamento_barba", name: "Relaxamento de Barba", especialidadeIds: ["spec_barbeiro"] },

  // Manicure
  { id: "serv_manicure", name: "Manicure", especialidadeIds: ["spec_manicure"] },
  { id: "serv_pedicure", name: "Pedicure", especialidadeIds: ["spec_manicure"] },
  { id: "serv_manicure_pedicure", name: "Manicure + Pedicure", especialidadeIds: ["spec_manicure"] },
  { id: "serv_unha_gel", name: "Unha em Gel", especialidadeIds: ["spec_manicure"] },
  { id: "serv_alongamento_unhas", name: "Alongamento de Unhas", especialidadeIds: ["spec_manicure"] },
  { id: "serv_unhas_decoradas", name: "Unhas Decoradas", especialidadeIds: ["spec_manicure"] },

  // Esteticista
  { id: "serv_limpeza_pele", name: "Limpeza de Pele", especialidadeIds: ["spec_esteticista"] },
  { id: "serv_peeling", name: "Peeling", especialidadeIds: ["spec_esteticista"] },
  { id: "serv_drenagem_linfatica", name: "Drenagem Linfática", especialidadeIds: ["spec_esteticista", "spec_massagista"] },
  { id: "serv_massagem_modeladora", name: "Massagem Modeladora", especialidadeIds: ["spec_esteticista", "spec_massagista"] },
  { id: "serv_tratamento_acne", name: "Tratamento para Acne", especialidadeIds: ["spec_esteticista"] },

  // Massagista
  { id: "serv_massagem_relaxante", name: "Massagem Relaxante", especialidadeIds: ["spec_massagista"] },
  { id: "serv_massagem_terapeutica", name: "Massagem Terapêutica", especialidadeIds: ["spec_massagista"] },
  { id: "serv_quick_massage", name: "Quick Massage", especialidadeIds: ["spec_massagista"] },
  { id: "serv_massagem_pedras_quentes", name: "Massagem com Pedras Quentes", especialidadeIds: ["spec_massagista"] },

  // Designer de Sobrancelhas
  { id: "serv_design_sobrancelhas", name: "Design de Sobrancelhas", especialidadeIds: ["spec_designer_sobrancelhas"] },
  { id: "serv_micropigmentacao", name: "Micropigmentação", especialidadeIds: ["spec_designer_sobrancelhas"] },
  { id: "serv_henna", name: "Henna", especialidadeIds: ["spec_designer_sobrancelhas"] },

  // Maquiador
  { id: "serv_maquiagem_social", name: "Maquiagem Social", especialidadeIds: ["spec_maquiador"] },
  { id: "serv_maquiagem_noiva", name: "Maquiagem de Noiva", especialidadeIds: ["spec_maquiador"] },
  { id: "serv_automaquiagem", name: "Curso de Automaquiagem", especialidadeIds: ["spec_maquiador"] },

  // Depilador
  { id: "serv_depilacao_cera", name: "Depilação com Cera", especialidadeIds: ["spec_depilador"] },
  { id: "serv_depilacao_laser", name: "Depilação a Laser", especialidadeIds: ["spec_depilador"] },
  { id: "serv_depilacao_luz_pulsada", name: "Depilação Luz Pulsada", especialidadeIds: ["spec_depilador"] },

  // Podólogo
  { id: "serv_podologia", name: "Podologia", especialidadeIds: ["spec_podologo"] },
  { id: "serv_tratamento_calos", name: "Tratamento de Calos", especialidadeIds: ["spec_podologo"] },
  { id: "serv_tratamento_unhas_encravadas", name: "Tratamento de Unhas Encravadas", especialidadeIds: ["spec_podologo"] },

  // Lash Designer
  { id: "serv_extensao_cilios", name: "Extensão de Cílios", especialidadeIds: ["spec_lash_designer"] },
  { id: "serv_lifting_cilios", name: "Lifting de Cílios", especialidadeIds: ["spec_lash_designer"] },
];

export const getServicesByEspecialidade = (especialidadeId: string): Service[] => {
  return services.filter(service => service.especialidadeIds.includes(especialidadeId));
};

// Legacy compatibility
export const professions = especialidades;
export type Profession = Especialidade;
export const getServicesByProfession = getServicesByEspecialidade;
