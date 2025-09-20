import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';


export default function QuestionnaireScreen() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartQuestionnaire = () => {
    setShowOnboarding(true);
  };

  const handleComplete = () => {
    setShowOnboarding(false);
    Alert.alert(
      'Assessment Updated',
      'Your preferences have been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    router.back();
  };
  if (showOnboarding) {
    return (
      <Modal
        visible={showOnboarding}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <OnboardingScreen 
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Personality Assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#f5f1e8', '#735510']}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>Update Your Preferences</Text>
          <Text style={styles.heroSubtitle}>
            Retake the personality assessment to improve your matches and find better housemate compatibility.
          </Text>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartQuestionnaire}
          >
            <Text style={styles.startButtonText}>Start Assessment</Text>
            <ChevronRight size={20} color="#735510" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What You'll Update</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Living habits and cleanliness preferences</Text>
            <Text style={styles.infoItem}>• Social interaction and communication style</Text>
            <Text style={styles.infoItem}>• Lifestyle preferences and schedules</Text>
            <Text style={styles.infoItem}>• Financial habits and expense sharing</Text>
            <Text style={styles.infoItem}>• Long-term goals and ideal housemate traits</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  heroCard: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.9,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  infoSection: {
    padding: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
}
)