import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface UseAppStateResult {
  appState: AppStateStatus;
  isActive: boolean;
  isBackground: boolean;
  lastActiveAt: Date | null;
}

export const useAppState = (): UseAppStateResult => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [lastActiveAt, setLastActiveAt] = useState<Date | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState !== nextAppState) {
      if (nextAppState === 'active') {
        setLastActiveAt(new Date());
      }
      setAppState(nextAppState);
    }
  };

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    lastActiveAt,
  };
}; 