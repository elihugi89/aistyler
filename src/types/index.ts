export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUri?: string;
  description: string;
  material?: string;
  season?: string[];
  tags?: string[];
}

export interface OutfitSuggestion {
  id: string;
  title: string;
  occasion: string;
  items: ClothingItem[];
  hairMakeup: string;
  tips: string[];
  rating: number;
  date: string;
  weather?: string;
  formality?: string;
}

export interface UserPreferences {
  stylePreferences: string[];
  colorPreferences: string[];
  occasionPreferences: string[];
  weatherConsideration: boolean;
  formalityLevel: 'casual' | 'business' | 'formal' | 'any';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: {
    totalOutfits: number;
    savedOutfits: number;
    wardrobeItems: number;
    favoriteStyle: string;
  };
}

export type NavigationParamList = {
  Home: undefined;
  Wardrobe: undefined;
  Outfits: undefined;
  Profile: undefined;
}; 