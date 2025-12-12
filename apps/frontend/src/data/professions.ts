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
  // Cabeleireiro
  { id: "corte-cabelo", name: "Corte de Cabelo", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "escova", name: "Escova", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "coloracao", name: "Coloração", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "hidratacao", name: "Hidratação", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "progressiva", name: "Progressiva", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "luzes", name: "Luzes / Mechas", especialidadeIds: ["spec_cabeleireiro"] },
  { id: "penteado", name: "Penteado", especialidadeIds: ["spec_cabeleireiro", "spec_maquiador"] },
  { id: "tratamento-capilar", name: "Tratamento Capilar", especialidadeIds: ["spec_cabeleireiro"] },

  // Barbeiro
  { id: "corte-barba", name: "Corte de Barba", especialidadeIds: ["spec_barbeiro"] },
  { id: "corte-masculino", name: "Corte Masculino", especialidadeIds: ["spec_barbeiro", "spec_cabeleireiro"] },
  { id: "barba-completa", name: "Barba Completa", especialidadeIds: ["spec_barbeiro"] },
  { id: "sobrancelha-masc", name: "Sobrancelha Masculina", especialidadeIds: ["spec_barbeiro"] },
  { id: "pigmentacao-barba", name: "Pigmentação de Barba", especialidadeIds: ["spec_barbeiro"] },

  // Manicure
  { id: "manicure-simples", name: "Manicure Simples", especialidadeIds: ["spec_manicure"] },
  { id: "pedicure", name: "Pedicure", especialidadeIds: ["spec_manicure"] },
  { id: "esmaltacao-gel", name: "Esmaltação em Gel", especialidadeIds: ["spec_manicure"] },
  { id: "alongamento-unhas", name: "Alongamento de Unhas", especialidadeIds: ["spec_manicure"] },
  { id: "nail-art", name: "Nail Art", especialidadeIds: ["spec_manicure"] },
  { id: "spa-maos", name: "Spa das Mãos", especialidadeIds: ["spec_manicure"] },

  // Esteticista
  { id: "limpeza-pele", name: "Limpeza de Pele", especialidadeIds: ["spec_esteticista"] },
  { id: "peeling", name: "Peeling", especialidadeIds: ["spec_esteticista"] },
  { id: "microagulhamento", name: "Microagulhamento", especialidadeIds: ["spec_esteticista"] },
  { id: "radiofrequencia", name: "Radiofrequência", especialidadeIds: ["spec_esteticista"] },
  { id: "drenagem-facial", name: "Drenagem Facial", especialidadeIds: ["spec_esteticista"] },
  { id: "botox", name: "Aplicação de Botox", especialidadeIds: ["spec_esteticista"] },

  // Massagista
  { id: "massagem-relaxante", name: "Massagem Relaxante", especialidadeIds: ["spec_massagista"] },
  { id: "massagem-modeladora", name: "Massagem Modeladora", especialidadeIds: ["spec_massagista"] },
  { id: "drenagem-linfatica", name: "Drenagem Linfática", especialidadeIds: ["spec_massagista"] },
  { id: "quick-massage", name: "Quick Massage", especialidadeIds: ["spec_massagista"] },
  { id: "pedras-quentes", name: "Massagem com Pedras Quentes", especialidadeIds: ["spec_massagista"] },

  // Designer de Sobrancelhas
  { id: "design-sobrancelha", name: "Design de Sobrancelha", especialidadeIds: ["spec_designer_sobrancelhas"] },
  { id: "micropigmentacao", name: "Micropigmentação", especialidadeIds: ["spec_designer_sobrancelhas"] },
  { id: "henna-sobrancelha", name: "Henna de Sobrancelha", especialidadeIds: ["spec_designer_sobrancelhas"] },
  { id: "brow-lamination", name: "Brow Lamination", especialidadeIds: ["spec_designer_sobrancelhas"] },

  // Maquiador
  { id: "maquiagem-social", name: "Maquiagem Social", especialidadeIds: ["spec_maquiador"] },
  { id: "maquiagem-noiva", name: "Maquiagem de Noiva", especialidadeIds: ["spec_maquiador"] },
  { id: "maquiagem-artistica", name: "Maquiagem Artística", especialidadeIds: ["spec_maquiador"] },
  { id: "automaquiagem", name: "Aula de Automaquiagem", especialidadeIds: ["spec_maquiador"] },

  // Depilador
  { id: "depilacao-cera", name: "Depilação com Cera", especialidadeIds: ["spec_depilador"] },
  { id: "depilacao-laser", name: "Depilação a Laser", especialidadeIds: ["spec_depilador"] },
  { id: "depilacao-linha", name: "Depilação com Linha", especialidadeIds: ["spec_depilador"] },

  // Podólogo
  { id: "podologia", name: "Podologia", especialidadeIds: ["spec_podologo"] },
  { id: "tratamento-unha", name: "Tratamento de Unha Encravada", especialidadeIds: ["spec_podologo"] },
  { id: "reflexologia", name: "Reflexologia Podal", especialidadeIds: ["spec_podologo"] },

  // Lash Designer
  { id: "extensao-cilios", name: "Extensão de Cílios", especialidadeIds: ["spec_lash_designer"] },
  { id: "lash-lifting", name: "Lash Lifting", especialidadeIds: ["spec_lash_designer"] },
  { id: "manutencao-cilios", name: "Manutenção de Cílios", especialidadeIds: ["spec_lash_designer"] },
];

export const getServicesByEspecialidade = (especialidadeId: string): Service[] => {
  return services.filter(service => service.especialidadeIds.includes(especialidadeId));
};

// Legacy compatibility
export const professions = especialidades;
export type Profession = Especialidade;
export const getServicesByProfession = getServicesByEspecialidade;
