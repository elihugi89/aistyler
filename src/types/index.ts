export type ClothingItem = {
  id: string;
  type: 'top' | 'bottom' | 'dress' | 'shoes' | 'accessory';
  imageUri: string;
  category: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  color: string;
  lastWorn?: Date;
  tags: string[];
};

export type Outfit = {
  id: string;
  items: ClothingItem[];
  occasion: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  createdAt: Date;
}; 