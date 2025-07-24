// Remove.bg API Configuration
// Get your API key from: https://www.remove.bg/api

export const REMOVE_BG_CONFIG = {
  // Replace with your actual Remove.bg API key
  API_KEY: 'D98D5BWVa6NtGmxCLT4Rinoh',
  
  // API settings
  API_URL: 'https://api.remove.bg/v1.0/removebg',
  ACCOUNT_URL: 'https://api.remove.bg/v1.0/account',
  
  // Default parameters
  DEFAULT_SIZE: 'auto', // Options: 'auto', 'preview', 'full', 'regular', 'medium', 'hd', '4k'
  DEFAULT_FORMAT: 'png', // Options: 'auto', 'png', 'jpg', 'zip'
  
  // Rate limiting
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};

// Instructions for setup:
// 1. Sign up at https://www.remove.bg/api
// 2. Get your API key from the dashboard
// 3. Replace 'YOUR_REMOVE_BG_API_KEY_HERE' with your actual API key
// 4. The first 50 API calls per month are free
// 5. Additional calls cost $0.20 per image 