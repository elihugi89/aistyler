import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

interface UseAnimationResult {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  slideAnim: Animated.Value;
  fadeIn: (duration?: number) => void;
  fadeOut: (duration?: number) => void;
  scaleIn: (duration?: number) => void;
  scaleOut: (duration?: number) => void;
  slideIn: (duration?: number) => void;
  slideOut: (duration?: number) => void;
}

export const useAnimation = (): UseAnimationResult => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const fadeIn = useCallback((duration = 300) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback((duration = 300) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const scaleIn = useCallback((duration = 300) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const scaleOut = useCallback((duration = 300) => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const slideIn = useCallback((duration = 300) => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const slideOut = useCallback((duration = 300) => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return {
    fadeAnim,
    scaleAnim,
    slideAnim,
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    slideIn,
    slideOut,
  };
}; 