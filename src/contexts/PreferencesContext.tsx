import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StylePreferences {
  favoriteColors: string[];
  preferredStyles: string[];
  seasonalPreferences: {
    spring: string[];
    summer: string[];
    fall: string[];
    winter: string[];
  };
}

interface PreferencesContextState {
  preferences: StylePreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<StylePreferences>) => Promise<void>;
  addFavoriteColor: (color: string) => Promise<void>;
  removeFavoriteColor: (color: string) => Promise<void>;
  addPreferredStyle: (style: string) => Promise<void>;
  removePreferredStyle: (style: string) => Promise<void>;
}

const defaultPreferences: StylePreferences = {
  favoriteColors: [],
  preferredStyles: [],
  seasonalPreferences: {
    spring: [],
    summer: [],
    fall: [],
    winter: [],
  },
};

const PreferencesContext = createContext<PreferencesContextState | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<StylePreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from storage on app start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferencesData = await AsyncStorage.getItem('preferences');
        if (preferencesData) {
          setPreferences(JSON.parse(preferencesData));
        }
      } catch (error) {
        console.error('Error loading preferences from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = async (newPreferences: StylePreferences) => {
    await AsyncStorage.setItem('preferences', JSON.stringify(newPreferences));
  };

  const updatePreferences = useCallback(async (newPreferences: Partial<StylePreferences>) => {
    try {
      setIsLoading(true);
      const updatedPreferences = { ...preferences, ...newPreferences };
      await savePreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      throw new Error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  const addFavoriteColor = useCallback(async (color: string) => {
    try {
      setIsLoading(true);
      const updatedColors = [...preferences.favoriteColors, color];
      const updatedPreferences = { ...preferences, favoriteColors: updatedColors };
      await savePreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      throw new Error('Failed to add favorite color');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  const removeFavoriteColor = useCallback(async (color: string) => {
    try {
      setIsLoading(true);
      const updatedColors = preferences.favoriteColors.filter(c => c !== color);
      const updatedPreferences = { ...preferences, favoriteColors: updatedColors };
      await savePreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      throw new Error('Failed to remove favorite color');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  const addPreferredStyle = useCallback(async (style: string) => {
    try {
      setIsLoading(true);
      const updatedStyles = [...preferences.preferredStyles, style];
      const updatedPreferences = { ...preferences, preferredStyles: updatedStyles };
      await savePreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      throw new Error('Failed to add preferred style');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  const removePreferredStyle = useCallback(async (style: string) => {
    try {
      setIsLoading(true);
      const updatedStyles = preferences.preferredStyles.filter(s => s !== style);
      const updatedPreferences = { ...preferences, preferredStyles: updatedStyles };
      await savePreferences(updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      throw new Error('Failed to remove preferred style');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  const value = {
    preferences,
    isLoading,
    updatePreferences,
    addFavoriteColor,
    removeFavoriteColor,
    addPreferredStyle,
    removePreferredStyle,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}; 