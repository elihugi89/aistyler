// Combined Image Processing Service
// Handles Remove.bg background removal + Runway ML clothing segmentation

import { removeBgService, RemoveBgResponse } from './RemoveBgService';
import { runwayMLService, RunwayMLResponse } from './RunwayMLService';

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
      {
        name: 'Clothing Segmentation (Runway ML)',
        status: 'pending',
        progress: 0,
      },
    ];

    try {
      // Step 1: Remove background using Remove.bg
      steps[0].status = 'processing';
      steps[0].progress = 25;
      
      const removeBgResult: RemoveBgResponse = await removeBgService.removeBackground(imageUri);
      
      if (!removeBgResult.success) {
        steps[0].status = 'failed';
        steps[0].error = removeBgResult.error;
        return {
          success: false,
          originalImageUri: imageUri,
          steps,
          error: `Background removal failed: ${removeBgResult.error}`,
        };
      }

      steps[0].status = 'completed';
      steps[0].progress = 100;

      // Step 2: Apply clothing segmentation using Runway ML
      steps[1].status = 'processing';
      steps[1].progress = 25;

      const runwayMLResult: RunwayMLResponse = await runwayMLService.segmentClothing(
        removeBgResult.processedImageUri!
      );

      if (!runwayMLResult.success) {
        steps[1].status = 'failed';
        steps[1].error = runwayMLResult.error;
        return {
          success: false,
          originalImageUri: imageUri,
          backgroundRemovedUri: removeBgResult.processedImageUri,
          steps,
          error: `Clothing segmentation failed: ${runwayMLResult.error}`,
        };
      }

      steps[1].status = 'completed';
      steps[1].progress = 100;

      return {
        success: true,
        originalImageUri: imageUri,
        backgroundRemovedUri: removeBgResult.processedImageUri,
        segmentedClothingUri: runwayMLResult.segmentedImageUri,
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

  // Validate both API keys
  async validateAPIs(): Promise<{
    removeBgValid: boolean;
    runwayMLValid: boolean;
  }> {
    const [removeBgValid, runwayMLValid] = await Promise.all([
      removeBgService.validateApiKey(),
      runwayMLService.validateApiKey(),
    ]);

    return {
      removeBgValid,
      runwayMLValid,
    };
  }
}

export const imageProcessingService = new ImageProcessingService(); 