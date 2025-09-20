/**
 * Custom hook for detecting first-time users and managing onboarding state
 * Handles AsyncStorage operations and provides clean interface for onboarding logic
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FIRST_LAUNCH: '@homemate_first_launch',
  ONBOARDING_COMPLETED: '@homemate_onboarding_completed',
  ONBOARDING_SKIPPED: '@homemate_onboarding_skipped',
} as const;

interface UseFirstTimeUserReturn {
  isFirstTime: boolean;
  shouldShowOnboarding: boolean;
  isLoading: boolean;
  markAsLaunched: () => Promise<void>;
  markOnboardingCompleted: () => Promise<void>;
  markOnboardingSkipped: () => Promise<void>;
  resetFirstTimeStatus: () => Promise<void>;
}

export const useFirstTimeUser = (): UseFirstTimeUserReturn => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkFirstTimeStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [hasLaunched, onboardingCompleted, onboardingSkipped] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SKIPPED),
      ]);

      const isFirstTime = !hasLaunched;
      const shouldShowOnboarding = isFirstTime && !onboardingCompleted && !onboardingSkipped;

      setIsFirstTime(isFirstTime);
      setShouldShowOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error checking first time status:', error);
      // Default to safe values on error
      setIsFirstTime(false);
      setShouldShowOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsLaunched = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error marking as launched:', error);
    }
  }, []);

  const markOnboardingCompleted = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error marking onboarding completed:', error);
    }
  }, []);

  const markOnboardingSkipped = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true');
      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error marking onboarding skipped:', error);
    }
  }, []);

  const resetFirstTimeStatus = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.FIRST_LAUNCH),
        AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_SKIPPED),
      ]);
      
      // Re-check status after reset
      await checkFirstTimeStatus();
    } catch (error) {
      console.error('Error resetting first time status:', error);
    }
  }, [checkFirstTimeStatus]);

  useEffect(() => {
    checkFirstTimeStatus();
  }, [checkFirstTimeStatus]);

  return {
    isFirstTime,
    shouldShowOnboarding,
    isLoading,
    markAsLaunched,
    markOnboardingCompleted,
    markOnboardingSkipped,
    resetFirstTimeStatus,
  };
};