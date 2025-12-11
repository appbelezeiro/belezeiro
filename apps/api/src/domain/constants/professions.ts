export interface Especialidade {
  id: string;
  name: string;
  icon: string;
}

export const PREDEFINED_ESPECIALIDADES: Especialidade[] = [
  { id: 'spec_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
  { id: 'spec_barbeiro', name: 'Barbeiro(a)', icon: '💈' },
  { id: 'spec_manicure', name: 'Manicure', icon: '💅' },
  { id: 'spec_esteticista', name: 'Esteticista', icon: '✨' },
  { id: 'spec_massagista', name: 'Massagista', icon: '💆' },
  { id: 'spec_designer_sobrancelhas', name: 'Designer de Sobrancelhas', icon: '👁️' },
  { id: 'spec_maquiador', name: 'Maquiador(a)', icon: '💄' },
  { id: 'spec_depilador', name: 'Depilador(a)', icon: '🌸' },
  { id: 'spec_podologo', name: 'Podólogo(a)', icon: '🦶' },
  { id: 'spec_lash_designer', name: 'Lash Designer', icon: '👁️‍🗨️' },
];
