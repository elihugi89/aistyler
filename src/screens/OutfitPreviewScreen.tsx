import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, Divider } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import type { Outfit } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'OutfitPreview'>;

// Sample outfit data (replace with actual data from API/storage)
const SAMPLE_OUTFIT: Outfit = {
  id: 'sample-outfit',
  items: [
    {
      id: '1',
      type: 'top',
      imageUri: 'https://via.placeholder.com/150',
      category: 'Blazer',
      season: 'all',
      color: 'navy',
      tags: ['formal', 'business'],
    },
    {
      id: '2',
      type: 'bottom',
      imageUri: 'https://via.placeholder.com/150',
      category: 'Dress Pants',
      season: 'all',
      color: 'gray',
      tags: ['formal', 'business'],
    },
    {
      id: '3',
      type: 'shoes',
      imageUri: 'https://via.placeholder.com/150',
      category: 'Oxford Shoes',
      season: 'all',
      color: 'black',
      tags: ['formal', 'leather'],
    },
  ],
  occasion: 'Business Meeting',
  season: 'fall',
  createdAt: new Date(),
};

const OutfitPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const outfit = SAMPLE_OUTFIT; // Replace with actual data fetching

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text h3 style={styles.title}>Your Perfect Outfit</Text>
        <Text style={styles.subtitle}>For: {outfit.occasion}</Text>

        <View style={styles.outfitContainer}>
          {outfit.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Card containerStyle={styles.itemCard}>
                <Card.Title>{item.category}</Card.Title>
                <Card.Image
                  source={{ uri: item.imageUri }}
                  style={styles.itemImage}
                />
                <Text style={styles.itemDetails}>
                  Color: {item.color}
                </Text>
                <View style={styles.tagsContainer}>
                  {item.tags.map(tag => (
                    <Text key={tag} style={styles.tag}>#{tag}</Text>
                  ))}
                </View>
              </Card>
              {index < outfit.items.length - 1 && (
                <View style={styles.plusContainer}>
                  <Text style={styles.plus}>+</Text>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.aiExplanation}>
          This outfit was chosen because it perfectly matches the occasion while considering the current season ({outfit.season}). The color combination creates a professional and cohesive look.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Try Another Outfit"
            type="outline"
            containerStyle={styles.button}
            onPress={() => navigation.goBack()}
          />
          <Button
            title="Save Outfit"
            containerStyle={styles.button}
            onPress={() => {
              // TODO: Implement save functionality
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  outfitContainer: {
    marginBottom: 20,
  },
  itemCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  itemImage: {
    height: 200,
    width: '100%',
    borderRadius: 5,
  },
  itemDetails: {
    marginTop: 10,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    color: '#666',
    marginRight: 10,
    fontSize: 14,
  },
  plusContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  plus: {
    fontSize: 24,
    color: '#666',
  },
  divider: {
    marginVertical: 20,
  },
  aiExplanation: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default OutfitPreviewScreen; 