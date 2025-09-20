/**
 * EventDetailScreen Component
 * Detailed view of a single event with RSVP functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Share,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Shield, Share2, ExternalLink, CircleCheck as CheckCircle, UserPlus, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useEvents } from '@/hooks/useEvents';
import { Event, EventAttendee } from '@/types/events';

const { width, height } = Dimensions.get('window');

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  const { joinEvent, leaveEvent } = useEvents();

  // Mock function to fetch single event - replace with actual API call
  const fetchEvent = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock event data - replace with actual API call
      const mockEvent: Event = {
        id: id,
        title: 'Coffee & Co-living Chat',
        description: 'Join fellow house hunters for coffee and discuss living preferences, neighborhoods, and potential matches. This is a relaxed environment to get to know potential housemates.\n\nWe\'ll be discussing:\n• Living preferences and deal-breakers\n• Neighborhood insights and recommendations\n• Sharing experiences and tips\n• Building connections for future co-living opportunities\n\nThis is a private event for users who have matched with at least 2 other potential housemates. Come with an open mind and ready to make genuine connections!',
        shortDescription: 'Coffee meetup for potential housemates',
        type: 'coffee_meetup',
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '16:00',
        location: {
          id: 'loc1',
          name: 'Café Central',
          address: 'Nieuwmarkt 4, 1012 CR Amsterdam',
          city: 'Amsterdam',
          coordinates: { latitude: 52.3676, longitude: 4.9041 }
        },
        host: {
          id: 'host1',
          name: 'Emma Rodriguez',
          profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          verificationStatus: { phone: true, email: true, id: true },
          trustScore: 95
        },
        attendees: [
          {
            id: 'att1',
            name: 'Liam Chen',
            profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            matchCompatibility: 88,
            isMatched: true
          },
          {
            id: 'att2',
            name: 'Sophia Kim',
            profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            matchCompatibility: 91,
            isMatched: true
          }
        ],
        maxAttendees: 6,
        isPrivate: true,
        requiredMatches: 2,
        userHasJoined: false,
        userCanJoin: true,
        tags: ['coffee', 'networking', 'casual'],
        imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      };
      
      setEvent(mockEvent);
    } catch (error) {
      Alert.alert('Error', 'Failed to load event details');
      router.back();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId, fetchEvent]);

  const handleJoinEvent = useCallback(async () => {
    if (!event) return;
    
    setJoining(true);
    const success = await joinEvent(event.id);
    
    if (success) {
      setEvent(prev => prev ? { ...prev, userHasJoined: true, userCanJoin: false } : null);
    }
    
    setJoining(false);
  }, [event, joinEvent]);

  const handleLeaveEvent = useCallback(async () => {
    if (!event) return;
    
    Alert.alert(
      'Leave Event',
      'Are you sure you want to leave this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setJoining(true);
            const success = await leaveEvent(event.id);
            
            if (success) {
              setEvent(prev => prev ? { ...prev, userHasJoined: false, userCanJoin: true } : null);
            }
            
            setJoining(false);
          }
        }
      ]
    );
  }, [event, leaveEvent]);

  const handleShareEvent = useCallback(async () => {
    if (!event) return;
    
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\n${event.shortDescription}\n\nDate: ${formatDate(event.date)} at ${formatTime(event.startTime)}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  }, [event]);

  const handleOpenMaps = useCallback(() => {
    if (!event) return;
    
    const { latitude, longitude } = event.location.coordinates;
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  }, [event]);

  const handleMessageHost = useCallback(() => {
    if (!event) return;
    
    // Navigate to messaging screen with host
    router.push({
      pathname: '/(tabs)/messages',
      params: { userId: event.host.id }
    });
  }, [event]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const renderAttendee = ({ item }: { item: EventAttendee }) => (
    <View style={styles.attendeeItem}>
      <Image
        source={{ uri: item.profileImage }}
        style={styles.attendeeImage}
      />
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>{item.name}</Text>
        {item.isMatched && item.matchCompatibility && (
          <Text style={styles.attendeeCompatibility}>
            {item.matchCompatibility}% compatible
          </Text>
        )}
      </View>
      {item.isMatched && (
        <View style={styles.matchedBadge}>
          <Text style={styles.matchedText}>Matched</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          >
            {/* Navigation Header */}
            <View style={styles.navigationHeader}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleShareEvent}
              >
                <Share2 size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Event Title Overlay */}
            <View style={styles.titleOverlay}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.isPrivate && (
                <View style={styles.privateBadge}>
                  <Shield size={16} color="#FFFFFF" />
                  <Text style={styles.privateText}>Private Event</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Event Details */}
        <View style={styles.content}>
          {/* Date and Time */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Calendar size={24} color="#735510" />
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Date & Time</Text>
                <Text style={styles.detailText}>
                  {formatDate(event.date)}
                </Text>
                <Text style={styles.detailSubtext}>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <MapPin size={24} color="#735510" />
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Location</Text>
                <Text style={styles.detailText}>{event.location.name}</Text>
                <Text style={styles.detailSubtext}>{event.location.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleOpenMaps}
              >
                <ExternalLink size={20} color="#735510" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Host */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Image
                source={{ uri: event.host.profileImage }}
                style={styles.hostImage}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Hosted by</Text>
                <View style={styles.hostNameRow}>
                  <Text style={styles.detailText}>{event.host.name}</Text>
                  {event.host.verificationStatus.id && (
                    <Shield size={16} color="#735510" />
                  )}
                </View>
                <Text style={styles.detailSubtext}>
                  Trust Score: {event.host.trustScore}/100
                </Text>
              </View>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleMessageHost}
              >
                <MessageCircle size={20} color="#735510" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Attendees */}
          <View style={styles.section}>
            <View style={styles.attendeesHeader}>
              <Text style={styles.sectionTitle}>
                Attendees ({event.attendees.length}/{event.maxAttendees})
              </Text>
              <Users size={20} color="#735510" />
            </View>
            
            {event.attendees.map((attendee) => (
              <View key={attendee.id}>
                {renderAttendee({ item: attendee })}
              </View>
            ))}
            
            {event.attendees.length < event.maxAttendees && (
              <Text style={styles.spotsAvailable}>
                {event.maxAttendees - event.attendees.length} spots remaining
              </Text>
            )}
          </View>

          {/* Tags */}
          {event.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {event.userHasJoined ? (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveEvent}
            disabled={joining}
          >
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.leaveButtonText}>
              {joining ? 'Leaving...' : 'Leave Event'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.joinButton,
              !event.userCanJoin && styles.joinButtonDisabled
            ]}
            onPress={handleJoinEvent}
            disabled={!event.userCanJoin || joining}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.joinButtonText}>
              {joining ? 'Joining...' : 'Join Event'}
            </Text>
          </TouchableOpacity>
        )}
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
  
  scrollView: {
    flex: 1,
  },
  
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  
  eventImage: {
    width: '100%',
    height: '100%',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  titleOverlay: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  
  eventTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(115, 85, 16, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 4,
  },
  
  privateText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  
  detailsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  
  detailContent: {
    flex: 1,
  },
  
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
    marginBottom: 4,
  },
  
  detailText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  
  detailSubtext: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  
  mapButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f5f1e8',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  hostImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  messageButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f5f1e8',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  
  description: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  
  attendeesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  
  attendeeInfo: {
    flex: 1,
  },
  
  attendeeName: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  
  attendeeCompatibility: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#735510',
  },
  
  matchedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  matchedText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  
  spotsAvailable: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  tag: {
    backgroundColor: '#f5f1e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  
  tagText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  
  actionContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 108, // Tab bar height + safe area
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#735510',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  
  joinButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  
  leaveButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  
  errorText: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#EF4444',
    marginBottom: 24,
  },
  
  backButton: {
    backgroundColor: '#735510',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
});