/**
 * Custom hook for onboarding questionnaire logic
 * Handles state management, progress tracking, and data persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { OnboardingState, OnboardingAnswer, OnboardingQuestion } from '@/types/onboarding';

const STORAGE_KEYS = {
  FIRST_LAUNCH: '@homemate_first_launch',
  ONBOARDING_PROGRESS: '@homemate_onboarding_progress',
  ONBOARDING_COMPLETED: '@homemate_onboarding_completed',
  USER_ANSWERS: '@homemate_user_answers',
};

export const useOnboarding = (questions: OnboardingQuestion[]) => {
  const [state, setState] = useState<OnboardingState>({
    isFirstTime: false,
    showOnboarding: false,
    progress: {
      currentQuestion: 0,
      totalQuestions: questions.length,
      answers: [],
      isCompleted: false,
      startedAt: new Date().toISOString(),
    },
    isLoading: true,
    error: null,
  });

  // Initialize onboarding state
  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      
      const isFirstTime = !hasLaunched;
      const shouldShowOnboarding = isFirstTime && !onboardingCompleted;

      // Load existing progress if available
      let existingProgress = null;
      if (shouldShowOnboarding) {
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
        if (savedProgress) {
          existingProgress = JSON.parse(savedProgress);
        }
      }

      setState(prev => ({
        ...prev,
        isFirstTime,
        showOnboarding: shouldShowOnboarding,
        progress: existingProgress || prev.progress,
        isLoading: false,
      }));

      // Mark as launched if first time
      if (isFirstTime) {
        await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize onboarding',
      }));
    }
  };

  const saveProgress = async (progress: typeof state.progress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify(progress));
      // Also save answers separately for profile access
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(progress.answers));
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  const triggerHapticFeedback = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const answerQuestion = useCallback((questionId: number, answer: string | string[] | number) => {
    triggerHapticFeedback();
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const newAnswer: OnboardingAnswer = {
      questionId,
      answer,
      category: question.category,
    };

    setState(prev => {
      const updatedAnswers = prev.progress.answers.filter(a => a.questionId !== questionId);
      updatedAnswers.push(newAnswer);
      
      const newProgress = {
        ...prev.progress,
        answers: updatedAnswers,
      };

      saveProgress(newProgress);
      
      return {
        ...prev,
        progress: newProgress,
      };
    });
  }, [questions, triggerHapticFeedback]);

  const nextQuestion = useCallback(() => {
    triggerHapticFeedback();
    
    setState(prev => {
      if (prev.progress.currentQuestion < prev.progress.totalQuestions - 1) {
        const newProgress = {
          ...prev.progress,
          currentQuestion: prev.progress.currentQuestion + 1,
        };
        saveProgress(newProgress);
        return {
          ...prev,
          progress: newProgress,
        };
      }
      return prev;
    });
  }, [triggerHapticFeedback]);

  const previousQuestion = useCallback(() => {
    triggerHapticFeedback();
    
    setState(prev => {
      if (prev.progress.currentQuestion > 0) {
        const newProgress = {
          ...prev.progress,
          currentQuestion: prev.progress.currentQuestion - 1,
        };
        saveProgress(newProgress);
        return {
          ...prev,
          progress: newProgress,
        };
      }
      return prev;
    });
  }, [triggerHapticFeedback]);

  const completeOnboarding = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call to save user preferences
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const completedProgress = {
        ...state.progress,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };

      // Save completion status
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(completedProgress.answers));
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      
      setState(prev => ({
        ...prev,
        progress: completedProgress,
        showOnboarding: false,
        isLoading: false,
      }));

      triggerHapticFeedback();
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to save your preferences. Please try again.',
      }));
      
      Alert.alert(
        'Error',
        'Failed to save your preferences. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [state.progress, triggerHapticFeedback]);

  const skipOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      
      setState(prev => ({
        ...prev,
        showOnboarding: false,
      }));
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  }, []);

  const restartOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      
      setState(prev => ({
        ...prev,
        showOnboarding: true,
        progress: {
          currentQuestion: 0,
          totalQuestions: questions.length,
          answers: [],
          isCompleted: false,
          startedAt: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error('Error restarting onboarding:', error);
    }
  }, [questions.length]);
  const getCurrentAnswer = useCallback((questionId: number) => {
    return state.progress.answers.find(a => a.questionId === questionId)?.answer;
  }, [state.progress.answers]);

  const isQuestionAnswered = useCallback((questionId: number) => {
    const answer = getCurrentAnswer(questionId);
    if (answer === undefined || answer === null) return false;
    if (typeof answer === 'string') return answer.trim().length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }, [getCurrentAnswer]);

  const getProgress = useCallback(() => {
    return {
      current: state.progress.currentQuestion + 1,
      total: state.progress.totalQuestions,
      percentage: ((state.progress.currentQuestion + 1) / state.progress.totalQuestions) * 100,
    };
  }, [state.progress]);

  const getUserAnswers = useCallback(async () => {
    try {
      const savedAnswers = await AsyncStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      return savedAnswers ? JSON.parse(savedAnswers) : [];
    } catch (error) {
      console.error('Error getting user answers:', error);
      return [];
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
    
    // Helpers
    getCurrentAnswer,
    isQuestionAnswered,
    getProgress,
    triggerHapticFeedback,
    getUserAnswers,
  };
};