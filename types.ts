export interface UserImage {
  file: File | null;
  base64: string | null;
  mimeType: string | null;
  previewUrl: string | null;
}

export interface CustomImage {
  file: File;
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface OutfitItemState {
  id: string;
  text: string;
  customImage: CustomImage | null;
  inspirationUrl: string | null;
}

export interface ShoppingPrompt {
  itemName: string;
  prompt: string;
}

export interface GeneratedImage {
  src: string;
  base64: string;
  mimeType: string;
  shoppingPrompts: ShoppingPrompt[] | null;
  isLoadingPrompts: boolean;
}

export interface AppState {
  userImage: UserImage;
  topWear: OutfitItemState;
  bottomWear: OutfitItemState;
  accessories: OutfitItemState;
  occasion: string;
  customOccasionPrompt: string;
  background: string;
  customBackgroundPrompt: string;
  imageCount: number;
  generatedImages: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

export interface InspirationItem {
    id: string;
    label: string;
    imageUrl: string;
}
