/**
 * Question card component for onboarding questionnaire
 * Handles different question types with animations and interactions
 */

import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { OnboardingQuestion } from '@/types/onboarding';
import { Button } from '@/src/components/common/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface QuestionCardProps {
  question: OnboardingQuestion;
  currentAnswer: string | string[] | number | undefined;
  onAnswer: (answer: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isLoading: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  onNext,
  onBack,
  canGoNext,
  canGoBack,
  isLoading,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
  const reducedMotion = useReducedMotion();

  const triggerHapticFeedback = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);
  const animateSelection = useCallback(
    (optionKey: string) => {
      if (reducedMotion) return;

      if (!scaleAnims[optionKey]) {
        scaleAnims[optionKey] = new Animated.Value(1);
      }

      const anim = scaleAnims[optionKey];

      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [scaleAnims, reducedMotion]
  );

  const handleOptionSelect = (option: string) => {
    triggerHapticFeedback();
    animateSelection(option);
    onAnswer(option);
  };

  const handleMultipleSelect = (option: string) => {
    triggerHapticFeedback();
    animateSelection(option);
    const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option];
    onAnswer(newAnswers);
  };

  const handleScaleSelect = (value: number) => {
    triggerHapticFeedback();
    animateSelection(value.toString());
    onAnswer(value);
  };

  const handleNext = () => {
    triggerHapticFeedback();
    onNext();
  };

  const handleBack = () => {
    triggerHapticFeedback();
    onBack();
  };
  const renderSingleChoice = () => (
    <View style={styles.optionsContainer}>
      {question.options?.map((option, index) => {
        const isSelected = currentAnswer === option;
        const optionKey = `single_${index}`;

        if (!scaleAnims[optionKey]) {
          scaleAnims[optionKey] = new Animated.Value(1);
        }

        return (
          <Animated.View
            key={index}
            style={[
              styles.animatedOption,
              !reducedMotion && {
                transform: [{ scale: scaleAnims[optionKey] }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleOptionSelect(option)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Select option: ${option}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );

  const renderMultipleChoice = () => (
    <View style={styles.optionsContainer}>
      <Text style={styles.helperText}>Select all that apply</Text>
      {question.options?.map((option, index) => {
        const currentAnswers = Array.isArray(currentAnswer)
          ? currentAnswer
          : [];
        const isSelected = currentAnswers.includes(option);
        const optionKey = `multiple_${index}`;

        if (!scaleAnims[optionKey]) {
          scaleAnims[optionKey] = new Animated.Value(1);
        }

        return (
          <Animated.View
            key={index}
            style={[
              styles.animatedOption,
              !reducedMotion && {
                transform: [{ scale: scaleAnims[optionKey] }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleMultipleSelect(option)}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityLabel={`${
                isSelected ? 'Deselect' : 'Select'
              } option: ${option}`}
              accessibilityState={{ checked: isSelected }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );

  const renderScale = () => (
    <View style={styles.scaleContainer}>
      <View style={styles.scaleOptions}>
        {question.scale?.labels.map((label, index) => {
          const value = index + 1;
          const isSelected = currentAnswer === value;
          const optionKey = `scale_${index}`;

          if (!scaleAnims[optionKey]) {
            scaleAnims[optionKey] = new Animated.Value(1);
          }

          return (
            <Animated.View
              key={index}
              style={[
                styles.animatedOption,
                !reducedMotion && {
                  transform: [{ scale: scaleAnims[optionKey] }],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.scaleButton, isSelected && styles.selectedScale]}
                onPress={() => handleScaleSelect(value)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Select rating ${value}: ${label}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.scaleNumber,
                    isSelected && styles.selectedScaleText,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>{question.scale?.labels[0]}</Text>
        <Text style={styles.scaleLabel}>
          {question.scale?.labels[question.scale.labels.length - 1]}
        </Text>
      </View>
    </View>
  );

  const renderTextInput = () => (
    <View style={styles.textContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={question.placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        value={typeof currentAnswer === 'string' ? currentAnswer : ''}
        onChangeText={onAnswer}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        maxLength={500}
        accessibilityLabel={`Text input for: ${question.title}`}
        accessibilityHint="Enter your response here"
      />
      <Text style={styles.characterCount}>
        {typeof currentAnswer === 'string' ? currentAnswer.length : 0}/500
        characters
      </Text>
    </View>
  );

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single':
        return renderSingleChoice();
      case 'multiple':
        return renderMultipleChoice();
      case 'scale':
        return renderScale();
      case 'text':
        return renderTextInput();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{question.title}</Text>
        </View>

        {/* Question Content */}
        {renderQuestionContent()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          {canGoBack && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="ghost"
              style={styles.backButton}
              textStyle={styles.backButtonText}
              accessibilityLabel="Go to previous question"
            />
          )}

          <Button
            title={questionNumber === totalQuestions ? 'Complete' : 'Continue'}
            onPress={handleNext}
            disabled={!canGoNext}
            loading={isLoading && questionNumber === totalQuestions}
            style={[styles.nextButton, !canGoNext && styles.nextButtonDisabled]}
            textStyle={styles.nextButtonText}
            accessibilityLabel={
              questionNumber === totalQuestions
                ? 'Complete questionnaire'
                : 'Continue to next question'
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  categoryContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },

  questionContainer: {
    marginBottom: 32,
  },

  questionTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    lineHeight: 32,
    textAlign: 'center',
  },

  helperText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },

  optionsContainer: {
    gap: 12,
  },

  animatedOption: {
    // Container for animated options
  },

  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
  },

  optionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  selectedOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-SemiBold',
  },

  scaleContainer: {
    alignItems: 'center',
  },

  scaleOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },

  scaleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedScale: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  scaleNumber: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  selectedScaleText: {
    color: '#735510',
  },

  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },

  scaleLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: 80,
  },

  textContainer: {
    gap: 12,
  },

  textInput: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  characterCount: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },

  navigationContainer: {
    paddingTop: 20,
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  backButtonText: {
    color: '#FFFFFF',
  },

  nextButton: {
    flex: 2,
    backgroundColor: '#FFFFFF',
  },

  nextButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  nextButtonText: {
    color: '#735510',
    fontFamily: 'Outfit-SemiBold',
  },
});
