import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WardrobeScreen from './src/screens/WardrobeScreen';
import OutfitPreviewScreen from './src/screens/OutfitPreviewScreen';
import OutfitCollageScreen from './src/screens/OutfitCollageScreen';
import HistoricOutfitsScreen from './src/screens/HistoricOutfitsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function OutfitsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="OutfitSuggestions" 
        component={OutfitPreviewScreen} 
        options={{ 
          title: 'Outfit Suggestions',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="OutfitCollage" 
        component={OutfitCollageScreen} 
        options={{ 
          title: 'Create Collage',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistoricOutfits" 
        component={HistoricOutfitsScreen} 
        options={{ 
          title: 'Outfit History',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Wardrobe') {
                iconName = focused ? 'shirt' : 'shirt-outline';
              } else if (route.name === 'Outfits') {
                iconName = focused ? 'sparkles' : 'sparkles-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Stylist AI' }}
          />
          <Tab.Screen 
            name="Wardrobe" 
            component={WardrobeScreen} 
            options={{ title: 'My Closet' }}
          />
          <Tab.Screen 
            name="Outfits" 
            component={OutfitsStack} 
            options={{ title: 'Outfits' }}
          />
          <Tab.Screen 
            name="History" 
            component={HistoryStack} 
            options={{ title: 'History' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
