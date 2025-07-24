import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { LoadingScreen } from '../components/LoadingScreen';
import { aiService } from '../services/AIService';

export const UploadScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);
      const analysis = await aiService.analyzeImage(imageUri);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add to Wardrobe</Text>
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
          <Image source={{ uri: image }} style={styles.previewImage} />
          {analysisResult && (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>Analysis Results</Text>
              <Text style={styles.analysisText}>Type: {analysisResult.type}</Text>
              <Text style={styles.analysisText}>Category: {analysisResult.category}</Text>
              <Text style={styles.analysisText}>Color: {analysisResult.color}</Text>
              <Text style={styles.analysisText}>
                Tags: {analysisResult.tags.join(', ')}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setImage(null);
              setAnalysisResult(null);
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
  },
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h5,
    color: theme.colors.onBackground,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  previewContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  analysisContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  analysisTitle: {
    ...theme.typography.h6,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
  },
  analysisText: {
    ...theme.typography.body1,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.sm,
  },
  retakeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
  },
  retakeButtonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
}); 