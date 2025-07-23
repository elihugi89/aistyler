import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Input,
  Divider,
} from '@rneui/themed';
// import { useTheme } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  // const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGetOutfitSuggestion = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter your outfit request');
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
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
    <ScrollView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={32} color="#6366f1" />
        <Text h3 style={[styles.title, { color: '#6366f1' }]}>
          Your Personal Stylist
        </Text>
        <Text style={styles.subtitle}>
          Describe what you need and get AI-powered outfit suggestions
        </Text>
      </View>

      <Card containerStyle={styles.card}>
        <Card.Title>What outfit do you need?</Card.Title>
        <Input
          placeholder="e.g., 'I need an elegant outfit for an evening wedding' or 'Business meeting outfit that's professional'"
          value={searchQuery}
          onChangeText={setSearchQuery}
          multiline
          numberOfLines={4}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />
        <Button
          title={isLoading ? "Creating your outfit..." : "Get Outfit Suggestion"}
          onPress={handleGetOutfitSuggestion}
          disabled={isLoading}
          loading={isLoading}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </Card>

      {/* Outfit Suggestion */}
      {showSuggestions && (
        <Card containerStyle={styles.suggestionCard}>
          <Card.Title>{outfitSuggestion.title}</Card.Title>
          
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
            <Text style={styles.sectionTitle}>Hair & Makeup:</Text>
            <Text style={styles.hairMakeupText}>{outfitSuggestion.hairMakeup}</Text>
          </View>

          {/* Styling Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Styling Tips:</Text>
            {outfitSuggestion.tips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.suggestionActions}>
            <Button
              title="Save Outfit"
              type="outline"
              size="sm"
              onPress={() => Alert.alert('Saved', 'Outfit saved to your favorites!')}
            />
            <Button
              title="Try Again"
              type="clear"
              size="sm"
              onPress={() => setShowSuggestions(false)}
            />
          </View>
        </Card>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 20,
  },
  recentSuggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recentText: {
    opacity: 0.7,
  },
  suggestionCard: {
    margin: 16,
    borderRadius: 12,
  },
  outfitPreview: {
    alignItems: 'center',
    marginVertical: 12,
  },
  outfitPreviewGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: -6,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  previewText: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  outfitItem: {
    width: '48%',
    marginBottom: 12,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
  },
  itemInfo: {
    paddingHorizontal: 2,
  },
  itemName: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemColor: {
    fontSize: 8,
    opacity: 0.7,
  },
  hairMakeupSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  hairMakeupText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  tipsSection: {
    marginTop: 12,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    opacity: 0.8,
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default HomeScreen; 