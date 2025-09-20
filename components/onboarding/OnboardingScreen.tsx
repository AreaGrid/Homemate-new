/**
 * Main onboarding screen component
 * Orchestrates the entire questionnaire flow with animations and progress tracking
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { X } from 'lucide-react-native';

import { OnboardingQuestion } from '@/types/onboarding';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingProgressBar from './OnboardingProgressBar';
import QuestionCard from './QuestionCard';
import OnboardingWelcome from './OnboardingWelcome';
import OnboardingCompletion from './OnboardingCompletion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { width } = Dimensions.get('window');

// Enhanced questionnaire data from existing codebase
const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 1,
    category: 'Living Habits',
    title: 'How would you describe your cleaning routine?',
    type: 'single',
    options: [
      'I clean as I go and keep everything spotless',
      'I do a thorough clean weekly and maintain tidiness',
      'I clean when needed, usually every few days',
      'I prefer to do big cleaning sessions monthly',
      "I'm more relaxed about cleanliness",
    ],
  },
  {
    id: 2,
    category: 'Living Habits',
    title: 'How often do you clean common areas?',
    type: 'single',
    options: [
      'Daily - I clean up immediately after use',
      'Every few days - I do regular maintenance',
      'Weekly - I have a set cleaning schedule',
      'When it gets messy - I clean as needed',
      'I prefer to hire cleaning help',
    ],
  },
  {
    id: 3,
    category: 'Social Preferences',
    title: "What's your ideal level of interaction with housemates?",
    type: 'single',
    options: [
      'Daily conversations and shared activities',
      'Regular check-ins and occasional hangouts',
      'Friendly but mostly independent living',
      'Polite interactions, prefer privacy',
      'Minimal interaction, just basic courtesy',
    ],
  },
  {
    id: 4,
    category: 'Social Preferences',
    title: 'How do you feel about shared meals?',
    type: 'single',
    options: [
      'Love cooking and eating together regularly',
      'Enjoy occasional shared meals',
      'Open to it but prefer eating separately',
      'Rarely interested in shared meals',
      'Prefer to keep meals completely separate',
    ],
  },
  {
    id: 5,
    category: 'Lifestyle',
    title: 'What are your typical sleeping hours?',
    type: 'single',
    options: [
      '9 PM - 6 AM (Early bird)',
      '10 PM - 7 AM',
      '11 PM - 8 AM',
      '12 AM - 9 AM',
      '1 AM - 10 AM (Night owl)',
    ],
  },
  {
    id: 6,
    category: 'Lifestyle',
    title: 'How do you handle noise levels at home?',
    type: 'single',
    options: [
      'I need complete quiet, especially evenings',
      'I prefer low noise but some is okay',
      'Moderate noise is fine during day hours',
      "I'm comfortable with most noise levels",
      "I don't mind noise, I can be loud too",
    ],
  },
  {
    id: 7,
    category: 'Social Preferences',
    title: "What's your policy on guests?",
    type: 'single',
    options: [
      'Rarely have guests over',
      'Occasional guests with advance notice',
      'Regular guests but respectful timing',
      'Frequent guests, very social lifestyle',
      'Open door policy, guests welcome anytime',
    ],
  },
  {
    id: 8,
    category: 'Communication',
    title: 'How do you prefer to handle conflicts or issues?',
    type: 'single',
    options: [
      'Address issues immediately and directly',
      'Think it through, then have a calm discussion',
      'Write a note or message to start the conversation',
      'Ask a mutual friend or mediator to help',
      'Try to avoid confrontation when possible',
    ],
  },
  {
    id: 9,
    category: 'Practical',
    title: 'How important is it that bills are paid on time?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      labels: [
        'Not important',
        'Somewhat important',
        'Important',
        'Very important',
        'Absolutely critical',
      ],
    },
  },
  {
    id: 10,
    category: 'Practical',
    title: 'How do you prefer to split household expenses?',
    type: 'single',
    options: [
      'Split everything equally down the middle',
      'Pay based on usage (utilities, groceries)',
      'Take turns paying for different things',
      'One person handles bills, others reimburse',
      'Keep most expenses completely separate',
    ],
  },
  {
    id: 11,
    category: 'Long-term Goals',
    title: 'What are you looking for in this co-living situation?',
    type: 'multiple',
    options: [
      'A long-term living arrangement (1+ years)',
      'Building genuine friendships',
      'Professional networking opportunities',
      'Shared activities and experiences',
      'Cost-effective living solution',
      'Temporary arrangement while I find my own place',
    ],
  },
  {
    id: 12,
    category: 'Personality',
    title: 'How would you describe your ideal housemate?',
    type: 'text',
    textInput: {
      minLength: 50,
      maxLength: 500,
      placeholder:
        'Describe the qualities and characteristics you value most in a housemate...',
    },
  },
  {
    id: 13,
    category: 'Personal',
    title: 'Tell us more about yourself and your lifestyle',
    type: 'text',
    textInput: {
      minLength: 50,
      maxLength: 500,
      placeholder:
        'Share what makes you a great housemate and what you enjoy doing...',
    },
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function OnboardingScreen({
  onComplete,
  onSkip,
}: OnboardingScreenProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  const {
    progress,
    isLoading,
    error,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeOnboarding,
    skipOnboarding,
    getCurrentAnswer,
    isQuestionAnswered,
    getProgress,
  } = useOnboarding(onboardingQuestions);

  const currentQuestion = onboardingQuestions[progress.currentQuestion];
  const progressInfo = getProgress();
  const showWelcome = progress.currentQuestion === 0 && !getCurrentAnswer(1);
  const showCompletion = progress.currentQuestion >= onboardingQuestions.length;

  // Animate question transitions
  useEffect(() => {
    if (reducedMotion) return;

    const animateTransition = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    if (progress.currentQuestion > 0) {
      animateTransition();
    }
  }, [progress.currentQuestion, reducedMotion]);

  const handleAnswer = (answer: string | string[] | number) => {
    answerQuestion(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (progress.currentQuestion < onboardingQuestions.length - 1) {
      nextQuestion();
    } else {
      completeOnboarding().then(() => {
        onComplete();
      });
    }
  };

  const handleBack = () => {
    if (progress.currentQuestion > 0) {
      previousQuestion();
    }
  };

  const handleSkip = async () => {
    await skipOnboarding();
    onSkip?.() || onComplete();
  };
  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  if (showCompletion || progress.isCompleted) {
    return (
      <OnboardingCompletion
        isLoading={isLoading}
        onComplete={onComplete}
        totalAnswers={progress.answers.length}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#735510" />

      <LinearGradient colors={['#735510', '#735510']} style={styles.gradient}>
        {/* Skip Button */}
        {!showWelcome && onSkip && (
          <View style={styles.skipContainer}>
            {/* <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip questionnaire"
            >
              <X size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity> */}
          </View>
        )}

        {/* Progress Bar */}
        {!showWelcome && (
          <OnboardingProgressBar
            current={progressInfo.current}
            total={progressInfo.total}
            percentage={progressInfo.percentage}
          />
        )}

        {/* Content Container */}
        <Animated.View
          style={[
            styles.contentContainer,
            !reducedMotion && {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {showWelcome ? (
            <OnboardingWelcome
              onStart={() => nextQuestion()}
              onSkip={onSkip ? handleSkip : undefined}
            />
          ) : (
            <QuestionCard
              question={currentQuestion}
              currentAnswer={getCurrentAnswer(currentQuestion.id)}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onBack={handleBack}
              canGoNext={isQuestionAnswered(currentQuestion.id)}
              canGoBack={progress.currentQuestion > 0}
              isLoading={isLoading}
              questionNumber={progressInfo.current}
              totalQuestions={progressInfo.total}
            />
          )}
        </Animated.View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#735510',
  },

  gradient: {
    flex: 1,
  },

  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },

  skipButton: {
    width: 40,
    height: 40,
    marginTop: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },

  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 12,
    padding: 16,
  },

  errorText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
