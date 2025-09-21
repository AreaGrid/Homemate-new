import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
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
import {
  MapPin,
  Users,
  Shield,
  Star,
  ChevronRight,
  Bell,
  Settings,
  Calendar,
  Target,
  User,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import MicroCopy from '@/components/MicroCopy';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: Shield,
    title: 'Verified Profiles',
    description:
      'All users undergo thorough verification for your safety and peace of mind.',
  },
  {
    icon: Users,
    title: 'Smart Matching',
    description:
      'Our algorithm analyzes 50+ factors to find your perfect living partner.',
  },
  {
    icon: MapPin,
    title: 'Location Based',
    description: 'Find compatible housemates in your preferred neighborhoods.',
  },
  {
    icon: Star,
    title: 'Premium Support',
    description:
      '24/7 support and mediation services for successful co-living.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    location: 'Amsterdam',
    text: "Found my perfect housemate through Homemate. We've been living together for 8 months now!",
    image:
      'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    name: 'Marcus Johnson',
    location: 'Berlin',
    text: 'The compatibility matching is incredible. We share the same lifestyle and it works perfectly.',
    image:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
];

const quickActions = [
  {
    id: 'questionnaire',
    icon: Target,
    title: 'Complete Assessment',
    subtitle: 'Improve matches',
    color: '#735510',
  },
  {
    id: 'verification',
    icon: Shield,
    title: 'Get Verified',
    subtitle: 'Build trust',
    color: '#A3B18A',
  },
  {
    id: 'edit-profile',
    icon: User,
    title: 'Edit Profile',
    subtitle: 'Update info',
    color: '#E07A5F',
  },
  {
    id: 'matches',
    icon: Users,
    title: 'Browse Matches',
    subtitle: '12 new matches',
    color: '#735510',
  },
  {
    id: 'events',
    icon: Calendar,
    title: 'Join Events',
    subtitle: '3 upcoming',
    color: '#debd72',
  },
];

export default function HomeScreen() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName] = useState('Alex');
  const [microCopyLanguage, setMicroCopyLanguage] = useState<
    'english' | 'dutch'
  >('english');
  const reducedMotion = useReducedMotion();
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const onboardingCompleted = await AsyncStorage.getItem(
        '@homemate_onboarding_completed'
      );

      const isFirstTime = !hasLaunched;
      const shouldShowOnboarding = isFirstTime && !onboardingCompleted;

      if (isFirstTime) {
        setIsFirstTime(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      }

      if (shouldShowOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.log('Error checking first time user:', error);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'questionnaire':
        setShowOnboarding(true);
        break;
      case 'verification':
        router.push('/verification');
        break;
      case 'matches':
        router.push('/(tabs)/matches');
        break;
      case 'events':
        router.push('/events/join-events');
        break;
      case 'edit-profile':
        router.push('/edit-profile');
        break;
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsFirstTime(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setIsFirstTime(false);
  };
  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  // Show onboarding modal if needed
  if (showOnboarding) {
    return (
      <Modal
        visible={showOnboarding}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </Modal>
    );
  }

  if (isFirstTime) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#F4E1D2', '#FFFFFF']}
          style={styles.onboardingContainer}
        >
          <View style={styles.onboardingContent}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/6585614/pexels-photo-6585614.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
              }}
              style={styles.onboardingImage}
            />

            <View style={styles.onboardingText}>
              <Text style={styles.onboardingTitle}>Welcome to Homemate</Text>
              <Text style={styles.onboardingSubtitle}>
                Find your perfect living partner through intelligent
                compatibility matching
              </Text>
            </View>

            <View style={styles.onboardingButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setIsFirstTime(false)}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsFirstTime(false)}
              >
                <Text style={styles.secondaryButtonText}>
                  I already have an account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {getGreeting()}, {userName}!
            </Text>
            <Text style={styles.subtitle}>
              Ready to find your perfect housemate?
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#6B7280" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completion CTA */}
        <LinearGradient colors={['#735510', '#5d4409']} style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Complete Your Journey</Text>
            <Text style={styles.ctaSubtitle}>
              Take our personality assessment to get better matches and find
              your ideal living partner.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => {
                setIsFirstTime(false);
                setShowOnboarding(true);
              }}
            >
              <Text style={styles.ctaButtonText}>Start Assessment</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/images/homemate_logoFavWhite.png')}
            style={styles.ctaImage}
          />
        </LinearGradient>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action.id)}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: `${action.color}20` },
                    ]}
                  >
                    <IconComponent size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Homemate?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <feature.icon size={24} color="#735510" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Success Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Stories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonials}
          >
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <Image
                  source={{ uri: testimonial.image }}
                  style={styles.testimonialImage}
                />
                <View style={styles.testimonialContent}>
                  <Text style={styles.testimonialText}>
                    "{testimonial.text}"
                  </Text>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialLocation}>
                    {testimonial.location}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['#debd72', '#c9a55a']}
            style={styles.statsCard}
          >
            <View style={styles.statsContent}>
              <Text style={styles.statsTitle}>Join Our Growing Community</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>15,000+</Text>
                  <Text style={styles.statLabel}>Verified Users</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8,500+</Text>
                  <Text style={styles.statLabel}>Successful Matches</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>92%</Text>
                  <Text style={styles.statLabel}>Satisfaction Rate</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 92, // Account for tab bar height
  },
  scrollView: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  onboardingContent: {
    alignItems: 'center',
  },
  onboardingImage: {
    width: 200,
    height: 250,
    borderRadius: 16,
    marginBottom: 40,
  },
  onboardingText: {
    alignItems: 'center',
    marginBottom: 40,
  },
  onboardingTitle: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  onboardingSubtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  onboardingButtons: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#735510',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: '#735510',
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ctaCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ctaContent: {
    flex: 1,
    marginRight: 16,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    marginRight: 4,
  },
  ctaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
    // boxShadow: '0px 1px 12px #000000bf',
    borderRadius: 12,
    maxWidth: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    // boxShadow: '0px 1px px #0000003e',
    borderRadius: 12,
  },
  quickActionCard: {
    backgroundColor: '#f4e1d289',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: (width - 64) / 2,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f5f1e8',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  testimonials: {
    paddingRight: 24,
  },
  testimonialCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: width * 0.8,
    flexDirection: 'row',
  },
  testimonialImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialContent: {
    flex: 1,
  },
  testimonialText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  testimonialName: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  testimonialLocation: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 24,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  microCopySection: {
    marginBottom: 32,
  },
  microCopyContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
