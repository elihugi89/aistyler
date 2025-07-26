import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  FAB,
  Chip,
  Icon,
  Input,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { theme } from '../theme';
import AIService from '../services/AIService';

const { width, height } = Dimensions.get('window');

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUri?: string;
  description: string;
}

interface UploadState {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  showPreview: boolean;
  itemName: string;
  itemCategory: string;
  itemColor: string;
  itemDescription: string;
}

export const WardrobeScreen = () => {
  const { user, isLoading } = useAuth();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    {
      id: '1',
      name: 'Silk Wrap Dress',
      category: 'Dresses',
      color: 'Navy',
      imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      description: 'Elegant silk wrap dress perfect for formal occasions',
    },
    {
      id: '2',
      name: 'Strappy Heels',
      category: 'Shoes',
      color: 'Silver',
      imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
      description: 'Classic strappy heels for evening wear',
    },
    {
      id: '3',
      name: 'Pearl Earrings',
      category: 'Accessories',
      color: 'White',
      imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop',
      description: 'Timeless pearl earrings for elegant looks',
    },
    {
      id: '4',
      name: 'Tailored Blazer',
      category: 'Outerwear',
      color: 'Black',
      imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      description: 'Professional blazer for business meetings',
    },
    {
      id: '5',
      name: 'Cashmere Sweater',
      category: 'Tops',
      color: 'Cream',
      imageUri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      description: 'Luxurious cashmere sweater for everyday elegance',
    },
    {
      id: '6',
      name: 'Wide-Leg Trousers',
      category: 'Bottoms',
      color: 'Charcoal',
      imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      description: 'Sophisticated wide-leg trousers for professional settings',
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [uploadState, setUploadState] = useState<UploadState>({
    originalImage: null,
    processedImage: null,
    isProcessing: false,
    showPreview: false,
    itemName: '',
    itemCategory: 'Tops',
    itemColor: '',
    itemDescription: '',
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];

  // AI background removal
  const processImageWithAI = async (imageUri: string): Promise<{ success: boolean; processedImageUri?: string; error?: string }> => {
    try {
      const processedImageUri = await AIService.removeBackground(imageUri);
      return { success: true, processedImageUri };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add clothing items.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadState(prev => ({
        ...prev,
        originalImage: result.assets[0].uri,
        showPreview: true,
      }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadState(prev => ({
        ...prev,
        originalImage: result.assets[0].uri,
        showPreview: true,
      }));
    }
  };

  const selectFromLibrary = async () => {
    await pickImage();
  };

  const processImage = async () => {
    if (!uploadState.originalImage) return;

    setUploadState(prev => ({ 
      ...prev, 
      isProcessing: true,
    }));

    try {
      const result = await processImageWithAI(uploadState.originalImage);
      
      if (result.success && result.processedImageUri) {
        setUploadState(prev => ({
          ...prev,
          processedImage: result.processedImageUri || null,
          isProcessing: false,
        }));
      } else {
        Alert.alert('Error', result.error || 'Failed to process image. Please try again.');
        setUploadState(prev => ({ 
          ...prev, 
          isProcessing: false,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setUploadState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const saveItem = () => {
    if (!uploadState.processedImage || !uploadState.itemName.trim()) {
      Alert.alert('Error', 'Please provide an image and item name.');
      return;
    }

    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name: uploadState.itemName,
      category: uploadState.itemCategory,
      color: uploadState.itemColor,
      imageUri: uploadState.processedImage,
      description: uploadState.itemDescription,
    };

    setClothingItems(prev => [...prev, newItem]);
    setUploadState({
      originalImage: null,
      processedImage: null,
      isProcessing: false,
      showPreview: false,
      itemName: '',
      itemCategory: 'Tops',
      itemColor: '',
      itemDescription: '',
    });

    Alert.alert('Success', 'Clothing item added to your wardrobe!');
  };

  const filteredItems = selectedCategory === 'All' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WARDROBE</Text>
        <Text style={styles.headerSubtitle}>
          {clothingItems.length} items
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items Grid */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImageContainer}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemOverlay}>
                  <TouchableOpacity style={styles.itemActionButton}>
                    <Ionicons name="create-outline" size={16} color="#000000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.itemActionButton}>
                    <Ionicons name="trash-outline" size={16} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemColor}>{item.color}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Item FAB */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setUploadState(prev => ({ ...prev, showPreview: true }))}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal
        visible={uploadState.showPreview}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setUploadState(prev => ({ ...prev, showPreview: false }))}
            >
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>ADD ITEM</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Image Preview Section */}
            <View style={styles.previewSection}>
              <View style={styles.imagePreviewContainer}>
                {uploadState.originalImage && (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>ORIGINAL</Text>
                    <Image
                      source={{ uri: uploadState.originalImage }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                
                {uploadState.processedImage && (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>PROCESSED</Text>
                    <Image
                      source={{ uri: uploadState.processedImage }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>

              {!uploadState.processedImage && !uploadState.isProcessing && (
                <View style={styles.uploadActions}>
                  <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                    <Text style={styles.uploadButtonText}>TAKE PHOTO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadButton} onPress={selectFromLibrary}>
                    <Text style={styles.uploadButtonText}>SELECT FROM LIBRARY</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!uploadState.processedImage && !uploadState.isProcessing && uploadState.originalImage && (
                <TouchableOpacity style={styles.processButton} onPress={processImage}>
                  <Text style={styles.processButtonText}>PROCESS IMAGE</Text>
                </TouchableOpacity>
              )}

              {uploadState.isProcessing && (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#000000" />
                  <Text style={styles.processingText}>
                    Processing image...
                  </Text>
                </View>
              )}
            </View>

            {/* Item Details Form */}
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>ITEM DETAILS</Text>
              
              <Input
                placeholder="Item name"
                value={uploadState.itemName}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemName: text }))}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                inputContainerStyle={styles.inputContainerStyle}
              />

              <View style={styles.categoryFormContainer}>
                <Text style={styles.inputLabel}>CATEGORY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryFormButton,
                        uploadState.itemCategory === category && styles.categoryFormButtonActive
                      ]}
                      onPress={() => setUploadState(prev => ({ ...prev, itemCategory: category }))}
                    >
                      <Text style={[
                        styles.categoryFormText,
                        uploadState.itemCategory === category && styles.categoryFormTextActive
                      ]}>
                        {category.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Input
                placeholder="Color"
                value={uploadState.itemColor}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemColor: text }))}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                inputContainerStyle={styles.inputContainerStyle}
              />

              <Input
                placeholder="Description (optional)"
                value={uploadState.itemDescription}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemDescription: text }))}
                multiline
                numberOfLines={3}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                inputContainerStyle={styles.inputContainerStyle}
              />
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!uploadState.processedImage || !uploadState.itemName.trim()) && styles.saveButtonDisabled
              ]}
              onPress={saveItem}
              disabled={!uploadState.processedImage || !uploadState.itemName.trim()}
            >
              <Text style={styles.saveButtonText}>SAVE ITEM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
    letterSpacing: 1,
  },
  categoryContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  categoryButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  itemCard: {
    width: (width - 30) / 2,
    marginBottom: 30,
    marginHorizontal: 5,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: (width - 30) / 2 * 1.4,
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  itemActionButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    paddingHorizontal: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  itemColor: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
  },
  placeholder: {
    width: 60,
  },
  modalContent: {
    flex: 1,
  },
  previewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  imageSection: {
    flex: 1,
  },
  imageLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 8,
    letterSpacing: 1,
  },
  previewImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f8f8',
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
  },
  processButton: {
    paddingVertical: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  processButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 1,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    fontWeight: '300',
  },
  formSection: {
    padding: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 20,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  categoryFormContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 12,
    letterSpacing: 1,
  },
  categoryFormButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginRight: 10,
  },
  categoryFormButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  categoryFormText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
  },
  categoryFormTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 1,
  },
}); 