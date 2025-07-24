export const APP_NAME = 'AI Stylist';

export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'authToken',
  WARDROBE: 'wardrobe',
  SAVED_OUTFITS: 'savedOutfits',
  PREFERENCES: 'preferences',
  ONBOARDING: 'onboarding',
  RECENT_SEARCHES: 'recentSearches',
  LAST_SYNC: 'lastSync',
};

export const CLOTHING_TYPES = [
  'top',
  'bottom',
  'dress',
  'shoes',
  'accessory',
] as const;

export const SEASONS = [
  'spring',
  'summer',
  'fall',
  'winter',
  'all',
] as const;

export const OCCASIONS = [
  'casual',
  'business',
  'formal',
  'party',
  'workout',
  'beach',
  'travel',
] as const;

export const IMAGE_QUALITY = {
  UPLOAD: 0.8,
  PREVIEW: 0.5,
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const API_ENDPOINTS = {
  // TODO: Replace with actual API endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    PREFERENCES: '/user/preferences',
  },
  WARDROBE: {
    LIST: '/wardrobe',
    ADD: '/wardrobe/add',
    UPDATE: '/wardrobe/update',
    DELETE: '/wardrobe/delete',
  },
  OUTFITS: {
    GENERATE: '/outfits/generate',
    SAVE: '/outfits/save',
    LIST: '/outfits',
    DELETE: '/outfits/delete',
  },
  AI: {
    ANALYZE: '/ai/analyze',
    SUGGEST: '/ai/suggest',
    VISUALIZE: '/ai/visualize',
  },
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_EXISTS: 'Email already exists.',
    WEAK_PASSWORD: 'Password is too weak.',
    UNAUTHORIZED: 'Please log in to continue.',
  },
  UPLOAD: {
    SIZE: 'File size too large.',
    TYPE: 'Invalid file type.',
    FAILED: 'Upload failed. Please try again.',
  },
  WARDROBE: {
    NOT_FOUND: 'Item not found.',
    ADD_FAILED: 'Failed to add item.',
    UPDATE_FAILED: 'Failed to update item.',
    DELETE_FAILED: 'Failed to delete item.',
  },
  OUTFITS: {
    GENERATION_FAILED: 'Failed to generate outfit.',
    SAVE_FAILED: 'Failed to save outfit.',
    DELETE_FAILED: 'Failed to delete outfit.',
  },
};

export const PERMISSIONS = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo_library',
} as const;

export const MAX_LIMITS = {
  WARDROBE_ITEMS: 1000,
  SAVED_OUTFITS: 100,
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  TAGS: 10,
  SEARCH_HISTORY: 20,
} as const; 