interface Config {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildNumber: string;
  isProduction: boolean;
  isDevelopment: boolean;
  apiTimeout: number;
  imageUploadLimit: number;
  features: {
    aiSuggestions: boolean;
    outfitVisualization: boolean;
    socialSharing: boolean;
    weatherIntegration: boolean;
  };
}

// TODO: Replace with actual environment variables
const config: Config = {
  apiUrl: __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.aistylist.com',
  apiKey: __DEV__
    ? 'development-key'
    : 'production-key',
  environment: __DEV__ ? 'development' : 'production',
  version: '1.0.0',
  buildNumber: '1',
  isProduction: !__DEV__,
  isDevelopment: __DEV__,
  apiTimeout: 30000, // 30 seconds
  imageUploadLimit: 5 * 1024 * 1024, // 5MB
  features: {
    aiSuggestions: true,
    outfitVisualization: true,
    socialSharing: false,
    weatherIntegration: false,
  },
};

export default config; 