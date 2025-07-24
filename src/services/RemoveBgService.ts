// Remove.bg API Service for background removal
// Based on https://www.remove.bg/api documentation

import { REMOVE_BG_CONFIG } from '../config/removeBgConfig';

export interface RemoveBgResponse {
  success: boolean;
  processedImageUri?: string;
  error?: string;
}

class RemoveBgService {
  private apiKey: string = REMOVE_BG_CONFIG.API_KEY;
  private apiUrl: string = REMOVE_BG_CONFIG.API_URL;

  // Set your API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async removeBackground(imageUri: string): Promise<RemoveBgResponse> {
    let retries = 0;
    
    while (retries < REMOVE_BG_CONFIG.MAX_RETRIES) {
      try {
        console.log(`Starting background removal for: ${imageUri}`);
        
        // Validate the image URI
        if (!imageUri) {
          throw new Error('No image URI provided');
        }
        
        console.log(`Processing image: ${imageUri}`);

        // Create form data for the API request
        const formData = new FormData();
        
        // For React Native, we need to handle the image data differently
        formData.append('image_file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg'
        } as any);
        formData.append('size', REMOVE_BG_CONFIG.DEFAULT_SIZE);
        formData.append('format', REMOVE_BG_CONFIG.DEFAULT_FORMAT);

        console.log(`Sending request to Remove.bg API...`);

        // Make API request to Remove.bg
        const apiResponse = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'X-Api-Key': this.apiKey,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error(`Remove.bg API error: ${apiResponse.status} - ${errorText}`);
          
          // Handle rate limiting
          if (apiResponse.status === 429) {
            if (retries < REMOVE_BG_CONFIG.MAX_RETRIES - 1) {
              console.log(`Rate limited, retrying in ${REMOVE_BG_CONFIG.RETRY_DELAY * (retries + 1)}ms...`);
              await new Promise(resolve => setTimeout(resolve, REMOVE_BG_CONFIG.RETRY_DELAY * (retries + 1)));
              retries++;
              continue;
            }
          }
          
          throw new Error(`Remove.bg API error: ${apiResponse.status} - ${errorText}`);
        }

        console.log(`Remove.bg API request successful, processing response...`);

        // Get the processed image as blob
        const processedImageBlob = await apiResponse.blob();
        
        // Convert blob to URI for React Native
        const processedImageUri = await this.blobToUri(processedImageBlob);

        console.log(`Background removal completed successfully!`);

        return {
          success: true,
          processedImageUri,
        };

      } catch (error) {
        console.error(`Background removal attempt ${retries + 1} failed:`, error);
        
        if (retries === REMOVE_BG_CONFIG.MAX_RETRIES - 1) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          };
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, REMOVE_BG_CONFIG.RETRY_DELAY));
        retries++;
      }
    }

    return {
      success: false,
      error: 'Maximum retries exceeded',
    };
  }

  // Helper function to convert blob to URI
  private async blobToUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get API usage information
  async getAccountInfo(): Promise<any> {
    try {
      const response = await fetch('https://api.remove.bg/v1.0/account', {
        headers: {
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get account info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get account info:', error);
      throw error;
    }
  }

  // Test the API with a simple validation
  async testAPI(): Promise<boolean> {
    try {
      console.log('Testing Remove.bg API...');
      const accountInfo = await this.getAccountInfo();
      console.log('Remove.bg API test successful:', accountInfo);
      return true;
    } catch (error) {
      console.error('Remove.bg API test failed:', error);
      return false;
    }
  }

  // Check if API key is valid
  async validateApiKey(): Promise<boolean> {
    try {
      await this.getAccountInfo();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const removeBgService = new RemoveBgService(); 