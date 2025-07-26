// Combined Image Processing Service
// Handles Remove.bg background removal + Runway ML clothing segmentation

import { removeBgService, RemoveBgResponse } from './RemoveBgService';

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
}

export interface ImageProcessingResult {
  success: boolean;
  originalImageUri: string;
  backgroundRemovedUri?: string;
  segmentedClothingUri?: string;
  steps: ProcessingStep[];
  error?: string;
}

class ImageProcessingService {
  // Process image through both Remove.bg and Runway ML
  async processImage(imageUri: string): Promise<ImageProcessingResult> {
    const steps: ProcessingStep[] = [
      {
        name: 'Background Removal (Remove.bg)',
        status: 'pending',
        progress: 0,
      },
      // Removed clothing segmentation step
    ];

    try {
      // Step 1: Remove background using Remove.bg
      steps[0].status = 'processing';
      steps[0].progress = 25;
      
      const removeBgResult: RemoveBgResponse = await removeBgService.removeBackground(imageUri);
      
      console.log('RemoveBgService complete response:', JSON.stringify(removeBgResult, null, 2));
      console.log('RemoveBgResult success:', removeBgResult.success);
      console.log('RemoveBgResult processedImageUri:', removeBgResult.processedImageUri);
      
      if (!removeBgResult.success) {
        steps[0].status = 'failed';
        steps[0].error = removeBgResult.error;
        console.log('RemoveBg failed with error:', removeBgResult.error);
        return {
          success: false,
          originalImageUri: imageUri,
          steps,
          error: `Background removal failed: ${removeBgResult.error}`,
        };
      }

      steps[0].status = 'completed';
      steps[0].progress = 100;

      console.log('ImageProcessingService returning success with backgroundRemovedUri:', removeBgResult.processedImageUri);
      
      return {
        success: true,
        originalImageUri: imageUri,
        backgroundRemovedUri: removeBgResult.processedImageUri,
        steps,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Mark current step as failed
      const currentStep = steps.find(step => step.status === 'processing');
      if (currentStep) {
        currentStep.status = 'failed';
        currentStep.error = errorMessage;
      }

      return {
        success: false,
        originalImageUri: imageUri,
        steps,
        error: errorMessage,
      };
    }
  }

  // Get processing status and progress
  getProcessingStatus(steps: ProcessingStep[]): {
    overallProgress: number;
    currentStep: string;
    isComplete: boolean;
    hasErrors: boolean;
  } {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const failedSteps = steps.filter(step => step.status === 'failed').length;
    const processingStep = steps.find(step => step.status === 'processing');

    const overallProgress = Math.round((completedSteps / totalSteps) * 100);
    const currentStep = processingStep?.name || 'Complete';
    const isComplete = completedSteps === totalSteps;
    const hasErrors = failedSteps > 0;

    return {
      overallProgress,
      currentStep,
      isComplete,
      hasErrors,
    };
  }

  // Validate API keys
  async validateAPIs(): Promise<{
    removeBgValid: boolean;
  }> {
    const removeBgValid = await removeBgService.validateApiKey();

    if (!removeBgValid) {
      throw new Error('Remove.bg API key is invalid.');
    }

    return {
      removeBgValid,
    };
  }
}

export const imageProcessingService = new ImageProcessingService(); 