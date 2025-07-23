// API Configuration for AI services
export const API_CONFIG = {
  // Remove.bg API (Free tier: 50 images/month)
  REMOVE_BG: {
    API_KEY: 'D98D5BWVa6NtGmxCLT4Rinoh', // Your remove.bg API key
    URL: 'https://api.remove.bg/v1.0/removebg',
  },
  
  // Hugging Face API (Free tier)
  HUGGING_FACE: {
    API_KEY: 'D98D5BWVa6NtGmxCLT4Rinoh', // Your Hugging Face token
    BACKGROUND_REMOVAL_MODEL: 'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
  },
  
  // Cloudinary (Free tier with AI features)
  CLOUDINARY: {
    CLOUD_NAME: 'YOUR_CLOUDINARY_CLOUD_NAME',
    API_KEY: 'YOUR_CLOUDINARY_API_KEY',
    API_SECRET: 'YOUR_CLOUDINARY_API_SECRET',
  },
  
  // Replicate.ai (Free tier for ML models)
  REPLICATE: {
    API_KEY: 'YOUR_REPLICATE_API_KEY', // Get free key from https://replicate.com/account/api-tokens
  },
};

// Instructions for getting free API keys:
// 1. Remove.bg: https://www.remove.bg/api - Free 50 images/month
// 2. Hugging Face: https://huggingface.co/settings/tokens - Free inference API
// 3. Cloudinary: https://cloudinary.com/ - Free tier with AI features
// 4. Replicate: https://replicate.com/ - Free tier for ML models

export default API_CONFIG; 