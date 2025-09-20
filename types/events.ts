/**
 * TypeScript interfaces for the Events feature
 * Provides type safety across all event-related components
 */

export interface EventLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EventHost {
  id: string;
  name: string;
  profileImage: string;
  verificationStatus: {
    phone: boolean;
    email: boolean;
    id: boolean;
  };
  trustScore: number;
}

export interface EventAttendee {
  id: string;
  name: string;
  profileImage: string;
  matchCompatibility?: number;
  isMatched: boolean;
}

export interface Event {
  id: string | number; // Make sure this is unique for each event
  title: string;
  description: string;
  shortDescription: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: EventLocation;
  host: EventHost;
  attendees: EventAttendee[];
  maxAttendees: number;
  isPrivate: boolean;
  requiredMatches: number; // Minimum matches required to see this event
  userHasJoined: boolean;
  userCanJoin: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 
  | 'coffee_meetup'
  | 'apartment_viewing'
  | 'neighborhood_tour'
  | 'group_dinner'
  | 'activity_based'
  | 'co_working'
  | 'house_party';

export interface EventFilter {
  searchQuery: string;
  location: string[];
  eventTypes: EventType[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  maxDistance: number; // in kilometers
  onlyMatchedUsers: boolean;
}

export interface EventsResponse {
  events: Event[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface JoinEventResponse {
  success: boolean;
  message: string;
  event: Event;
}

// Navigation types
export type EventsStackParamList = {
  JoinEvents: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  EventFilters: { currentFilters: EventFilter };
};