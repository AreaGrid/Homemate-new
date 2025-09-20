/**
 * Custom hook for event data management
 * Handles fetching, filtering, and RSVP functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Event, EventFilter, EventsResponse, JoinEventResponse } from '@/types/events';

interface UseEventsProps {
  filters?: EventFilter;
  userId?: string;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  joinEvent: (eventId: string) => Promise<boolean>;
  leaveEvent: (eventId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  clearError: () => void;
}

// Mock API service - replace with actual API calls
const eventsAPI = {
  async fetchEvents(filters: EventFilter, cursor?: string): Promise<EventsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Coffee & Co-living Chat',
        description: 'Join fellow house hunters for coffee and discuss living preferences, neighborhoods, and potential matches. This is a relaxed environment to get to know potential housemates.',
        shortDescription: 'Coffee meetup for potential housemates',
        type: 'coffee_meetup',
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '16:00',
        location: {
          id: 'loc1',
          name: 'Café Central',
          address: 'Nieuwmarkt 4',
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
      },
      {
        id: '2',
        title: 'Apartment Viewing Group',
        description: 'Group viewing of a 3-bedroom apartment in De Pijp. Perfect opportunity to meet potential housemates while checking out a great living space.',
        shortDescription: 'Group apartment viewing in De Pijp',
        type: 'apartment_viewing',
        date: '2024-01-22',
        startTime: '18:00',
        endTime: '19:30',
        location: {
          id: 'loc2',
          name: 'Van Woustraat Apartment',
          address: 'Van Woustraat 125',
          city: 'Amsterdam',
          coordinates: { latitude: 52.3547, longitude: 4.8918 }
        },
        host: {
          id: 'host2',
          name: 'Marcus Johnson',
          profileImage: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          verificationStatus: { phone: true, email: true, id: false },
          trustScore: 82
        },
        attendees: [
          {
            id: 'att2',
            name: 'Sophia Kim',
            profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            matchCompatibility: 91,
            isMatched: true
          },
          {
            id: 'att3',
            name: 'David Wilson',
            profileImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            matchCompatibility: 85,
            isMatched: true
          }
        ],
        maxAttendees: 4,
        isPrivate: true,
        requiredMatches: 3,
        userHasJoined: true,
        userCanJoin: false,
        tags: ['apartment', 'viewing', 'de-pijp'],
        imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z'
      }
    ];

    return {
      events: mockEvents,
      totalCount: mockEvents.length,
      hasMore: false,
      nextCursor: undefined
    };
  },

  async joinEvent(eventId: string): Promise<JoinEventResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: 'Successfully joined the event!',
      event: {} as Event // Would return updated event
    };
  },

  async leaveEvent(eventId: string): Promise<JoinEventResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: 'Successfully left the event.',
      event: {} as Event
    };
  }
};

export const useEvents = ({ filters, userId }: UseEventsProps = {}): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const defaultFilters: EventFilter = useMemo(() => ({
    searchQuery: '',
    location: [],
    eventTypes: [],
    dateRange: { startDate: null, endDate: null },
    maxDistance: 25,
    onlyMatchedUsers: true
  }), []);

  const activeFilters = filters || defaultFilters;

  const fetchEvents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setCursor(undefined);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await eventsAPI.fetchEvents(
        activeFilters,
        isRefresh ? undefined : cursor
      );

      if (isRefresh) {
        setEvents(response.events);
      } else {
        setEvents(prev => [...prev, ...response.events]);
      }

      setHasMore(response.hasMore);
      setCursor(response.nextCursor);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilters, cursor]);

  const refreshEvents = useCallback(async () => {
    await fetchEvents(true);
  }, [fetchEvents]);

  const loadMoreEvents = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchEvents(false);
    }
  }, [loading, hasMore, fetchEvents]);

  const joinEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      const response = await eventsAPI.joinEvent(eventId);
      
      if (response.success) {
        // Optimistically update local state
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, userHasJoined: true, userCanJoin: false }
            : event
        ));
        
        Alert.alert('Success', response.message);
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join event';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, []);

  const leaveEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      const response = await eventsAPI.leaveEvent(eventId);
      
      if (response.success) {
        // Optimistically update local state
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, userHasJoined: false, userCanJoin: true }
            : event
        ));
        
        Alert.alert('Success', response.message);
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave event';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents(true);
  }, [activeFilters]);

  return {
    events,
    loading,
    error,
    refreshing,
    hasMore,
    joinEvent,
    leaveEvent,
    refreshEvents,
    loadMoreEvents,
    clearError
  };
};