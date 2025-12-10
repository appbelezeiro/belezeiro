export type AmenityId =
  | 'wifi'
  | 'parking'
  | 'coffee'
  | 'ac'
  | 'snacks'
  | 'waiting-room'
  | 'accessibility';

export interface Amenity {
  id: AmenityId;
  name: string;
  icon: string;
}

export const PREDEFINED_AMENITIES: Amenity[] = [
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'parking', name: 'Estacionamento', icon: '🅿️' },
  { id: 'coffee', name: 'Café', icon: '☕' },
  { id: 'ac', name: 'Ar Condicionado', icon: '❄️' },
  { id: 'snacks', name: 'Lanches', icon: '🍪' },
  { id: 'waiting-room', name: 'Sala de Espera', icon: '🪑' },
  { id: 'accessibility', name: 'Acessibilidade', icon: '♿' },
];
