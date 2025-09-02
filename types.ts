export type InputType = 'text' | 'image' | 'url';

export interface ClothingItem {
  type: InputType;
  value: string;
  base64?: string;
  mimeType?: string;
  previewUrl?: string;
}

export interface Outfit {
  topWear: ClothingItem;
  bottomWear: ClothingItem;
  accessories: ClothingItem[];
}

export type BackgroundOption = 'keep' | 'studio' | 'outdoor_cafe' | 'city_street' | 'beach_sunset';

export interface SurpriseOutfitResponse {
  topWear: { description: string };
  bottomWear: { description: string };
  accessories: { description: string }[];
}

export interface StyleRating {
  rating: number; // 1 to 5
  title: string;
  critique: string;
}

export interface ShoppingPrompt {
  itemName: string;
  prompt: string;
}