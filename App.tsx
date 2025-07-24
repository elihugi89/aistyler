import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/contexts/AppContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { theme } from './src/theme';

// Import screens
import { HomeScreen } from './src/screens/HomeScreen';
import { WardrobeScreen } from './src/screens/WardrobeScreen';
import { UploadScreen } from './src/screens/UploadScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import OutfitCollageScreen from './src/screens/OutfitCollageScreen';
import HistoricOutfitsScreen from './src/screens/HistoricOutfitsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <PreferencesProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                      case 'Home':
                        iconName = focused ? 'home' : 'home-outline';
                        break;
                      case 'Wardrobe':
                        iconName = focused ? 'shirt' : 'shirt-outline';
                        break;
                      case 'Collage':
                        iconName = focused ? 'grid' : 'grid-outline';
                        break;
                      case 'History':
                        iconName = focused ? 'time' : 'time-outline';
                        break;
                      case 'Profile':
                        iconName = focused ? 'person' : 'person-outline';
                        break;
                      default:
                        iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: theme.colors.primary,
                  tabBarInactiveTintColor: theme.colors.grey[500],
                  tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.grey[200],
                  },
                })}
              >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
                <Tab.Screen name="Collage" component={OutfitCollageScreen} />
                <Tab.Screen name="History" component={HistoricOutfitsScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </PreferencesProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
} 