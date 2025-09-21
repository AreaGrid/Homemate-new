/**
 * Welcome screen component for onboarding
 * Introduces users to the questionnaire with reassuring messaging
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Heart, Clock, Shield } from 'lucide-react-native';
import { Button } from '@/src/components/common/Button';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';

interface OnboardingWelcomeProps {
  onStart: () => void;
  onSkip?: () => void;
}

export default function OnboardingWelcome({
  onStart,
  onSkip,
}: OnboardingWelcomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/homemate_logo1.png')}
            style={{ width: 250, height: 150, tintColor: '#FFFFFF' }}
          />
        </View>

        {/* Welcome Content */}
        <View style={styles.textContent}>
          <Text style={styles.subtitle}>
            Let's find your perfect living match through a quick personality
            assessment
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Heart size={20} color="#FFFFFF" />
              <Text style={styles.featureText}>Find compatible housemates</Text>
            </View>

            <View style={styles.feature}>
              <Clock size={20} color="#FFFFFF" />
              <Text style={styles.featureText}>Takes just 3-5 minutes</Text>
            </View>

            <View style={styles.feature}>
              <Shield size={20} color="#FFFFFF" />
              <Text style={styles.featureText}>
                Your data is secure & private
              </Text>
            </View>
          </View>

          {/* Reassurance Message */}
          <View style={styles.reassuranceContainer}>
            <Text style={styles.reassuranceText}>
              💡 You can change these answers anytime in your profile
            </Text>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Start Assessment"
          onPress={onStart}
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />

        {onSkip && (
          <Button
            title="Skip for now"
            onPress={onSkip}
            variant="ghost"
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },

  heroImage: {
    width: 200,
    height: 250,
    borderRadius: 16,
  },

  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 32,
  },

  features: {
    alignItems: 'flex-start',
    marginBottom: 32,
    gap: 12,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  featureText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
  },

  reassuranceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  reassuranceText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },

  buttonContainer: {
    paddingTop: 20,
    gap: 12,
  },

  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
  },

  startButtonText: {
    color: '#735510',
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
  },

  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },

  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
});
