import { mockApiDelay } from './api';

export interface ClothingItem {
  id: string;
  type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  imageUri: string;
  category: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  color: string;
  tags: string[];
}

export interface OutfitSuggestion {
  items: ClothingItem[];
  occasion: string;
  season: string;
  confidence: number;
  suggestions: string[];
}

export interface ImageAnalysis {
  type: ClothingItem['type'];
  category: string;
  color: string;
  tags: string[];
  confidence: number;
}

class AIService {
  async analyzeImage(imageUri: string): Promise<ImageAnalysis> {
    // Mock image analysis
    await mockApiDelay(1500);
    
    return {
      type: 'top',
      category: 'T-Shirt',
      color: 'blue',
      tags: ['casual', 'cotton'],
      confidence: 0.85,
    };
  }

  async suggestOutfit(
    occasion: string,
    wardrobe: ClothingItem[],
    preferences: {
      favoriteColors: string[];
      preferredStyles: string[];
      seasonalPreferences: Record<string, string[]>;
    }
  ): Promise<OutfitSuggestion> {
    // Mock outfit suggestion
    await mockApiDelay(2000);

    // Filter items based on preferences
    const filteredItems = wardrobe.filter(item => {
      const matchesColor = preferences.favoriteColors.includes(item.color);
      const matchesStyle = item.tags.some(tag => preferences.preferredStyles.includes(tag));
      return matchesColor || matchesStyle;
    });

    // Select items for the outfit
    const top = filteredItems.find(item => item.type === 'top');
    const bottom = filteredItems.find(item => item.type === 'bottom');
    const shoes = filteredItems.find(item => item.type === 'shoes');

    const items = [top, bottom, shoes].filter((item): item is ClothingItem => item !== undefined);

    return {
      items,
      occasion,
      season: 'all',
      confidence: 0.75,
      suggestions: [
        'These items complement each other well',
        'The colors match your preferences',
        'This outfit is suitable for the occasion',
      ],
    };
  }

  async getStyleTips(outfit: ClothingItem[]): Promise<string[]> {
    // Mock style tips
    await mockApiDelay(1000);

    return [
      'Try accessorizing with a statement necklace',
      'Roll up the sleeves for a more casual look',
      'This outfit works well for both day and evening events',
    ];
  }
}

export const aiService = new AIService(); 