/**
 * Profile data manager for handling questionnaire responses
 * Manages the integration between onboarding answers and user profile data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingAnswer } from '@/types/onboarding';

const STORAGE_KEYS = {
  USER_ANSWERS: '@homemate_user_answers',
  PROFILE_DATA: '@homemate_profile_data',
  LIFESTYLE_PREFERENCES: '@homemate_lifestyle_preferences',
} as const;

export interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: number;
    profession: string;
    location: string;
  };
  lifestyle: {
    cleanliness: string;
    socialLevel: string;
    bedtime: string;
    noiseLevel: string;
    guestPolicy: string;
    conflictResolution: string;
    financialHabits: string;
    longTermGoals: string[];
  };
  preferences: {
    idealHousemate: string;
    aboutMe: string;
    interests: string[];
  };
  questionnaire: OnboardingAnswer[];
  lastUpdated: string;
}

export class ProfileDataManager {
  /**
   * Convert onboarding answers to structured profile data
   */
  static async convertAnswersToProfile(answers: OnboardingAnswer[]): Promise<Partial<ProfileData>> {
    const lifestyle: Partial<ProfileData['lifestyle']> = {};
    const preferences: Partial<ProfileData['preferences']> = {};

    // Map answers to lifestyle preferences
    answers.forEach(answer => {
      switch (answer.questionId) {
        case 1: // Cleaning routine
          lifestyle.cleanliness = answer.answer as string;
          break;
        case 3: // Social interaction level
          lifestyle.socialLevel = answer.answer as string;
          break;
        case 5: // Sleep schedule
          lifestyle.bedtime = answer.answer as string;
          break;
        case 6: // Noise levels
          lifestyle.noiseLevel = answer.answer as string;
          break;
        case 7: // Guest policy
          lifestyle.guestPolicy = answer.answer as string;
          break;
        case 8: // Conflict resolution
          lifestyle.conflictResolution = answer.answer as string;
          break;
        case 9: // Financial habits importance
          const importance = ['Not important', 'Somewhat important', 'Important', 'Very important', 'Absolutely critical'];
          lifestyle.financialHabits = importance[(answer.answer as number) - 1] || 'Important';
          break;
        case 11: // Long-term goals
          lifestyle.longTermGoals = answer.answer as string[];
          break;
        case 12: // Ideal housemate description
          preferences.idealHousemate = answer.answer as string;
          break;
        case 13: // About me
          preferences.aboutMe = answer.answer as string;
          break;
      }
    });

    return {
      lifestyle: lifestyle as ProfileData['lifestyle'],
      preferences: preferences as ProfileData['preferences'],
      questionnaire: answers,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save questionnaire answers to storage
   */
  static async saveAnswers(answers: OnboardingAnswer[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(answers));
      
      // Convert and save as structured profile data
      const profileData = await this.convertAnswersToProfile(answers);
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(profileData));
      
      return true;
    } catch (error) {
      console.error('Error saving questionnaire answers:', error);
      return false;
    }
  }

  /**
   * Load questionnaire answers from storage
   */
  static async loadAnswers(): Promise<OnboardingAnswer[]> {
    try {
      const savedAnswers = await AsyncStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      return savedAnswers ? JSON.parse(savedAnswers) : [];
    } catch (error) {
      console.error('Error loading questionnaire answers:', error);
      return [];
    }
  }

  /**
   * Load structured profile data
   */
  static async loadProfileData(): Promise<Partial<ProfileData> | null> {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error loading profile data:', error);
      return null;
    }
  }

  /**
   * Update specific profile section
   */
  static async updateProfileSection(
    section: keyof ProfileData,
    data: any
  ): Promise<boolean> {
    try {
      const existingData = await this.loadProfileData() || {};
      const updatedData = {
        ...existingData,
        [section]: data,
        lastUpdated: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error updating profile section:', error);
      return false;
    }
  }

  /**
   * Check if user has completed questionnaire
   */
  static async hasCompletedQuestionnaire(): Promise<boolean> {
    try {
      const answers = await this.loadAnswers();
      return answers.length >= 10; // Minimum required answers
    } catch (error) {
      console.error('Error checking questionnaire completion:', error);
      return false;
    }
  }

  /**
   * Get questionnaire completion percentage
   */
  static async getCompletionPercentage(totalQuestions: number = 13): Promise<number> {
    try {
      const answers = await this.loadAnswers();
      return Math.round((answers.length / totalQuestions) * 100);
    } catch (error) {
      console.error('Error calculating completion percentage:', error);
      return 0;
    }
  }

  /**
   * Clear all questionnaire data
   */
  static async clearAllData(): Promise<boolean> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_ANSWERS),
        AsyncStorage.removeItem(STORAGE_KEYS.PROFILE_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.LIFESTYLE_PREFERENCES),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing questionnaire data:', error);
      return false;
    }
  }

  /**
   * Export data for backup or transfer
   */
  static async exportData(): Promise<{
    answers: OnboardingAnswer[];
    profileData: Partial<ProfileData> | null;
    exportDate: string;
  }> {
    const answers = await this.loadAnswers();
    const profileData = await this.loadProfileData();
    
    return {
      answers,
      profileData,
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Import data from backup
   */
  static async importData(data: {
    answers: OnboardingAnswer[];
    profileData: Partial<ProfileData>;
  }): Promise<boolean> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(data.answers)),
        AsyncStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(data.profileData)),
      ]);
      return true;
    } catch (error) {
      console.error('Error importing questionnaire data:', error);
      return false;
    }
  }
}