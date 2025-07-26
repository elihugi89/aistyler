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
  const slideAnim = new Animated.Value(30);

  // Daily fashion quote
  const dailyQuotes = [
    "Style is a way to say who you are without having to speak.",
    "Fashion is the armor to survive the reality of everyday life.",
    "Elegance is the only beauty that never fades.",
    "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street.",
    "The best color in the whole world is the one that looks good on you."
  ];
  const [currentQuote] = useState(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);

  useEffect(() => {
    // Animate elements on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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
        name: 'Silk Wrap Dress', 
        category: 'Dress', 
        color: 'Navy', 
        imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c219d395e971b5c909cb0_Frame%202.jpg'
      },
      { 
        id: '2', 
        name: 'Strappy Heels', 
        category: 'Shoes', 
        color: 'Silver', 
        imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215a3b7410473cbc2345_Frame%201%202.jpg'
      },
      { 
        id: '3', 
        name: 'Pearl Earrings', 
        category: 'Accessories', 
        color: 'White', 
        imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/66070420b7638d7c6b4aeaaf_4.jpg'
      },
      { 
        id: '4', 
        name: 'Tailored Blazer', 
        category: 'Outerwear', 
        color: 'Black', 
        imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215e8b46e32ae547ad09_Frame%203%202.jpg'
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI STYLE ASSISTANT</Text>
        <Text style={styles.headerSubtitle}>
          Your personal fashion curator
        </Text>
      </View>

      {/* Daily Quote */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteText}>"{currentQuote}"</Text>
        <Text style={styles.quoteAuthor}>— Coco Chanel</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* AI Outfit Generator */}
        <View style={styles.aiSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OUTFIT GENERATOR</Text>
            <Text style={styles.sectionSubtitle}>
              Describe your occasion and receive curated style suggestions
            </Text>
          </View>
          
          <View style={styles.inputSection}>
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
              style={[
                styles.generateButton,
                isLoadingSuggestion && styles.generateButtonDisabled
              ]}
              onPress={handleGetOutfitSuggestion}
              disabled={isLoadingSuggestion}
            >
              {isLoadingSuggestion ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.generateButtonText}>PROCESSING...</Text>
                </View>
              ) : (
                <Text style={styles.generateButtonText}>GENERATE OUTFIT</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Outfit Suggestion */}
        {showSuggestions && (
          <Animated.View 
            style={[
              styles.suggestionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionTitle}>{outfitSuggestion.title}</Text>
                <View style={styles.occasionBadge}>
                  <Text style={styles.occasionText}>{outfitSuggestion.occasion}</Text>
                </View>
              </View>
              
              {/* Outfit Preview */}
              <View style={styles.outfitPreview}>
                <Text style={styles.previewLabel}>COMPLETE LOOK</Text>
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
              </View>

              {/* Outfit Items */}
              <View style={styles.outfitItems}>
                <Text style={styles.itemsLabel}>PIECES</Text>
                {outfitSuggestion.items.map((item) => (
                  <View key={item.id} style={styles.outfitItem}>
                    <View style={styles.itemImageContainer}>
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemColor}>{item.color}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Hair & Makeup */}
              <View style={styles.hairMakeupSection}>
                <Text style={styles.sectionLabel}>HAIR & MAKEUP</Text>
                <Text style={styles.hairMakeupText}>{outfitSuggestion.hairMakeup}</Text>
              </View>

              {/* Styling Tips */}
              <View style={styles.tipsSection}>
                <Text style={styles.sectionLabel}>STYLING NOTES</Text>
                {outfitSuggestion.tips.map((tip, index) => (
                  <View key={index} style={styles.tipContainer}>
                    <Text style={styles.tipNumber}>{String(index + 1).padStart(2, '0')}</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.suggestionActions}>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>SAVE OUTFIT</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tryAgainButton}
                  onPress={() => setShowSuggestions(false)}
                >
                  <Text style={styles.tryAgainText}>GENERATE NEW</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>QUICK ACCESS</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Wardrobe' as never)}
            >
              <Text style={styles.quickActionTitle}>WARDROBE</Text>
              <Text style={styles.quickActionSubtitle}>Manage your pieces</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Upload' as never)}
            >
              <Text style={styles.quickActionTitle}>ADD ITEM</Text>
              <Text style={styles.quickActionSubtitle}>Upload new pieces</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: 3,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
    letterSpacing: 1,
  },
  quoteSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 12,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    letterSpacing: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  aiSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
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
    paddingVertical: 12,
  },
  generateButton: {
    paddingVertical: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionContainer: {
    padding: 20,
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 20,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
    flex: 1,
  },
  occasionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
  },
  occasionText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
  },
  outfitPreview: {
    marginBottom: 30,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 12,
  },
  outfitPreviewGrid: {
    flexDirection: 'row',
    height: 120,
  },
  previewItem: {
    flex: 1,
    marginHorizontal: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f8f8',
  },
  outfitItems: {
    marginBottom: 30,
  },
  itemsLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 16,
  },
  outfitItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImageContainer: {
    width: 60,
    height: 80,
    backgroundColor: '#f8f8f8',
    marginRight: 16,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '300',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  hairMakeupSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 12,
  },
  hairMakeupText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipNumber: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    marginRight: 12,
    minWidth: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    lineHeight: 20,
    flex: 1,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tryAgainButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  tryAgainText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
  },
  quickActionsSection: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '300',
  },
}); 