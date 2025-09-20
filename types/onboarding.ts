/**
 * TypeScript interfaces for the onboarding questionnaire system
 * Provides type safety for questions, answers, and user progress
 */
export interface TextInputConstraints {
  minLength?: number;
  maxLength?: number;
  placeholder: string;
}

export interface OnboardingQuestion {
  id: number;
  category: string;
  title: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
  placeholder?: string;
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
  textInput?: TextInputConstraints;
}

export interface OnboardingAnswer {
  questionId: number;
  answer: string | string[] | number;
  category: string;
}

export interface OnboardingProgress {
  currentQuestion: number;
  totalQuestions: number;
  answers: OnboardingAnswer[];
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface OnboardingState {
  isFirstTime: boolean;
  showOnboarding: boolean;
  progress: OnboardingProgress;
  isLoading: boolean;
  error: string | null;
}

// Animation types
export interface QuestionTransition {
  direction: 'forward' | 'backward';
  duration: number;
}

export interface AnswerSelection {
  questionId: number;
  selectedAnswer: string | string[] | number;
  animationType: 'bounce' | 'scale' | 'fade';
}