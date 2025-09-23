/**
 * JoinEventsScreen Component
 * Main events listing screen with search, filters, and event cards
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { useEvents } from '@/hooks/useEvents';
import { Event, EventFilter } from '@/types/events';

export default function JoinEventsScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EventFilter>({
    searchQuery: '',
    location: [],
    eventTypes: [],
    dateRange: { startDate: null, endDate: null },
    maxDistance: 25,
    onlyMatchedUsers: true,
  });

  const {
    events,
    loading,
    error,
    refreshing,
    hasMore,
    refreshEvents,
    loadMoreEvents,
    clearError,
  } = useEvents({ filters });

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshEvents();
    }, [refreshEvents])
  );

  const handleEventPress = useCallback((event: Event) => {
    router.push({
      pathname: '/events/event-detail',
      params: { eventId: event.id },
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: EventFilter) => {
    setFilters(newFilters);
  }, []);

  const renderEventCard = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard event={item} onPress={() => handleEventPress(item)} />
    ),
    [handleEventPress]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#735510" />
        <Text style={styles.loadingText}>Loading more events...</Text>
      </View>
    );
  }, [hasMore]);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Calendar size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No Events Found</Text>
        <Text style={styles.emptySubtitle}>
          {filters.searchQuery ||
          filters.location.length > 0 ||
          filters.eventTypes.length > 0
            ? 'Try adjusting your filters to see more events'
            : 'Check back later for new events in your area'}
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.emptyButtonText}>Adjust Filters</Text>
        </TouchableOpacity>
      </View>
    ),
    [filters]
  );

  const renderErrorState = useCallback(
    () => (
      <View style={styles.errorState}>
        <Text style={styles.errorTitle}>Unable to Load Events</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            clearError();
            refreshEvents();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    ),
    [error, clearError, refreshEvents]
  );

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location.length > 0) count++;
    if (filters.eventTypes.length > 0) count++;
    return count;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {' '}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Join Events</Text>
          <Text style={styles.subtitle}>
            Meet your potential housemates in person
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color="#1F2937" />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem} key="stats-events">
          <Calendar size={16} color="#735510" />
          <Text style={styles.statText}>{events.length} events</Text>
        </View>

        <View style={styles.statItem} key="stats-users">
          <Users size={16} color="#735510" />
          <Text style={styles.statText}>Matched users only</Text>
        </View>

        <View style={styles.statItem} key="stats-distance">
          <MapPin size={16} color="#735510" />
          <Text style={styles.statText}>Within {filters.maxDistance}km</Text>
        </View>
      </View>

      {/* Events List */}
      {error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={
            (item, index) => `event-${item.id}-${index}` // Add index as fallback
          }
          contentContainerStyle={[
            styles.listContainer,
            events.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshEvents}
              colors={['#735510']}
              tintColor="#735510"
            />
          }
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      )}

      {/* Loading Overlay */}
      {loading && events.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#735510" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      )}

      {/* Filters Modal */}
      <EventFilters
        visible={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClose={() => setShowFilters(false)}
      />
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
    paddingBottom: 16,
  },

  headerContent: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
    position: 'relative',
  },

  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    backgroundColor: '#735510',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterBadgeText: {
    fontSize: 10,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },

  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },

  listContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },

  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },

  loadingText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },

  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  emptyButton: {
    backgroundColor: '#735510',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  emptyButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },

  errorState: {
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },

  errorTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
  },

  errorSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
});
