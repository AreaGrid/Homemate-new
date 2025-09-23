/**
 * EventCard Component
 * Displays event information in a card format for the events list
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';
import { Event } from '@/types/events';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Convert "14:00:00" to "14:00"
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      coffee_meetup: '#8B4513',
      apartment_viewing: '#4A90E2',
      neighborhood_tour: '#50C878',
      group_dinner: '#FF6B6B',
      activity_based: '#9B59B6',
      co_working: '#F39C12',
      house_party: '#E74C3C',
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      coffee_meetup: 'Coffee Meetup',
      apartment_viewing: 'Apartment Viewing',
      neighborhood_tour: 'Neighborhood Tour',
      group_dinner: 'Group Dinner',
      activity_based: 'Activity',
      co_working: 'Co-working',
      house_party: 'House Party',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
      accessibilityRole="button"
      accessibilityLabel={`${event.title} event on ${formatDate(event.date)}`}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              event.imageUrl ||
              'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
          }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        {/* Joined Badge */}
        {event.userHasJoined && (
          <View style={styles.joinedBadge}>
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.joinedText}>Joined</Text>
          </View>
        )}

        {/* Event Type Badge */}
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getEventTypeColor(event.type) },
          ]}
        >
          <Text style={styles.typeText}>{getEventTypeLabel(event.type)}</Text>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Host Verification */}
          <View style={styles.hostInfo}>
            <Image
              source={{ uri: event.host.profileImage }}
              style={styles.hostImage}
            />
            {event.host.verificationStatus.id && (
              <Shield
                size={12}
                color="#735510"
                style={styles.verificationIcon}
              />
            )}
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {event.shortDescription}
        </Text>

        {/* Event Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location.name}
            </Text>
          </View>
        </View>

        {/* Attendees and Capacity */}
        <View style={styles.footer}>
          <View style={styles.attendeesInfo}>
            <Users size={16} color="#735510" />
            <Text style={styles.attendeesText}>
              {event.attendees.length}/{event.maxAttendees} attending
            </Text>
          </View>

          {/* Matched Users Indicator */}
          {event.attendees.some((attendee) => attendee.isMatched) && (
            <View style={styles.matchedIndicator}>
              <View style={styles.matchedDot} />
              <Text style={styles.matchedText}>Matched users</Text>
            </View>
          )}
        </View>

        {/* Private Event Indicator */}
        {event.isPrivate && (
          <View style={styles.privateIndicator}>
            <Shield size={14} color="#735510" />
            <Text style={styles.privateText}>Private Event</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffffff',
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
    height: 160,
  },

  eventImage: {
    width: '100%',
    height: '100%',
  },

  joinedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  joinedText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },

  typeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  typeText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },

  content: {
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },

  hostInfo: {
    position: 'relative',
    alignItems: 'center',
  },

  hostImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  verificationIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 1,
  },

  description: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  details: {
    gap: 6,
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    flex: 1,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  attendeesText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },

  matchedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  matchedDot: {
    width: 6,
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },

  matchedText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#10B981',
  },

  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },

  privateText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
});
