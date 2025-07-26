import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Icon,
  Button,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface HistoricOutfit {
  id: string;
  name: string;
  occasion: string;
  date: string;
  items: {
    id: string;
    name: string;
    category: string;
    imageUri?: string;
  }[];
  rating: number;
  notes?: string;
  isFavorite: boolean;
}

const HistoricOutfitsScreen = () => {
  const [historicOutfits, setHistoricOutfits] = useState<HistoricOutfit[]>([
    {
      id: '1',
      name: 'Summer Wedding Guest',
      occasion: 'Wedding',
      date: '2024-07-15',
      items: [
        { id: '1', name: 'Silk Wrap Dress', category: 'Dress', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c219d395e971b5c909cb0_Frame%202.jpg' },
        { id: '2', name: 'Strappy Heels', category: 'Shoes', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215a3b7410473cbc2345_Frame%201%202.jpg' },
        { id: '3', name: 'Pearl Earrings', category: 'Accessories', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/66070420b7638d7c6b4aeaaf_4.jpg' },
      ],
      rating: 5,
      notes: 'Perfect for outdoor summer wedding. Got many compliments!',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Business Interview',
      occasion: 'Business',
      date: '2024-07-10',
      items: [
        { id: '4', name: 'Tailored Blazer', category: 'Outerwear', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215e8b46e32ae547ad09_Frame%203%202.jpg' },
        { id: '5', name: 'Silk Wrap Dress', category: 'Dress', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c219d395e971b5c909cb0_Frame%202.jpg' },
        { id: '6', name: 'Strappy Heels', category: 'Shoes', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215a3b7410473cbc2345_Frame%201%202.jpg' },
        { id: '7', name: 'Pearl Earrings', category: 'Accessories', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/66070420b7638d7c6b4aeaaf_4.jpg' },
      ],
      rating: 4,
      notes: 'Professional and confident look. Got the job!',
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Date Night',
      occasion: 'Casual',
      date: '2024-07-08',
      items: [
        { id: '8', name: 'Silk Wrap Dress', category: 'Dress', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c219d395e971b5c909cb0_Frame%202.jpg' },
        { id: '9', name: 'Strappy Heels', category: 'Shoes', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/660c215a3b7410473cbc2345_Frame%201%202.jpg' },
        { id: '10', name: 'Pearl Earrings', category: 'Accessories', imageUri: 'https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/66070420b7638d7c6b4aeaaf_4.jpg' },
      ],
      rating: 5,
      notes: 'Classic and elegant. Great for dinner and drinks.',
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (outfitId: string) => {
    setHistoricOutfits(prev => prev.map(outfit => 
      outfit.id === outfitId 
        ? { ...outfit, isFavorite: !outfit.isFavorite }
        : outfit
    ));
  };

  const deleteOutfit = (outfitId: string) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistoricOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={12}
            color={star <= rating ? '#000000' : '#e0e0e0'}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getOccasionColor = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'wedding':
        return '#000000';
      case 'business':
        return '#666666';
      case 'casual':
        return '#999999';
      default:
        return '#666666';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OUTFIT HISTORY</Text>
        <Text style={styles.headerSubtitle}>
          {historicOutfits.length} saved outfits
        </Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {historicOutfits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>NO SAVED OUTFITS</Text>
            <Text style={styles.emptySubtitle}>
              Your saved outfit suggestions will appear here
            </Text>
          </View>
        ) : (
          historicOutfits.map((outfit) => (
            <View key={outfit.id} style={styles.outfitCard}>
              {/* Outfit Header */}
              <View style={styles.outfitHeader}>
                <View style={styles.outfitInfo}>
                  <Text style={styles.outfitName}>{outfit.name}</Text>
                  <View style={styles.outfitMeta}>
                    <View style={[styles.occasionBadge, { backgroundColor: getOccasionColor(outfit.occasion) }]}>
                      <Text style={styles.occasionText}>{outfit.occasion.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.outfitDate}>{formatDate(outfit.date)}</Text>
                  </View>
                </View>
                <View style={styles.outfitActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleFavorite(outfit.id)}
                  >
                    <Ionicons
                      name={outfit.isFavorite ? 'heart' : 'heart-outline'}
                      size={16}
                      color={outfit.isFavorite ? '#000000' : '#666666'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteOutfit(outfit.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#666666" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Outfit Items */}
              <View style={styles.outfitItems}>
                <Text style={styles.itemsLabel}>PIECES</Text>
                <View style={styles.itemsGrid}>
                  {outfit.items.map((item) => (
                    <View key={item.id} style={styles.itemContainer}>
                      <View style={styles.itemImageContainer}>
                        <Image
                          source={{ uri: item.imageUri }}
                          style={styles.itemImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCategory}>{item.category}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Rating */}
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>RATING</Text>
                {renderStars(outfit.rating)}
              </View>

              {/* Notes */}
              {outfit.notes && (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>NOTES</Text>
                  <Text style={styles.notesText}>{outfit.notes}</Text>
                </View>
              )}
            </View>
          ))
        )}
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
  scrollContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
    textAlign: 'center',
  },
  outfitCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 8,
  },
  outfitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  occasionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  occasionText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  outfitDate: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '300',
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitItems: {
    marginBottom: 20,
  },
  itemsLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 12,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemContainer: {
    width: (width - 80) / 3,
    alignItems: 'center',
  },
  itemImageContainer: {
    width: '100%',
    height: (width - 80) / 3 * 1.2,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    alignItems: 'center',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '300',
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    marginRight: 2,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    lineHeight: 20,
  },
});

export default HistoricOutfitsScreen; 