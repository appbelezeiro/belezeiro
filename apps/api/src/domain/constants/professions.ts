export interface Profession {
  id: string;
  name: string;
  icon: string;
}

export const PREDEFINED_PROFESSIONS: Profession[] = [
  { id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
  { id: 'prof_barbeiro', name: 'Barbeiro(a)', icon: '💈' },
  { id: 'prof_manicure', name: 'Manicure', icon: '💅' },
  { id: 'prof_esteticista', name: 'Esteticista', icon: '✨' },
  { id: 'prof_massagista', name: 'Massagista', icon: '💆' },
  { id: 'prof_designer_sobrancelhas', name: 'Designer de Sobrancelhas', icon: '👁️' },
  { id: 'prof_maquiador', name: 'Maquiador(a)', icon: '💄' },
  { id: 'prof_depilador', name: 'Depilador(a)', icon: '🌸' },
  { id: 'prof_podologo', name: 'Podólogo(a)', icon: '🦶' },
  { id: 'prof_lash_designer', name: 'Lash Designer', icon: '👁️‍🗨️' },
];
