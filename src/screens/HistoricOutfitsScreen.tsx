import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Icon,
  Button,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

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
        { id: '1', name: 'Floral Maxi Dress', category: 'Dress', imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop' },
        { id: '2', name: 'Nude Heels', category: 'Shoes', imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '3', name: 'Gold Hoop Earrings', category: 'Accessories', imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
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
        { id: '4', name: 'Navy Blazer', category: 'Outerwear', imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
        { id: '5', name: 'White Blouse', category: 'Top', imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop' },
        { id: '6', name: 'Black Pencil Skirt', category: 'Bottom', imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
        { id: '7', name: 'Black Pumps', category: 'Shoes', imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
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
        { id: '8', name: 'Black Dress', category: 'Dress', imageUri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop' },
        { id: '9', name: 'Red Heels', category: 'Shoes', imageUri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '10', name: 'Silver Necklace', category: 'Accessories', imageUri: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
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
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color={i < rating ? '#f59e0b' : '#ccc'}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOccasionColor = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'wedding': return '#e91e63';
      case 'business': return '#2196f3';
      case 'casual': return '#4caf50';
      case 'formal': return '#9c27b0';
      default: return '#6366f1';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text h4 style={styles.headerTitle}>My Outfit History</Text>
        <Text style={styles.headerSubtitle}>
          Your saved and worn outfits
        </Text>
      </View>

      {historicOutfits.length === 0 ? (
        <Card containerStyle={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <Ionicons name="shirt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Outfits Yet</Text>
            <Text style={styles.emptyText}>
              Your saved outfits will appear here. Create your first outfit suggestion to get started!
            </Text>
            <Button
              title="Create Outfit"
              onPress={() => Alert.alert('Navigate', 'Navigate to Home to create outfit')}
              containerStyle={styles.emptyButton}
            />
          </View>
        </Card>
      ) : (
        historicOutfits.map((outfit) => (
          <Card key={outfit.id} containerStyle={styles.outfitCard}>
            <View style={styles.outfitHeader}>
              <View style={styles.outfitTitleContainer}>
                <Text style={styles.outfitTitle}>{outfit.name}</Text>
                <View style={styles.outfitMeta}>
                  <Chip
                    title={outfit.occasion}
                    type="outline"
                    size="sm"
                    containerStyle={[styles.occasionChip, { borderColor: getOccasionColor(outfit.occasion) }]}
                    titleStyle={{ color: getOccasionColor(outfit.occasion) }}
                  />
                  <Text style={styles.outfitDate}>{formatDate(outfit.date)}</Text>
                </View>
              </View>
              <View style={styles.outfitActions}>
                <TouchableOpacity
                  onPress={() => toggleFavorite(outfit.id)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name={outfit.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={outfit.isFavorite ? '#e91e63' : '#ccc'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteOutfit(outfit.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.outfitItems}>
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
                      <View style={styles.itemPlaceholder}>
                        <Ionicons name="shirt-outline" size={24} color="#ccc" />
                      </View>
                    )}
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  </View>
                </View>
              ))}
            </View>

            {outfit.notes && (
              <View style={styles.notesContainer}>
                <Ionicons name="chatbubble-outline" size={16} color="#6366f1" />
                <Text style={styles.notesText}>{outfit.notes}</Text>
              </View>
            )}

            <View style={styles.outfitFooter}>
              <View style={styles.ratingContainer}>
                {renderStars(outfit.rating)}
                <Text style={styles.ratingText}>{outfit.rating}/5</Text>
              </View>
              <Button
                title="Wear Again"
                type="outline"
                size="sm"
                onPress={() => Alert.alert('Wear Again', 'Outfit added to today\'s suggestions!')}
              />
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  emptyCard: {
    margin: 16,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
  },
  outfitCard: {
    margin: 16,
    borderRadius: 12,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  outfitTitleContainer: {
    flex: 1,
  },
  outfitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  outfitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occasionChip: {
    marginRight: 12,
  },
  outfitDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  outfitActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  outfitItem: {
    width: '48%',
    marginBottom: 12,
    marginRight: '2%',
  },
  itemImageContainer: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    paddingHorizontal: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 10,
    opacity: 0.6,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    opacity: 0.8,
  },
  outfitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HistoricOutfitsScreen; 