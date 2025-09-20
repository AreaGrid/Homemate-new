import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Shield, Star, MapPin, Briefcase, Clock } from 'lucide-react-native';
import { Match } from '@/types/matching';

interface MatchPreviewCardProps {
  match: Match;
  onPress: () => void;
}

export default function MatchPreviewCard({ match, onPress }: MatchPreviewCardProps) {
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

  const generateCompatibilitySummary = () => {
    const summary = [];
    
    if (match.compatibility.lifestyle.score >= 85) {
      summary.push('Similar lifestyle habits');
    }
    
    if (match.compatibility.interests.sharedInterests.length >= 3) {
      summary.push(`Shared interests in ${match.compatibility.interests.sharedInterests.slice(0, 2).join(' & ')}`);
    }
    
    if (match.compatibility.practical.score >= 90) {
      summary.push('Aligned living expectations');
    }
    
    if (match.compatibility.social.score >= 85) {
      summary.push('Compatible social preferences');
    }

    return summary.slice(0, 2); // Show max 2 key points
  };

  const compatibilitySummary = generateCompatibilitySummary();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: match.images[0] }} style={styles.profileImage} />
        {match.verified && (
          <View style={styles.verifiedBadge}>
            <Shield size={14} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{match.name}, {match.age}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.location}>{match.location}</Text>
            </View>
          </View>
          
          <View style={styles.scoresContainer}>
            <View style={[styles.scoreBadge, { backgroundColor: getCompatibilityColor(match.compatibility.overall) }]}>
              <Star size={12} color="#FFFFFF" />
              <Text style={styles.scoreText}>{match.compatibility.overall}%</Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: getTrustScoreColor(match.trustScore) }]}>
              <Shield size={10} color="#FFFFFF" />
              <Text style={styles.trustText}>{match.trustScore}</Text>
            </View>
          </View>
        </View>

        <View style={styles.professionRow}>
          <Briefcase size={14} color="#6B7280" />
          <Text style={styles.profession}>{match.profession}</Text>
        </View>

        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilityTitle}>Why you might connect:</Text>
          {compatibilitySummary.map((point, index) => (
            <View key={index} style={styles.compatibilityPoint}>
              <View style={styles.bulletPoint} />
              <Text style={styles.compatibilityText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.lastActiveRow}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={styles.lastActive}>Active {match.lastActive}</Text>
          </View>
          <Text style={styles.viewProfileText}>Tap to view full profile</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(115, 85, 16, 0.9)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  scoresContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trustText: {
    fontSize: 10,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
    marginLeft: 3,
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profession: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#4B5563',
    marginLeft: 6,
  },
  compatibilitySection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compatibilityTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  compatibilityPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: '#735510',
    borderRadius: 2,
    marginRight: 8,
  },
  compatibilityText: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastActive: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  viewProfileText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
});