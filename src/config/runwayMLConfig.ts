// Runway ML API Configuration
// Get your API key from: https://runwayml.com/api

export const RUNWAY_ML_CONFIG = {
  // Replace with your actual Runway ML API key
  API_KEY: 'key_e4d072ee2879d4d05bfa6360bcb266ddcc0e3841db9aae76f87419533db740d3bfde11bd6440b6fc925895c30aeba3e156d97b4cdba3ac22135e5a566dbaee61',
  
  // API settings
  API_URL: 'https://api.runwayml.com/v2',  // Updated to v2
  
  // Fashion segmentation model settings
  MODEL_ID: 'runware:109@1', // RemBG model for background removal
  TASK: 'imageBackgroundRemoval',
  
  // Rate limiting
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};

// Instructions for setup:
// 1. Sign up at https://runwayml.com/api
// 2. Get your API key from the dashboard
// 3. Replace 'YOUR_RUNWAY_ML_API_KEY_HERE' with your actual API key
// 4. Find the appropriate fashion segmentation model ID
// 5. Update MODEL_ID with the correct model identifier 