// Runway ML Service for clothing segmentation
// Based on Runway ML API v2 documentation

import { RUNWAY_ML_CONFIG } from '../config/runwayMLConfig';

export interface RunwayMLResponse {
  success: boolean;
  segmentedImageUri?: string;
  error?: string;
}

class RunwayMLService {
  private apiKey: string = RUNWAY_ML_CONFIG.API_KEY;
  private apiUrl: string = RUNWAY_ML_CONFIG.API_URL;
  private modelId: string = RUNWAY_ML_CONFIG.MODEL_ID;

  // Set your API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Generate UUID v4 for task tracking
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Convert image URI to base64 for API
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get just the base64
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to convert image to base64: ${error}`);
    }
  }

  // Apply clothing segmentation to the background-removed image
  async segmentClothing(imageUri: string): Promise<RunwayMLResponse> {
    let retries = 0;
    
    while (retries < RUNWAY_ML_CONFIG.MAX_RETRIES) {
      try {
        console.log('Starting clothing segmentation for:', imageUri);

        // Convert image to base64
        const imageBase64 = await this.imageToBase64(imageUri);
        console.log('Image converted to base64 successfully');

        // Prepare the request payload for Runway ML v2 API
        const payload = [{
          taskType: "imageBackgroundRemoval",
          taskUUID: this.generateUUID(),
          inputImage: imageBase64,
          outputType: "URL",
          outputFormat: "PNG",
          model: "runware:109@1", // Use RemBG model for background removal
          settings: {
            postProcessMask: true,
            alphaMatting: true,
            alphaMattingForegroundThreshold: 240,
            alphaMattingBackgroundThreshold: 10,
            alphaMattingErodeSize: 10
          }
        }];

        console.log('Sending request to Runway ML v2 API...');
        console.log('Payload:', JSON.stringify(payload, null, 2));

        // Make API request to Runway ML v2
        const apiResponse = await fetch(`${this.apiUrl}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error(`Runway ML API error: ${apiResponse.status} - ${errorText}`);
          
          // Handle rate limiting
          if (apiResponse.status === 429) {
            if (retries < RUNWAY_ML_CONFIG.MAX_RETRIES - 1) {
              console.log(`Rate limited, retrying in ${RUNWAY_ML_CONFIG.RETRY_DELAY * (retries + 1)}ms...`);
              await new Promise(resolve => setTimeout(resolve, RUNWAY_ML_CONFIG.RETRY_DELAY * (retries + 1)));
              retries++;
              continue;
            }
          }
          
          throw new Error(`Runway ML API error: ${apiResponse.status} - ${errorText}`);
        }

        // Get the response data
        const responseData = await apiResponse.json();
        console.log('Runway ML API response:', JSON.stringify(responseData, null, 2));
        
        // Handle the response format
        let segmentedImageUri: string;
        
        if (responseData.data?.[0]?.imageURL) {
          segmentedImageUri = responseData.data[0].imageURL;
        } else if (responseData.data?.[0]?.imageDataURI) {
          segmentedImageUri = responseData.data[0].imageDataURI;
        } else if (responseData.output_url) {
          segmentedImageUri = responseData.output_url;
        } else if (responseData.output?.url) {
          segmentedImageUri = responseData.output.url;
        } else {
          throw new Error('No output image URL found in response');
        }

        console.log('Clothing segmentation completed successfully:', segmentedImageUri);

        return {
          success: true,
          segmentedImageUri,
        };

      } catch (error) {
        console.error(`Clothing segmentation attempt ${retries + 1} failed:`, error);
        
        if (retries === RUNWAY_ML_CONFIG.MAX_RETRIES - 1) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          };
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RUNWAY_ML_CONFIG.RETRY_DELAY));
        retries++;
      }
    }

    return {
      success: false,
      error: 'Maximum retries exceeded',
    };
  }

  // Test the API connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Runway ML API connection...');
      
      // Try to get account info or available models
      const response = await fetch(`${this.apiUrl}/account`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API connection successful:', data);
        return true;
      } else {
        console.error('API connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get available models:', error);
      throw error;
    }
  }

  // Check if API key is valid
  async validateApiKey(): Promise<boolean> {
    try {
      return await this.testConnection();
    } catch (error) {
      return false;
    }
  }
}

export const runwayMLService = new RunwayMLService(); 