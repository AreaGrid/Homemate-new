/**
 * Completion screen component for onboarding questionnaire
 * Shows success message and final confirmation before entering the app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CircleCheck as CheckCircle, Heart, Users, Chrome as Home } from 'lucide-react-native';
import { Button } from '@/src/components/common/Button';

interface OnboardingCompletionProps {
  isLoading: boolean;
  onComplete: () => void;
  totalAnswers: number;
}

export default function OnboardingCompletion({
  isLoading,
  onComplete,
  totalAnswers,
}: OnboardingCompletionProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>
          Analyzing your preferences...
        </Text>
        <Text style={styles.loadingSubtext}>
          Creating your perfect match profile
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#FFFFFF" />
        </View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Assessment Complete!</Text>
          <Text style={styles.subtitle}>
            Great job! We've captured {totalAnswers} responses to help find your perfect housemate match.
          </Text>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What's next?</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <Users size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>
                Discover compatible housemates based on your preferences
              </Text>
            </View>
            
            <View style={styles.feature}>
              <Heart size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>
                Connect with people who share your lifestyle values
              </Text>
            </View>
            
            <View style={styles.feature}>
              <Home size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>
                Find your ideal co-living situation together
              </Text>
            </View>
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>
            💡 Remember: You can update these preferences anytime in your profile settings
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Start Matching"
          onPress={onComplete}
          style={styles.completeButton}
          textStyle={styles.completeButtonText}
          accessibilityLabel="Complete onboarding and start using the app"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#735510',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  
  loadingContainer: {
    flex: 1,
    backgroundColor: '#735510',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  loadingText: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
  },
  
  loadingSubtext: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    marginBottom: 32,
  },
  
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  title: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  subtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  
  featuresList: {
    gap: 16,
    alignItems: 'flex-start',
  },
  
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    maxWidth: 300,
  },
  
  featureText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    lineHeight: 22,
  },
  
  reminderContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  reminderText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  buttonContainer: {
    paddingTop: 20,
  },
  
  completeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  completeButtonText: {
    color: '#735510',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
  },
});