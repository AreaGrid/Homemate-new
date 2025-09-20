/**
 * Progress bar component for onboarding questionnaire
 * Shows current progress with smooth animations and clear indicators
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface OnboardingProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export default function OnboardingProgressBar({
  current,
  total,
  percentage,
}: OnboardingProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      progressAnim.setValue(percentage);
      return;
    }

    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Add subtle pulse animation for progress updates
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [percentage, reducedMotion]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Question {current} of {total}
        </Text>
        <Animated.Text 
          style={[
            styles.percentageText,
            !reducedMotion && {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {Math.round(percentage)}%
        </Animated.Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
        
        {/* Progress dots for visual enhancement */}
        <View style={styles.progressDots}>
          {Array.from({ length: total }, (_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index < current && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  stepText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  percentageText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  
  progressBarContainer: {
    position: 'relative',
  },
  
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
});