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
// import { useTheme } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AIService from '../services/AIService';

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

const WardrobeScreen = () => {
  // const { theme } = useTheme();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    {
      id: '1',
      name: 'Navy Silk Wrap Dress',
      category: 'Dresses',
      color: 'Navy',
      imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
      description: 'Elegant silk wrap dress perfect for formal occasions',
    },
    {
      id: '2',
      name: 'Silver Strappy Heels',
      category: 'Shoes',
      color: 'Silver',
      imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      description: 'Classic strappy heels for evening wear',
    },
    {
      id: '3',
      name: 'Pearl Drop Earrings',
      category: 'Accessories',
      color: 'White',
      imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      description: 'Timeless pearl earrings for elegant looks',
    },
    {
      id: '4',
      name: 'Black Blazer',
      category: 'Outerwear',
      color: 'Black',
      imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      description: 'Professional blazer for business meetings',
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

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];

  // Use actual AI service for background removal
  const removeBackground = async (imageUri: string): Promise<string> => {
    try {
      return await AIService.removeBackground(imageUri);
    } catch (error) {
      console.error('Background removal error:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Add Clothing Item',
      'Choose how you want to add your clothing item:',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(),
        },
        {
          text: 'Choose from Library',
          onPress: () => selectFromLibrary(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
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
      aspect: [1, 1],
      quality: 0.8,
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add clothing items.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadState(prev => ({
        ...prev,
        originalImage: result.assets[0].uri,
        showPreview: true,
      }));
    }
  };

  const processImage = async () => {
    if (!uploadState.originalImage) return;

    setUploadState(prev => ({ ...prev, isProcessing: true }));

    try {
      const processedImageUri = await removeBackground(uploadState.originalImage);
      setUploadState(prev => ({
        ...prev,
        processedImage: processedImageUri,
        isProcessing: false,
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setUploadState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const saveItem = () => {
    if (!uploadState.itemName.trim() || !uploadState.processedImage) {
      Alert.alert('Error', 'Please fill in all required fields and process the image.');
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
    
    // Reset upload state
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tops': return 'shirt-outline';
      case 'Bottoms': return 'shirt-outline';
      case 'Dresses': return 'female-outline';
      case 'Shoes': return 'footsteps-outline';
      case 'Accessories': return 'diamond-outline';
      case 'Outerwear': return 'shirt-outline';
      default: return 'shirt-outline';
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text h4 style={styles.headerTitle}>My Digital Closet</Text>
          <Text style={styles.headerSubtitle}>
            {clothingItems.length} items in your wardrobe
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <Chip
                key={category}
                title={category}
                type={selectedCategory === category ? 'solid' : 'outline'}
                onPress={() => setSelectedCategory(category)}
                containerStyle={styles.categoryChip}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.itemsContainer}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <TouchableOpacity style={styles.itemCard} onPress={() => Alert.alert('Item Details', item.name)}>
                <View style={styles.itemImageContainer}>
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Icon
                        name={getCategoryIcon(item.category)}
                        type="ionicon"
                        size={24}
                        color="#6366f1"
                      />
                    </View>
                  )}
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                </View>
                
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemColor}>{item.color}</Text>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Edit', `Edit ${item.name}`)}
                  >
                    <Ionicons name="create-outline" size={16} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Delete', `Delete ${item.name}`)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {filteredItems.length === 0 && (
          <Card containerStyle={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <Ionicons name="shirt-outline" size={64} color="#6366f1" />
              <Text h4 style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptyText}>
                Add some clothing items to your digital closet to get started!
              </Text>
              <View style={styles.emptyInstructions}>
                <Text style={styles.instructionText}>
                  📸 Tap the camera button to take a photo or choose from your library
                </Text>
                <Text style={styles.instructionText}>
                  🤖 AI will automatically remove the background
                </Text>
                <Text style={styles.instructionText}>
                  ✨ Add details and save to your wardrobe
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Upload Preview Modal */}
      <Modal
        visible={uploadState.showPreview}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text h4 style={styles.modalTitle}>Add New Item</Text>
              <Text style={styles.modalSubtitle}>
                {uploadState.originalImage?.includes('Camera') ? '📸 Photo taken' : '📁 From library'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setUploadState(prev => ({ ...prev, showPreview: false }))}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Image Preview Section */}
            <Card containerStyle={styles.previewCard}>
              <Card.Title>Image Preview</Card.Title>
              <View style={styles.imagePreviewContainer}>
                {uploadState.originalImage && (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>Original</Text>
                    <Image
                      source={{ uri: uploadState.originalImage }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                
                {uploadState.processedImage && (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>Background Removed</Text>
                    <Image
                      source={{ uri: uploadState.processedImage }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>

              {!uploadState.processedImage && !uploadState.isProcessing && (
                <Button
                  title="Remove Background with AI"
                  onPress={processImage}
                  containerStyle={styles.processButton}
                  buttonStyle={styles.processButtonStyle}
                />
              )}

              {uploadState.isProcessing && (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={styles.processingText}>
                    AI is removing background...
                  </Text>
                </View>
              )}
            </Card>

            {/* Item Details Form */}
            <Card containerStyle={styles.formCard}>
              <Card.Title>Item Details</Card.Title>
              
              <Input
                placeholder="Item name (e.g., Blue Silk Blouse)"
                value={uploadState.itemName}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemName: text }))}
                containerStyle={styles.inputContainer}
              />

              <View style={styles.categoryContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.slice(1).map((category) => (
                    <Chip
                      key={category}
                      title={category}
                      type={uploadState.itemCategory === category ? 'solid' : 'outline'}
                      onPress={() => setUploadState(prev => ({ ...prev, itemCategory: category }))}
                      containerStyle={styles.categoryChipForm}
                    />
                  ))}
                </ScrollView>
              </View>

              <Input
                placeholder="Color (e.g., Navy, Black, White)"
                value={uploadState.itemColor}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemColor: text }))}
                containerStyle={styles.inputContainer}
              />

              <Input
                placeholder="Description (optional)"
                value={uploadState.itemDescription}
                onChangeText={(text) => setUploadState(prev => ({ ...prev, itemDescription: text }))}
                multiline
                numberOfLines={3}
                containerStyle={styles.inputContainer}
              />
            </Card>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.modalFooter}>
            <Button
              title="Save to Wardrobe"
              onPress={saveItem}
              disabled={!uploadState.processedImage || !uploadState.itemName.trim()}
              containerStyle={styles.saveButton}
              buttonStyle={styles.saveButtonStyle}
            />
          </View>
        </View>
      </Modal>

      <FAB
        icon={{ name: 'camera', color: 'white' }}
        color="#6366f1"
        placement="right"
        onPress={pickImage}
        title="Add Item"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    marginBottom: 5,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '31%',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  itemInfo: {
    padding: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemColor: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyInstructions: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    flex: 1,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  previewCard: {
    margin: 16,
    borderRadius: 12,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imageSection: {
    alignItems: 'center',
    flex: 1,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  processButton: {
    marginTop: 8,
  },
  processButtonStyle: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  formCard: {
    margin: 16,
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  categoryChipForm: {
    marginRight: 8,
    marginBottom: 8,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    width: '100%',
  },
  saveButtonStyle: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
  },
});

export default WardrobeScreen; 