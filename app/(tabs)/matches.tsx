import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  X,
  MapPin,
  User,
  Briefcase,
  Star,
  Filter,
  Shield,
  Clock,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Match, CompatibilityBreakdown } from '@/types/matching';
import MatchPreviewCard from '@/components/MatchPreviewCard';

const { width, height } = Dimensions.get('window');

const matches: Match[] = [
  {
    id: 1,
    name: 'Emma Rodriguez',
    age: 28,
    profession: 'Software Engineer',
    location: 'Amsterdam, Netherlands',
    images: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    ],
    about:
      'Love cooking, yoga, and movie nights. Looking for a clean, respectful housemate who enjoys good conversation and values a peaceful home environment.',
    idealHousemate:
      'Someone who is clean, communicative, and enjoys occasional shared activities but also respects personal space. Ideally looking for a long-term living arrangement.',
    interests: [
      'Cooking',
      'Yoga',
      'Reading',
      'Hiking',
      'Photography',
      'Sustainable Living',
    ],
    lifestyle: {
      cleanliness: 'I clean as I go and keep everything spotless',
      socialLevel: 'Regular check-ins and occasional hangouts',
      bedtime: '11 PM - 8 AM',
      pets: 'Dog Friendly',
      noiseLevel: 'I prefer low noise but some is okay',
      guestPolicy: 'Occasional guests with advance notice',
      conflictResolution: 'Think it through, then have a calm discussion',
      financialHabits: 'Very important',
      longTermGoals:
        'A long-term living arrangement (1+ years), Building genuine friendships',
    },
    verificationStatus: {
      phone: true,
      email: true,
      id: true,
      employment: true,
      background: true,
      references: true,
    },
    trustScore: 95,
    compatibility: {
      overall: 92,
      lifestyle: {
        score: 94,
        details: [
          'Both prefer clean, organized living spaces',
          'Similar bedtime schedules (11 PM - 8 AM)',
          'Shared approach to guest policies',
        ],
      },
      social: {
        score: 88,
        details: [
          'Both enjoy occasional shared activities',
          'Similar communication styles',
          'Mutual respect for personal space',
        ],
      },
      practical: {
        score: 96,
        details: [
          'Both prioritize timely bill payments',
          'Prefer equal expense splitting',
          'Long-term housing commitment',
        ],
      },
      interests: {
        score: 85,
        sharedInterests: ['Cooking', 'Reading', 'Hiking', 'Sustainable Living'],
      },
    },
    verified: true,
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Liam Chen',
    age: 26,
    profession: 'Marketing Manager',
    location: 'Amsterdam, Netherlands',
    images: [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    ],
    about:
      'Work-from-home marketing professional who values a quiet, organized living space. I enjoy plants, coffee, and weekend photography walks.',
    idealHousemate:
      'Someone who is quiet, clean, and independent. Perfect for someone who works from home and values a peaceful environment.',
    interests: [
      'Photography',
      'Coffee',
      'Plants',
      'Design',
      'Minimalism',
      'Tech',
    ],
    lifestyle: {
      cleanliness: 'I do a thorough clean weekly and maintain tidiness',
      socialLevel: 'Friendly but mostly independent living',
      bedtime: '10 PM - 7 AM',
      pets: 'No Pets',
      noiseLevel: 'I need complete quiet, especially evenings',
      guestPolicy: 'Rarely have guests over',
      conflictResolution: 'Write a note or message to start the conversation',
      financialHabits: 'Very important',
      longTermGoals:
        'Cost-effective living solution, Professional networking opportunities',
    },
    verificationStatus: {
      phone: true,
      email: true,
      id: true,
      employment: true,
      background: false,
      references: true,
    },
    trustScore: 88,
    compatibility: {
      overall: 88,
      lifestyle: {
        score: 92,
        details: [
          'Both value quiet, organized living',
          'Similar work-from-home schedules',
          'Minimal guest preferences align',
        ],
      },
      social: {
        score: 85,
        details: [
          'Both prefer independent living styles',
          'Respectful communication approaches',
          'Low-key social interaction',
        ],
      },
      practical: {
        score: 90,
        details: [
          'Both prioritize financial responsibility',
          'Professional networking interests',
          'Organized approach to shared spaces',
        ],
      },
      interests: {
        score: 82,
        sharedInterests: ['Photography', 'Coffee', 'Tech', 'Design'],
      },
    },
    verified: true,
    lastActive: '1 day ago',
  },
];

export default function MatchesScreen() {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedCompatibility, setExpandedCompatibility] = useState<
    string | null
  >(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  const handleConnect = () => {
    if (selectedMatch) {
      console.log('Connecting with:', selectedMatch.name);
      // In a real app, this would initiate a connection request
      setShowDetails(false);
      setSelectedMatchId(null);
    }
  };

  const handleDismiss = () => {
    setShowFeedback(true);
  };

  const handleMatchPress = (matchId: number) => {
    setSelectedMatchId(matchId);
    setShowDetails(false);
    setExpandedCompatibility(null);
    setShowDetails(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setShowDetails(false);
    setSelectedMatchId(null);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return '#735510';
    if (score >= 80) return '#debd72';
    return '#c9a55a';
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return '#735510';
    if (score >= 75) return '#debd72';
    return '#c9a55a';
  };

  const renderCompatibilitySection = (
    title: string,
    data: any,
    key: string
  ) => {
    const isExpanded = expandedCompatibility === key;

    return (
      <View style={styles.compatibilitySection}>
        <TouchableOpacity
          style={styles.compatibilitySectionHeader}
          onPress={() => setExpandedCompatibility(isExpanded ? null : key)}
        >
          <View style={styles.compatibilitySectionLeft}>
            <Text style={styles.compatibilitySectionTitle}>{title}</Text>
            <View
              style={[
                styles.compatibilityScore,
                { backgroundColor: getCompatibilityColor(data.score) },
              ]}
            >
              <Text style={styles.compatibilityScoreText}>{data.score}%</Text>
            </View>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#6B7280" />
          ) : (
            <ChevronDown size={20} color="#6B7280" />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.compatibilityDetails}>
            {data.details?.map((detail: string, index: number) => (
              <View key={index} style={styles.compatibilityDetail}>
                <View style={styles.compatibilityDetailDot} />
                <Text style={styles.compatibilityDetailText}>{detail}</Text>
              </View>
            ))}
            {data.sharedInterests && (
              <View style={styles.sharedInterests}>
                <Text style={styles.sharedInterestsTitle}>
                  Shared Interests:
                </Text>
                <View style={styles.sharedInterestsTags}>
                  {data.sharedInterests.map(
                    (interest: string, index: number) => (
                      <View key={index} style={styles.sharedInterestTag}>
                        <Text style={styles.sharedInterestText}>
                          {interest}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (showFeedback) {
    return (
      <Modal
        visible={showFeedback}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.feedbackContainer}>
          <View style={styles.feedbackHeader}>
            <TouchableOpacity onPress={() => setShowFeedback(false)}>
              <Text style={styles.feedbackCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.feedbackTitle}>
              Why didn't this match work?
            </Text>
            <TouchableOpacity onPress={handleCloseFeedback}>
              <Text style={styles.feedbackSubmit}>Submit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.feedbackContent}>
            <Text style={styles.feedbackSubtitle}>
              Your feedback helps us improve our matching algorithm
            </Text>

            <View style={styles.feedbackOptions}>
              {[
                'Different lifestyle preferences',
                'Incompatible cleanliness standards',
                'Different social expectations',
                'Location not ideal',
                'Different long-term goals',
                'Communication style mismatch',
                'Other',
              ].map((option, index) => (
                <TouchableOpacity key={index} style={styles.feedbackOption}>
                  <Text style={styles.feedbackOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  if (showDetails && selectedMatch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowDetails(false)}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>Profile Details</Text>
          <TouchableOpacity style={styles.messageButton}>
            <MessageCircle size={20} color="#735510" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContent}>
          <View style={styles.detailsImageContainer}>
            <Image
              source={{ uri: selectedMatch.images[0] }}
              style={styles.detailsImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.detailsImageOverlay}
            >
              <View style={styles.detailsImageInfo}>
                <View style={styles.detailsNameRow}>
                  <Text style={styles.detailsName}>
                    {selectedMatch.name}, {selectedMatch.age}
                  </Text>
                  {selectedMatch.verified && (
                    <View style={styles.verifiedBadge}>
                      <Shield size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.detailsLocation}>
                  <MapPin size={16} color="#FFFFFF" />
                  <Text style={styles.detailsLocationText}>
                    {selectedMatch.location}
                  </Text>
                </View>
                <View style={styles.detailsLastActive}>
                  <Clock size={14} color="#FFFFFF" />
                  <Text style={styles.detailsLastActiveText}>
                    Active {selectedMatch.lastActive}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Trust Score */}
          <View style={styles.detailsSection}>
            <View style={styles.trustScoreHeader}>
              <Text style={styles.detailsSectionTitle}>Trust Score</Text>
              <View
                style={[
                  styles.trustScoreBadge,
                  {
                    backgroundColor: getTrustScoreColor(
                      selectedMatch.trustScore
                    ),
                  },
                ]}
              >
                <Shield size={16} color="#FFFFFF" />
                <Text style={styles.trustScoreText}>
                  {selectedMatch.trustScore}/100
                </Text>
              </View>
            </View>
            <Text style={styles.trustScoreDescription}>
              Based on verification status, profile completeness, and user
              feedback
            </Text>
          </View>

          {/* Compatibility Breakdown */}
          <View style={styles.detailsSection}>
            <View style={styles.compatibilityHeader}>
              <Text style={styles.detailsSectionTitle}>
                Compatibility Analysis
              </Text>
              <View
                style={[
                  styles.compatibilityBadge,
                  {
                    backgroundColor: getCompatibilityColor(
                      selectedMatch.compatibility.overall
                    ),
                  },
                ]}
              >
                <Star size={16} color="#FFFFFF" />
                <Text style={styles.compatibilityScore}>
                  {selectedMatch.compatibility.overall}%
                </Text>
              </View>
            </View>

            {renderCompatibilitySection(
              'Lifestyle Match',
              selectedMatch.compatibility.lifestyle,
              'lifestyle'
            )}
            {renderCompatibilitySection(
              'Social Compatibility',
              selectedMatch.compatibility.social,
              'social'
            )}
            {renderCompatibilitySection(
              'Practical Alignment',
              selectedMatch.compatibility.practical,
              'practical'
            )}
            {renderCompatibilitySection(
              'Shared Interests',
              selectedMatch.compatibility.interests,
              'interests'
            )}
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>About</Text>
            <Text style={styles.detailsText}>{selectedMatch.about}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>Looking For</Text>
            <Text style={styles.detailsText}>
              {selectedMatch.idealHousemate}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>Profession</Text>
            <View style={styles.professionContainer}>
              <Briefcase size={20} color="#735510" />
              <Text style={styles.professionText}>
                {selectedMatch.profession}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {selectedMatch.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>
              Lifestyle Preferences
            </Text>
            <View style={styles.lifestyleContainer}>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleLabel}>Cleanliness</Text>
                <Text style={styles.lifestyleValue}>
                  {selectedMatch.lifestyle.cleanliness}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleLabel}>Social Level</Text>
                <Text style={styles.lifestyleValue}>
                  {selectedMatch.lifestyle.socialLevel}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleLabel}>Sleep Schedule</Text>
                <Text style={styles.lifestyleValue}>
                  {selectedMatch.lifestyle.bedtime}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleLabel}>Noise Level</Text>
                <Text style={styles.lifestyleValue}>
                  {selectedMatch.lifestyle.noiseLevel}
                </Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleLabel}>Guest Policy</Text>
                <Text style={styles.lifestyleValue}>
                  {selectedMatch.lifestyle.guestPolicy}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.detailsActions}>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
          >
            <Text style={styles.dismissButtonText}>Dismiss Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
          >
            <Text style={styles.connectButtonText}>
              Connect with {selectedMatch.name}
            </Text>
            <X size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Find Your Ideal Housemate</Text>
          <Text style={styles.subtitle}>
            Quality matches based on compatibility
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.matchesListContainer}>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MatchPreviewCard
              match={item}
              onPress={() => handleMatchPress(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.matchesList}
        />
      </View>

      <View style={styles.bottomInfo}>
        <Text style={styles.bottomInfoText}>
          {matches.length} quality matches found based on your preferences
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 92, // Account for tab bar height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchesListContainer: {
    flex: 1,
  },
  matchesList: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  bottomInfo: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  bottomInfoText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  // Details screen styles
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  messageButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContent: {
    flex: 1,
  },
  detailsImageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  detailsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 24,
  },
  detailsImageInfo: {
    marginBottom: 20,
  },
  detailsNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsName: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    marginLeft: 12,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(115, 85, 16, 0.8)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailsLocationText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  detailsLastActive: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsLastActiveText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 6,
  },
  detailsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trustScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trustScoreText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trustScoreDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compatibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  compatibilityScoreWhiteText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  compatibilitySection: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compatibilitySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  compatibilitySectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compatibilitySectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  compatibilityScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#FFFFFF',
  },
  compatibilityScoreText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  compatibilityDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  compatibilityDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  compatibilityDetailDot: {
    width: 6,
    height: 6,
    backgroundColor: '#735510',
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  compatibilityDetailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  sharedInterests: {
    marginTop: 12,
  },
  sharedInterestsTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sharedInterestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sharedInterestTag: {
    backgroundColor: '#f5f1e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sharedInterestText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    marginLeft: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f5f1e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  lifestyleContainer: {
    gap: 16,
  },
  lifestyleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lifestyleLabel: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    flex: 1,
  },
  lifestyleValue: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  detailsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dismissButton: {
    flex: 0.4,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dismissButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#6B7280',
  },
  connectButton: {
    flex: 0.6,
    backgroundColor: '#735510',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  // Feedback modal styles
  feedbackContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  feedbackCancel: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#6B7280',
  },
  feedbackTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  feedbackSubmit: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  feedbackContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  feedbackSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  feedbackOptions: {
    gap: 12,
  },
  feedbackOption: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  feedbackOptionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    textAlign: 'center',
  },
});
