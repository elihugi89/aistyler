import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Input,
  Divider,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate elements on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleGetOutfitSuggestion = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter your outfit request');
      return;
    }

    setIsLoadingSuggestion(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoadingSuggestion(false);
      setShowSuggestions(true);
    }, 1500);
  };

  const outfitSuggestion = {
    id: '1',
    title: 'Evening Wedding Elegance',
    occasion: 'Wedding',
    items: [
      { 
        id: '1', 
        name: 'Navy Silk Wrap Dress', 
        category: 'Dress', 
        color: 'Navy', 
        imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
      },
      { 
        id: '2', 
        name: 'Silver Strappy Heels', 
        category: 'Shoes', 
        color: 'Silver', 
        imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
      },
      { 
        id: '3', 
        name: 'Pearl Drop Earrings', 
        category: 'Accessories', 
        color: 'White', 
        imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop'
      },
      { 
        id: '4', 
        name: 'Silver Clutch', 
        category: 'Accessories', 
        color: 'Silver', 
        imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
      },
    ],
    hairMakeup: 'Soft curls with natural glam look - bronze tones, nude lipstick',
    tips: [
      'The navy dress provides sophistication without being too flashy',
      'Silver accessories create a cohesive metallic theme',
      'Keep makeup natural with a focus on glowing skin'
    ],
    rating: 5,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Hero Section with Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <Animated.View 
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="sparkles" size={40} color="#ffffff" />
          </View>
          <Text style={styles.heroTitle}>AI Style Assistant</Text>
          <Text style={styles.heroSubtitle}>
            Your personal fashion stylist powered by AI
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* AI Outfit Generator */}
        <View style={styles.aiSection}>
          <Card containerStyle={styles.aiCard}>
            <View style={styles.aiCardHeader}>
              <Ionicons name="sparkles" size={24} color="#6366f1" />
              <Text style={styles.aiCardTitle}>AI Outfit Generator</Text>
            </View>
            <Text style={styles.aiCardSubtitle}>
              Describe your occasion and get personalized outfit suggestions
            </Text>
            
            <Input
              placeholder="e.g., 'I need an elegant outfit for an evening wedding'"
              value={searchQuery}
              onChangeText={setSearchQuery}
              multiline
              numberOfLines={3}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainerStyle}
            />
            
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGetOutfitSuggestion}
              disabled={isLoadingSuggestion}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.generateButtonGradient}
              >
                {isLoadingSuggestion ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={20} color="#ffffff" style={styles.spinning} />
                    <Text style={styles.generateButtonText}>Creating your outfit...</Text>
                  </View>
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#ffffff" />
                    <Text style={styles.generateButtonText}>Generate Outfit</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Outfit Suggestion */}
        {showSuggestions && (
          <View style={styles.suggestionContainer}>
            <Card containerStyle={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionTitle}>{outfitSuggestion.title}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons 
                      key={i} 
                      name="star" 
                      size={16} 
                      color={i < outfitSuggestion.rating ? "#fbbf24" : "#e5e7eb"} 
                    />
                  ))}
                </View>
              </View>
              
              {/* Outfit Preview Collage */}
              <View style={styles.outfitPreview}>
                <View style={styles.outfitPreviewGrid}>
                  {outfitSuggestion.items.slice(0, 4).map((item, index) => (
                    <View key={item.id} style={[styles.previewItem, { zIndex: 4 - index }]}>
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>
                <Text style={styles.previewText}>Complete Outfit Look</Text>
              </View>

              {/* Outfit Items */}
              <View style={styles.outfitItems}>
                {outfitSuggestion.items.map((item) => (
                  <View key={item.id} style={styles.outfitItem}>
                    <View style={styles.itemImageContainer}>
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.category}</Text>
                      </View>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemColor}>{item.color}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Hair & Makeup */}
              <View style={styles.hairMakeupSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="cut" size={20} color="#f59e0b" />
                  <Text style={styles.sectionTitle}>Hair & Makeup</Text>
                </View>
                <Text style={styles.hairMakeupText}>{outfitSuggestion.hairMakeup}</Text>
              </View>

              {/* Styling Tips */}
              <View style={styles.tipsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bulb" size={20} color="#10b981" />
                  <Text style={styles.sectionTitle}>Styling Tips</Text>
                </View>
                {outfitSuggestion.tips.map((tip, index) => (
                  <View key={index} style={styles.tipContainer}>
                    <View style={styles.tipIcon}>
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.suggestionActions}>
                <TouchableOpacity style={styles.saveButton}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.saveButtonGradient}
                  >
                    <Ionicons name="bookmark" size={16} color="#ffffff" />
                    <Text style={styles.saveButtonText}>Save Outfit</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tryAgainButton}
                  onPress={() => setShowSuggestions(false)}
                >
                  <Text style={styles.tryAgainText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContent: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#f8fafc',
    paddingTop: 30,
  },
  aiSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  aiCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  aiCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  suggestionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  suggestionCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  outfitPreview: {
    alignItems: 'center',
    marginVertical: 20,
  },
  outfitPreviewGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: -8,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  previewText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  outfitItem: {
    width: '48%',
    marginBottom: 15,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  itemInfo: {
    paddingHorizontal: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  itemColor: {
    fontSize: 10,
    color: '#6b7280',
  },
  hairMakeupSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  hairMakeupText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    color: '#6b7280',
    lineHeight: 20,
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  tryAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tryAgainText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
}); 