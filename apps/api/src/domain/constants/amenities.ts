export type AmenityId =
  | 'amen_wifi'
  | 'amen_parking'
  | 'amen_coffee'
  | 'amen_ac'
  | 'amen_snacks'
  | 'amen_waiting-room'
  | 'amen_accessibility';

export interface Amenity {
  id: AmenityId;
  name: string;
  icon: string;
}

export const PREDEFINED_AMENITIES: Amenity[] = [
  { id: 'amen_wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'amen_parking', name: 'Estacionamento', icon: '🅿️' },
  { id: 'amen_coffee', name: 'Café', icon: '☕' },
  { id: 'amen_ac', name: 'Ar Condicionado', icon: '❄️' },
  { id: 'amen_snacks', name: 'Lanches', icon: '🍪' },
  { id: 'amen_waiting-room', name: 'Sala de Espera', icon: '🪑' },
  { id: 'amen_accessibility', name: 'Acessibilidade', icon: '♿' },
];
