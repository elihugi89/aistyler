import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
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
  PanResponder,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  FAB,
  Icon,
  Input,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import { AIService } from '../services/AIService';

interface CollageItem {
  id: string;
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  zIndex: number;
}

interface OutfitCollage {
  id: string;
  name: string;
  items: CollageItem[];
  background: string;
  canvasSize: { width: number; height: number };
  createdAt: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CANVAS_WIDTH = screenWidth - 32;
const CANVAS_HEIGHT = screenHeight * 0.6;

const OutfitCollageScreen = () => {
  const navigation = useNavigation();
  const [collageItems, setCollageItems] = useState<CollageItem[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string>('#f8f9fa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [collageName, setCollageName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedCollages, setSavedCollages] = useState<OutfitCollage[]>([]);
  
  const viewShotRef = useRef<ViewShot>(null);

  const backgrounds = [
    { id: '1', color: '#f8f9fa', name: 'Light Gray' },
    { id: '2', color: '#ffffff', name: 'White' },
    { id: '3', color: '#000000', name: 'Black' },
    { id: '4', color: '#e3f2fd', name: 'Light Blue' },
    { id: '5', color: '#f3e5f5', name: 'Light Purple' },
    { id: '6', color: '#e8f5e8', name: 'Light Green' },
  ];

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
      addItemToCollage(result.assets[0].uri);
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
      addItemToCollage(result.assets[0].uri);
    }
  };

  const addItemToCollage = (imageUri: string) => {
    const newItem: CollageItem = {
      id: Date.now().toString(),
      originalImage: imageUri,
      processedImage: null,
      isProcessing: true,
      position: { x: 50, y: 50 },
      scale: 1,
      rotation: 0,
      zIndex: collageItems.length,
    };

    setCollageItems(prev => [...prev, newItem]);
    processImage(newItem.id);
  };

  const processImage = async (itemId: string) => {
    const item = collageItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      const processedImage = await AIService.removeBackground(item.originalImage);
      
      setCollageItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, processedImage, isProcessing: false }
          : i
      ));
    } catch (error) {
      console.error('Failed to process image:', error);
      setCollageItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, isProcessing: false }
          : i
      ));
      Alert.alert('Error', 'Failed to remove background. Please try again.');
    }
  };

  const removeItem = (itemId: string) => {
    setCollageItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateItemPosition = (itemId: string, position: { x: number; y: number }) => {
    setCollageItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, position } : i
    ));
  };

  const updateItemScale = (itemId: string, scale: number) => {
    setCollageItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, scale } : i
    ));
  };

  const updateItemRotation = (itemId: string, rotation: number) => {
    setCollageItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, rotation } : i
    ));
  };

  const bringToFront = (itemId: string) => {
    setCollageItems(prev => {
      const maxZIndex = Math.max(...prev.map(i => i.zIndex));
      return prev.map(i => 
        i.id === itemId ? { ...i, zIndex: maxZIndex + 1 } : i
      );
    });
  };

  const saveCollage = async () => {
    if (!collageName.trim()) {
      Alert.alert('Error', 'Please enter a name for your outfit collage.');
      return;
    }

    if (collageItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to your collage.');
      return;
    }

    setIsProcessing(true);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library permissions to save the collage.');
        return;
      }

      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        
        await MediaLibrary.saveToLibraryAsync(uri);
        
        const newCollage: OutfitCollage = {
          id: Date.now().toString(),
          name: collageName,
          items: collageItems,
          background: selectedBackground,
          canvasSize: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
          createdAt: new Date().toISOString(),
        };

        setSavedCollages(prev => [newCollage, ...prev]);
        setShowSaveModal(false);
        setCollageName('');
        
        Alert.alert('Success', 'Outfit collage saved to your photo library!');
      }
    } catch (error) {
      console.error('Failed to save collage:', error);
      Alert.alert('Error', 'Failed to save collage. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCollageItem = (item: CollageItem) => (
    <View
      key={item.id}
      style={[
        styles.collageItem,
        {
          left: item.position.x,
          top: item.position.y,
          transform: [
            { scale: item.scale },
            { rotate: `${item.rotation}deg` }
          ],
          zIndex: item.zIndex,
        }
      ]}
    >
      {item.isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      ) : item.processedImage ? (
        <Image
          source={{ uri: item.processedImage }}
          style={styles.processedImage}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={{ uri: item.originalImage }}
          style={styles.originalImage}
          resizeMode="contain"
        />
      )}
      
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => bringToFront(item.id)}
        >
          <Ionicons name="layers" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.deleteButton]}
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text h4 style={styles.headerTitle}>Create Outfit Collage</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            Combine multiple clothing items into one stunning outfit
          </Text>
        </View>

        {/* Instructions */}
        {collageItems.length === 0 && (
          <Card containerStyle={styles.instructionsCard}>
            <View style={styles.instructionsContent}>
              <Ionicons name="bulb-outline" size={48} color="#6366f1" />
              <Text style={styles.instructionsTitle}>How to Create Your Outfit Collage</Text>
              <View style={styles.instructionSteps}>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Tap the camera button to add clothing items</Text>
                </View>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Backgrounds will be automatically removed</Text>
                </View>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Arrange items on your chosen background</Text>
                </View>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <Text style={styles.stepText}>Save your collage to your photo library</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Background Selection */}
        <Card containerStyle={styles.backgroundCard}>
          <Card.Title>Choose Background</Card.Title>
          <View style={styles.backgroundGrid}>
            {backgrounds.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                style={[
                  styles.backgroundOption,
                  { backgroundColor: bg.color },
                  selectedBackground === bg.color && styles.selectedBackground
                ]}
                onPress={() => setSelectedBackground(bg.color)}
              >
                {selectedBackground === bg.color && (
                  <Ionicons name="checkmark" size={20} color="#6366f1" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Canvas */}
        <Card containerStyle={styles.canvasCard}>
          <Card.Title>Outfit Canvas</Card.Title>
          <View style={styles.canvasContainer}>
            <ViewShot
              ref={viewShotRef}
              style={[
                styles.canvas,
                { backgroundColor: selectedBackground }
              ]}
            >
              {collageItems.map(renderCollageItem)}
            </ViewShot>
          </View>
        </Card>

        {/* Saved Collages */}
        {savedCollages.length > 0 && (
          <Card containerStyle={styles.savedCard}>
            <Card.Title>Saved Collages</Card.Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {savedCollages.map((collage) => (
                <View key={collage.id} style={styles.savedCollage}>
                  <View style={styles.savedCollagePreview}>
                    {collage.items.slice(0, 3).map((item, index) => (
                      <View key={item.id} style={[styles.savedItem, { zIndex: 3 - index }]}>
                        {item.processedImage ? (
                          <Image
                            source={{ uri: item.processedImage }}
                            style={styles.savedItemImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.savedItemPlaceholder}>
                            <Ionicons name="shirt-outline" size={16} color="#6366f1" />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                  <Text style={styles.savedCollageName}>{collage.name}</Text>
                </View>
              ))}
            </ScrollView>
          </Card>
        )}
      </ScrollView>

      {/* Save Modal */}
      <Modal
        visible={showSaveModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text h4 style={styles.modalTitle}>Save Outfit Collage</Text>
            <TouchableOpacity
              onPress={() => setShowSaveModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Input
              placeholder="Enter collage name (e.g., Summer Wedding Look)"
              value={collageName}
              onChangeText={setCollageName}
              containerStyle={styles.inputContainer}
            />

            <View style={styles.modalActions}>
              <Button
                title="Save to Photos"
                onPress={saveCollage}
                disabled={isProcessing || !collageName.trim()}
                loading={isProcessing}
                containerStyle={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <FAB
        icon={{ name: 'camera', color: 'white' }}
        color="#6366f1"
        placement="right"
        onPress={pickImage}
        title="Add Item"
      />

      {/* Save Collage Button */}
      {collageItems.length > 0 && (
        <View style={styles.saveCollageButton}>
          <Button
            title="Save Collage"
            onPress={() => setShowSaveModal(true)}
            icon={{
              name: 'save',
              type: 'ionicon',
              size: 16,
              color: 'white',
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerSubtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  instructionsCard: {
    margin: 16,
    borderRadius: 12,
  },
  instructionsContent: {
    alignItems: 'center',
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionSteps: {
    width: '100%',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    opacity: 0.8,
  },
  backgroundCard: {
    margin: 16,
    borderRadius: 12,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  backgroundOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBackground: {
    borderColor: '#6366f1',
  },
  canvasCard: {
    margin: 16,
    borderRadius: 12,
  },
  canvasContainer: {
    alignItems: 'center',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  collageItem: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  processingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  processingText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  processedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  originalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    opacity: 0.7,
  },
  itemControls: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(239,68,68,0.8)',
  },
  savedCard: {
    margin: 16,
    borderRadius: 12,
  },
  savedCollage: {
    alignItems: 'center',
    marginRight: 16,
  },
  savedCollagePreview: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  savedItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: -8,
    borderWidth: 2,
    borderColor: 'white',
  },
  savedItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  savedItemPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCollageName: {
    fontSize: 12,
    opacity: 0.7,
  },
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
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  modalActions: {
    marginTop: 20,
  },
  saveButton: {
    width: '100%',
  },
  saveCollageButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
});

export default OutfitCollageScreen; 