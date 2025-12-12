import { SPECIALTY_IDS } from './seed-ids';

export interface Especialidade {
  id: string;
  name: string;
  icon: string;
}

export const PREDEFINED_ESPECIALIDADES: Especialidade[] = [
  { id: SPECIALTY_IDS.CABELEIREIRO, name: 'Cabeleireiro(a)', icon: '✂️' },
  { id: SPECIALTY_IDS.BARBEIRO, name: 'Barbeiro(a)', icon: '💈' },
  { id: SPECIALTY_IDS.MANICURE, name: 'Manicure', icon: '💅' },
  { id: SPECIALTY_IDS.ESTETICISTA, name: 'Esteticista', icon: '✨' },
  { id: SPECIALTY_IDS.MASSAGISTA, name: 'Massagista', icon: '💆' },
  { id: SPECIALTY_IDS.DESIGNER_SOBRANCELHAS, name: 'Designer de Sobrancelhas', icon: '👁️' },
  { id: SPECIALTY_IDS.MAQUIADOR, name: 'Maquiador(a)', icon: '💄' },
  { id: SPECIALTY_IDS.DEPILADOR, name: 'Depilador(a)', icon: '🌸' },
  { id: SPECIALTY_IDS.PODOLOGO, name: 'Podólogo(a)', icon: '🦶' },
  { id: SPECIALTY_IDS.LASH_DESIGNER, name: 'Lash Designer', icon: '👁️‍🗨️' },
];
