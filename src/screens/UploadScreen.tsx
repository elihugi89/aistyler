import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { LoadingScreen } from '../components/LoadingScreen';
import AIService from '../services/AIService';

export const UploadScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      await processBackgroundRemoval(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      await processBackgroundRemoval(result.assets[0].uri);
    }
  };

  const processBackgroundRemoval = async (imageUri: string) => {
    try {
      setIsProcessing(true);
      console.log('Starting automatic background removal for:', imageUri);
      
      const processedImageUri = await AIService.removeBackground(imageUri);
      console.log('Background removal completed successfully!');
      console.log('Processed image URI:', processedImageUri);
      
      setProcessedImage(processedImageUri);
      setProcessingResult({
        success: true,
        originalImageUri: imageUri,
        backgroundRemovedUri: processedImageUri,
        steps: [
          {
            name: 'Background Removal',
            status: 'completed',
            progress: 100,
          }
        ]
      });
    } catch (error) {
      console.error('Error processing background removal:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          errorMessage = 'API service error. Please check your internet connection and try again.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check app permissions.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(`Failed to process image: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add to Wardrobe</Text>
        <Text style={styles.subtitle}>Background will be automatically removed</Text>
      </View>

      {!image ? (
        <View style={styles.uploadContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
              <Ionicons name="camera" size={32} color={theme.colors.primary} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="images" size={32} color={theme.colors.primary} />
              <Text style={styles.buttonText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <View style={styles.imageComparison}>
            <View style={styles.imageSection}>
              <Text style={styles.imageLabel}>Original</Text>
              <Image source={{ uri: image }} style={styles.previewImage} />
            </View>
            
            {processedImage && (
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Background Removed</Text>
                <Image source={{ uri: processedImage }} style={styles.previewImage} />
              </View>
            )}
          </View>
          
          {processingResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Processing Results</Text>
              <Text style={styles.resultText}>
                Status: {processingResult.success ? 'Success' : 'Failed'}
              </Text>
              {processingResult.error && (
                <Text style={styles.errorText}>Error: {processingResult.error}</Text>
              )}
              {processingResult.steps && processingResult.steps.length > 0 && (
                <View style={styles.stepsContainer}>
                  <Text style={styles.stepsTitle}>Processing Steps:</Text>
                  {processingResult.steps.map((step: any, index: number) => (
                    <View key={index} style={styles.stepItem}>
                      <Text style={styles.stepText}>
                        {step.name}: {step.status} ({step.progress}%)
                      </Text>
                      {step.error && (
                        <Text style={styles.stepError}>Error: {step.error}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setImage(null);
              setProcessedImage(null);
              setProcessingResult(null);
            }}
          >
            <Text style={styles.retakeButtonText}>Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grey[600],
    textAlign: 'center',
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  uploadButton: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 8,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
  },
  imageComparison: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 14,
    color: theme.colors.grey[600],
    marginBottom: 8,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resultContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: theme.colors.onBackground,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: 4,
  },
  retakeButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 4,
  },
  stepItem: {
    marginBottom: 4,
  },
  stepText: {
    fontSize: 13,
    color: theme.colors.onBackground,
  },
  stepError: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 2,
  },
}); 