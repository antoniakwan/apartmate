export interface Furniture {
  id: string;
  name: string;
  icon: string;
  category: 'seating' | 'decor' | 'storage' | 'plants';
}

export interface Friend {
  id: string;
  name: string;
  species: string;
  personality: string;
  color: string;
  position: { x: number; y: number };
}

export interface RoomItem {
  id: string;
  furnitureId: string;
  position: { x: number; y: number };
}

export interface Room {
  id: string;
  name: string;
  items: RoomItem[];
}

export const FURNITURE_CATALOG: Furniture[] = [
  { id: 'f1', name: 'Comfy Sofa', icon: '🛋️', category: 'seating' },
  { id: 'f2', name: 'Wooden Table', icon: '🪑', category: 'seating' },
  { id: 'f3', name: 'Potted Fern', icon: '🌿', category: 'plants' },
  { id: 'f4', name: 'Bookshelf', icon: '📚', category: 'storage' },
  { id: 'f5', name: 'Round Rug', icon: '⭕', category: 'decor' },
  { id: 'f6', name: 'Table Lamp', icon: '💡', category: 'decor' },
  { id: 'f7', name: 'Cactus', icon: '🌵', category: 'plants' },
  { id: 'f8', name: 'Beanbag', icon: '🟣', category: 'seating' },
];

export const FRIEND_TEMPLATES = [
  { name: 'Mochi', species: 'Cat', personality: 'Sleepy and philosophical', color: '#FFB7B2' },
  { name: 'Pip', species: 'Bird', personality: 'Energetic and gossipy', color: '#B2E2F2' },
  { name: 'Bramble', species: 'Bear', personality: 'Grumpy but loves baking', color: '#E2F2B2' },
  { name: 'Luna', species: 'Moth', personality: 'Mysterious and loves lamps', color: '#D1B2F2' },
];
