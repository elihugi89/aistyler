import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
  Chip,
  Divider,
  Icon,
} from '@rneui/themed';
// import { useTheme } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface OutfitItem {
  id: string;
  name: string;
  category: string;
  color: string;
  description: string;
  imageUri?: string;
}

interface OutfitSuggestion {
  id: string;
  title: string;
  occasion: string;
  items: OutfitItem[];
  hairMakeup: string;
  tips: string[];
  rating: number;
  date: string;
}

const OutfitPreviewScreen = () => {
  // const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  const outfitSuggestions: OutfitSuggestion[] = [
    {
      id: '1',
      title: 'Evening Wedding Elegance',
      occasion: 'Wedding',
      items: [
        { 
          id: '1', 
          name: 'Navy Silk Wrap Dress', 
          category: 'Dress', 
          color: 'Navy', 
          description: 'Elegant silk wrap dress',
          imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
        },
        { 
          id: '2', 
          name: 'Silver Strappy Heels', 
          category: 'Shoes', 
          color: 'Silver', 
          description: 'Classic strappy heels',
          imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
        },
        { 
          id: '3', 
          name: 'Pearl Drop Earrings', 
          category: 'Accessories', 
          color: 'White', 
          description: 'Timeless pearl earrings',
          imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop'
        },
        { 
          id: '4', 
          name: 'Silver Clutch', 
          category: 'Accessories', 
          color: 'Silver', 
          description: 'Compact evening clutch',
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
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Business Professional',
      occasion: 'Business Meeting',
      items: [
        { 
          id: '5', 
          name: 'White Blouse', 
          category: 'Top', 
          color: 'White', 
          description: 'Crisp professional blouse',
          imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
        },
        { 
          id: '6', 
          name: 'Black Pencil Skirt', 
          category: 'Bottom', 
          color: 'Black', 
          description: 'Classic pencil skirt',
          imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
        },
        { 
          id: '7', 
          name: 'Black Pumps', 
          category: 'Shoes', 
          color: 'Black', 
          description: 'Professional closed-toe pumps',
          imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
        },
        { 
          id: '8', 
          name: 'Pearl Necklace', 
          category: 'Accessories', 
          color: 'White', 
          description: 'Subtle pearl necklace',
          imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop'
        },
      ],
      hairMakeup: 'Neat bun or sleek ponytail - minimal makeup with red lip',
      tips: [
        'Classic black and white creates a professional appearance',
        'Closed-toe shoes are appropriate for business settings',
        'Minimal accessories keep the focus on professionalism'
      ],
      rating: 4,
      date: '2024-01-14',
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Top': return 'shirt-outline';
      case 'Bottom': return 'shirt-outline';
      case 'Dress': return 'female-outline';
      case 'Shoes': return 'footsteps-outline';
      case 'Accessories': return 'diamond-outline';
      case 'Outerwear': return 'shirt-outline';
      default: return 'shirt-outline';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color={i < rating ? '#f59e0b' : '#ccc'}
      />
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <View style={styles.header}>
        <Text h4 style={styles.headerTitle}>Your Outfit Suggestions</Text>
        <Text style={styles.headerSubtitle}>
          AI-generated looks based on your closet
        </Text>
      </View>

      {outfitSuggestions.map((outfit) => (
        <Card key={outfit.id} containerStyle={styles.outfitCard}>
          <View style={styles.outfitHeader}>
            <View style={styles.outfitTitleContainer}>
              <Text style={[styles.outfitTitle, { fontSize: 18, fontWeight: 'bold' }]}>{outfit.title}</Text>
              <Chip
                title={outfit.occasion}
                type="outline"
                size="sm"
                containerStyle={styles.occasionChip}
              />
            </View>
            <View style={styles.ratingContainer}>
              {renderStars(outfit.rating)}
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Outfit Preview:</Text>
          <View style={styles.outfitPreview}>
            <View style={styles.outfitPreviewGrid}>
              {outfit.items.slice(0, 4).map((item, index) => (
                <View key={item.id} style={[styles.previewItem, { zIndex: 4 - index }]}>
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.previewPlaceholder}>
                      <Icon
                        name={getCategoryIcon(item.category)}
                        type="ionicon"
                        size={20}
                        color="#6366f1"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.previewText}>Complete Outfit Look</Text>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Outfit Items:</Text>
          <View style={styles.outfitGrid}>
            {outfit.items.map((item) => (
              <View key={item.id} style={styles.outfitItem}>
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
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemColor}>{item.color}</Text>
                </View>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Hair & Makeup:</Text>
          <Text style={styles.hairMakeupText}>{outfit.hairMakeup}</Text>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Styling Tips:</Text>
          {outfit.tips.map((tip, index) => (
            <View key={index} style={styles.tipContainer}>
              <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

          <View style={styles.outfitActions}>
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
              onPress={() => Alert.alert('Regenerate', 'Generating new outfit suggestion...')}
            />
          </View>
        </Card>
      ))}

      <Card containerStyle={styles.createCard}>
        <View style={styles.createContent}>
          <Ionicons name="sparkles" size={48} color="#6366f1" />
          <Text style={[styles.createTitle, { fontSize: 18, fontWeight: 'bold' }]}>Create New Outfit</Text>
          <Text style={styles.createText}>
            Get a fresh AI-generated outfit suggestion for any occasion
          </Text>
          <Button
            title="Generate Outfit"
            onPress={() => Alert.alert('Navigate', 'Navigate to Home screen to create new outfit')}
            containerStyle={styles.createButton}
          />
        </View>
      </Card>

      <Card containerStyle={styles.createCard}>
        <View style={styles.createContent}>
          <Ionicons name="grid" size={48} color="#6366f1" />
          <Text style={[styles.createTitle, { fontSize: 18, fontWeight: 'bold' }]}>Create Outfit Collage</Text>
          <Text style={styles.createText}>
            Combine multiple clothing items into a stunning outfit collage
          </Text>
          <Button
            title="Start Collage"
            onPress={() => navigation.navigate('OutfitCollage' as never)}
            containerStyle={styles.createButton}
          />
        </View>
      </Card>
    </ScrollView>
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
  outfitCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  outfitTitleContainer: {
    flex: 1,
  },
  outfitTitle: {
    marginBottom: 8,
  },
  occasionChip: {
    alignSelf: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: -8,
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
    borderRadius: 28,
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  outfitItem: {
    width: '48%',
    marginBottom: 16,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
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
    top: 8,
    right: 8,
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
    paddingHorizontal: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemColor: {
    fontSize: 10,
    opacity: 0.7,
  },
  hairMakeupText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    opacity: 0.8,
  },
  outfitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  createCard: {
    margin: 16,
    borderRadius: 12,
  },
  createContent: {
    alignItems: 'center',
    padding: 20,
  },
  createTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  createText: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  createButton: {
    width: '100%',
  },
});

export default OutfitPreviewScreen; 