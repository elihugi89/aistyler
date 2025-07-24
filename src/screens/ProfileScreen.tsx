import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { theme } from '../theme';
import { LoadingScreen } from '../components/LoadingScreen';

export const ProfileScreen = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { preferences, isLoading: isPreferencesLoading } = usePreferences();

  if (isAuthLoading || isPreferencesLoading) {
    return <LoadingScreen />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={theme.colors.onPrimary} />
          </View>
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || 'Not signed in'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Style Preferences</Text>
        
        <View style={styles.preferenceGroup}>
          <Text style={styles.preferenceTitle}>Favorite Colors</Text>
          <View style={styles.tags}>
            {preferences.favoriteColors.map(color => (
              <View key={color} style={styles.tag}>
                <Text style={styles.tagText}>{color}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.preferenceGroup}>
          <Text style={styles.preferenceTitle}>Preferred Styles</Text>
          <View style={styles.tags}>
            {preferences.preferredStyles.map(style => (
              <View key={style} style={styles.tag}>
                <Text style={styles.tagText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.preferenceGroup}>
          <Text style={styles.preferenceTitle}>Seasonal Preferences</Text>
          {Object.entries(preferences.seasonalPreferences).map(([season, styles]) => (
            <View key={season} style={styles.seasonGroup}>
              <Text style={styles.seasonTitle}>{season}</Text>
              <View style={styles.tags}>
                {styles.map(style => (
                  <View key={style} style={styles.tag}>
                    <Text style={styles.tagText}>{style}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.h5,
    color: theme.colors.onPrimary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.subtitle1,
    color: theme.colors.onPrimary,
    opacity: 0.8,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h6,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.lg,
  },
  preferenceGroup: {
    marginBottom: theme.spacing.xl,
  },
  preferenceTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.onBackground,
  },
  seasonGroup: {
    marginBottom: theme.spacing.lg,
  },
  seasonTitle: {
    ...theme.typography.subtitle2,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.sm,
    textTransform: 'capitalize',
  },
  logoutButton: {
    margin: theme.spacing.lg,
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...theme.typography.button,
    color: theme.colors.onError,
  },
}); 