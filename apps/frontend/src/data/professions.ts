export interface Profession {
  id: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  professionIds: string[];
}

export const professions: Profession[] = [
  { id: "cabeleireiro", name: "Cabeleireiro(a)", icon: "✂️" },
  { id: "barbeiro", name: "Barbeiro(a)", icon: "💈" },
  { id: "manicure", name: "Manicure", icon: "💅" },
  { id: "esteticista", name: "Esteticista", icon: "✨" },
  { id: "massagista", name: "Massagista", icon: "💆" },
  { id: "sobrancelha", name: "Designer de Sobrancelhas", icon: "👁️" },
  { id: "maquiador", name: "Maquiador(a)", icon: "💄" },
  { id: "depilador", name: "Depilador(a)", icon: "🌸" },
  { id: "podologa", name: "Podólogo(a)", icon: "🦶" },
  { id: "lash", name: "Lash Designer", icon: "👁️‍🗨️" },
];

export const services: Service[] = [
  // Cabeleireiro
  { id: "corte-cabelo", name: "Corte de Cabelo", professionIds: ["cabeleireiro"] },
  { id: "escova", name: "Escova", professionIds: ["cabeleireiro"] },
  { id: "coloracao", name: "Coloração", professionIds: ["cabeleireiro"] },
  { id: "hidratacao", name: "Hidratação", professionIds: ["cabeleireiro"] },
  { id: "progressiva", name: "Progressiva", professionIds: ["cabeleireiro"] },
  { id: "luzes", name: "Luzes / Mechas", professionIds: ["cabeleireiro"] },
  { id: "penteado", name: "Penteado", professionIds: ["cabeleireiro", "maquiador"] },
  { id: "tratamento-capilar", name: "Tratamento Capilar", professionIds: ["cabeleireiro"] },
  
  // Barbeiro
  { id: "corte-barba", name: "Corte de Barba", professionIds: ["barbeiro"] },
  { id: "corte-masculino", name: "Corte Masculino", professionIds: ["barbeiro", "cabeleireiro"] },
  { id: "barba-completa", name: "Barba Completa", professionIds: ["barbeiro"] },
  { id: "sobrancelha-masc", name: "Sobrancelha Masculina", professionIds: ["barbeiro"] },
  { id: "pigmentacao-barba", name: "Pigmentação de Barba", professionIds: ["barbeiro"] },
  
  // Manicure
  { id: "manicure-simples", name: "Manicure Simples", professionIds: ["manicure"] },
  { id: "pedicure", name: "Pedicure", professionIds: ["manicure"] },
  { id: "esmaltacao-gel", name: "Esmaltação em Gel", professionIds: ["manicure"] },
  { id: "alongamento-unhas", name: "Alongamento de Unhas", professionIds: ["manicure"] },
  { id: "nail-art", name: "Nail Art", professionIds: ["manicure"] },
  { id: "spa-maos", name: "Spa das Mãos", professionIds: ["manicure"] },
  
  // Esteticista
  { id: "limpeza-pele", name: "Limpeza de Pele", professionIds: ["esteticista"] },
  { id: "peeling", name: "Peeling", professionIds: ["esteticista"] },
  { id: "microagulhamento", name: "Microagulhamento", professionIds: ["esteticista"] },
  { id: "radiofrequencia", name: "Radiofrequência", professionIds: ["esteticista"] },
  { id: "drenagem-facial", name: "Drenagem Facial", professionIds: ["esteticista"] },
  { id: "botox", name: "Aplicação de Botox", professionIds: ["esteticista"] },
  
  // Massagista
  { id: "massagem-relaxante", name: "Massagem Relaxante", professionIds: ["massagista"] },
  { id: "massagem-modeladora", name: "Massagem Modeladora", professionIds: ["massagista"] },
  { id: "drenagem-linfatica", name: "Drenagem Linfática", professionIds: ["massagista"] },
  { id: "quick-massage", name: "Quick Massage", professionIds: ["massagista"] },
  { id: "pedras-quentes", name: "Massagem com Pedras Quentes", professionIds: ["massagista"] },
  
  // Designer de Sobrancelhas
  { id: "design-sobrancelha", name: "Design de Sobrancelha", professionIds: ["sobrancelha"] },
  { id: "micropigmentacao", name: "Micropigmentação", professionIds: ["sobrancelha"] },
  { id: "henna-sobrancelha", name: "Henna de Sobrancelha", professionIds: ["sobrancelha"] },
  { id: "brow-lamination", name: "Brow Lamination", professionIds: ["sobrancelha"] },
  
  // Maquiador
  { id: "maquiagem-social", name: "Maquiagem Social", professionIds: ["maquiador"] },
  { id: "maquiagem-noiva", name: "Maquiagem de Noiva", professionIds: ["maquiador"] },
  { id: "maquiagem-artistica", name: "Maquiagem Artística", professionIds: ["maquiador"] },
  { id: "automaquiagem", name: "Aula de Automaquiagem", professionIds: ["maquiador"] },
  
  // Depilador
  { id: "depilacao-cera", name: "Depilação com Cera", professionIds: ["depilador"] },
  { id: "depilacao-laser", name: "Depilação a Laser", professionIds: ["depilador"] },
  { id: "depilacao-linha", name: "Depilação com Linha", professionIds: ["depilador"] },
  
  // Podólogo
  { id: "podologia", name: "Podologia", professionIds: ["podologa"] },
  { id: "tratamento-unha", name: "Tratamento de Unha Encravada", professionIds: ["podologa"] },
  { id: "reflexologia", name: "Reflexologia Podal", professionIds: ["podologa"] },
  
  // Lash Designer
  { id: "extensao-cilios", name: "Extensão de Cílios", professionIds: ["lash"] },
  { id: "lash-lifting", name: "Lash Lifting", professionIds: ["lash"] },
  { id: "manutencao-cilios", name: "Manutenção de Cílios", professionIds: ["lash"] },
];

export const getServicesByProfession = (professionId: string): Service[] => {
  return services.filter(service => service.professionIds.includes(professionId));
};
