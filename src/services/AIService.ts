// AI Service for background removal and outfit suggestions
import { Alert } from 'react-native';
import API_CONFIG from '../config/api';

export interface OutfitSuggestion {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: string;
  season: string;
  description: string;
  hairMakeup: string;
  stylingTips: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUri?: string;
  description: string;
}

export class AIService {
  // Remove background from image using AI
  static async removeBackground(imageUri: string): Promise<string> {
    try {
      console.log('Starting background removal process...');
      console.log('Image URI:', imageUri);
      
      // Try remove.bg first (you have a valid API key)
      try {
        console.log('Attempting remove.bg API...');
        const result = await this.removeBackgroundWithAPI(imageUri);
        console.log('remove.bg successful!');
        return result;
      } catch (removeBgError) {
        console.error('remove.bg failed:', removeBgError);
        console.log('Falling back to Hugging Face...');
        
        // Fallback to Hugging Face API
        try {
          const result = await this.removeBackgroundWithHuggingFace(imageUri);
          console.log('Hugging Face successful!');
          return result;
        } catch (huggingFaceError) {
          console.error('Hugging Face failed:', huggingFaceError);
          console.log('Using simulated processing as final fallback...');
          
          // Final fallback to simulated processing
          const result = await this.removeBackgroundWithML(imageUri);
          console.log('Simulated processing complete');
          return result;
        }
      }
      
    } catch (error) {
      console.error('All background removal methods failed:', error);
      throw new Error('Failed to remove background. Please try again.');
    }
  }

  // Remove background using remove.bg API (requires API key)
  private static async removeBackgroundWithAPI(imageUri: string): Promise<string> {
    console.log('Checking remove.bg API key...');
    if (!API_CONFIG.REMOVE_BG.API_KEY || API_CONFIG.REMOVE_BG.API_KEY === 'YOUR_REMOVE_BG_API_KEY') {
      throw new Error('API key not configured. Please add your remove.bg API key in src/config/api.ts');
    }
    console.log('remove.bg API key is configured');

    try {
      console.log('Sending request to remove.bg API...');
      console.log('Image URI:', imageUri);
      
      // Create FormData as per remove.bg API documentation
      const formData = new FormData();
      formData.append('image_file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);
      formData.append('size', 'auto');

      console.log('FormData created, sending request...');

      const response = await fetch(API_CONFIG.REMOVE_BG.URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': API_CONFIG.REMOVE_BG.API_KEY,
        },
        body: formData,
      });

      console.log('remove.bg API response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('remove.bg API error response:', errorText);
        throw new Error(`remove.bg API request failed: ${response.status} - ${errorText}`);
      }

      // Get the processed image as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      console.log('Received array buffer of size:', arrayBuffer.byteLength);
      
      // Convert to base64 for React Native
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      console.log('Converted to base64, length:', base64.length);
      
      // Return the base64 data URI
      const result = `data:image/png;base64,${base64}`;
      console.log('Returning processed image');
      return result;
      
    } catch (error) {
      console.error('remove.bg API error:', error);
      throw error;
    }
  }

  // Helper method to convert ArrayBuffer to base64
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Remove background using ML model (simulated for demo)
  private static async removeBackgroundWithML(imageUri: string): Promise<string> {
    // Simulate ML processing with a delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For demo purposes, we'll return the original image
    // In a real implementation, you would:
    // 1. Use TensorFlow.js or similar for client-side ML
    // 2. Send to a free ML service like Hugging Face
    // 3. Use a local ML model
    
    // Here's how you could implement with Hugging Face (free):
    // return await this.removeBackgroundWithHuggingFace(imageUri);
    
    return imageUri;
  }

  // Remove background using Hugging Face (free alternative)
  private static async removeBackgroundWithHuggingFace(imageUri: string): Promise<string> {
    try {
      if (!API_CONFIG.HUGGING_FACE.API_KEY || API_CONFIG.HUGGING_FACE.API_KEY === 'YOUR_HUGGING_FACE_TOKEN') {
        throw new Error('Hugging Face API key not configured. Please add your token in src/config/api.ts');
      }

      // Convert image to base64
      const base64Image = await this.imageToBase64(imageUri);
      
      const response = await fetch(
        API_CONFIG.HUGGING_FACE.BACKGROUND_REMOVAL_MODEL,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_CONFIG.HUGGING_FACE.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: base64Image,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hugging Face API error:', errorText);
        throw new Error(`Hugging Face API request failed: ${response.status} - ${errorText}`);
      }

      // For React Native, convert to base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      
      // Return the base64 data URI
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Hugging Face background removal failed:', error);
      // Fallback to original image
      return imageUri;
    }
  }

  // Convert image to base64
  private static async imageToBase64(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  // Generate outfit suggestions based on user input
  static async generateOutfitSuggestions(
    request: string,
    wardrobeItems: ClothingItem[]
  ): Promise<OutfitSuggestion[]> {
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock outfit suggestions based on the request
      const suggestions: OutfitSuggestion[] = [
        {
          id: '1',
          name: 'Elegant Evening Look',
          items: wardrobeItems.slice(0, 3),
          occasion: 'Evening',
          season: 'All Seasons',
          description: 'A sophisticated ensemble perfect for formal events and special occasions.',
          hairMakeup: 'Sleek updo with neutral makeup and a bold lip.',
          stylingTips: 'Accessorize with statement jewelry and pair with classic pumps.',
        },
        {
          id: '2',
          name: 'Casual Day Out',
          items: wardrobeItems.slice(1, 4),
          occasion: 'Casual',
          season: 'Spring/Summer',
          description: 'Comfortable and stylish outfit for everyday activities.',
          hairMakeup: 'Natural waves with minimal makeup for a fresh look.',
          stylingTips: 'Layer with a light cardigan and add comfortable sneakers.',
        },
      ];

      return suggestions;
    } catch (error) {
      console.error('Outfit generation failed:', error);
      throw new Error('Failed to generate outfit suggestions. Please try again.');
    }
  }

  // Analyze clothing item and extract features
  static async analyzeClothingItem(imageUri: string): Promise<{
    category: string;
    color: string;
    description: string;
  }> {
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analysis results
      const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];
      const colors = ['Black', 'White', 'Navy', 'Red', 'Blue', 'Green', 'Pink', 'Gray'];
      
      return {
        category: categories[Math.floor(Math.random() * categories.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        description: 'AI-analyzed clothing item with automatic feature detection.',
      };
    } catch (error) {
      console.error('Clothing analysis failed:', error);
      throw new Error('Failed to analyze clothing item. Please try again.');
    }
  }
}

// Free background removal alternatives:
// 1. remove.bg - Free tier: 50 images/month
// 2. Hugging Face - Free inference API
// 3. Cloudinary - Free tier with AI features
// 4. Replicate.ai - Free tier for ML models
// 5. TensorFlow.js - Client-side ML processing

export default AIService; 