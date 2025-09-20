/**
 * EventFilters Component
 * Provides search and filtering functionality for events
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, X, MapPin, Calendar, Users, Coffee, Chrome as Home, Activity } from 'lucide-react-native';
import { EventFilter, EventType } from '@/types/events';

interface EventFiltersProps {
  filters: EventFilter;
  onFiltersChange: (filters: EventFilter) => void;
  onClose: () => void;
  visible: boolean;
}

const eventTypeOptions: { type: EventType; label: string; icon: React.ComponentType<any> }[] = [
  { type: 'coffee_meetup', label: 'Coffee Meetup', icon: Coffee },
  { type: 'apartment_viewing', label: 'Apartment Viewing', icon: Home },
  { type: 'neighborhood_tour', label: 'Neighborhood Tour', icon: MapPin },
  { type: 'group_dinner', label: 'Group Dinner', icon: Users },
  { type: 'activity_based', label: 'Activity', icon: Activity },
  { type: 'co_working', label: 'Co-working', icon: Users },
  { type: 'house_party', label: 'House Party', icon: Users },
];

const locationOptions = [
  'Amsterdam Centrum',
  'De Pijp',
  'Jordaan',
  'Oud-Zuid',
  'Noord',
  'Oost',
  'West',
  'Nieuw-West',
  'Zuid',
  'Zuidoost'
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  visible
}) => {
  const [localFilters, setLocalFilters] = useState<EventFilter>(filters);

  const updateFilter = useCallback((key: keyof EventFilter, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleEventType = useCallback((type: EventType) => {
    setLocalFilters(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }));
  }, []);

  const toggleLocation = useCallback((location: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...prev.location, location]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: EventFilter = {
      searchQuery: '',
      location: [],
      eventTypes: [],
      dateRange: { startDate: null, endDate: null },
      maxDistance: 25,
      onlyMatchedUsers: true
    };
    setLocalFilters(clearedFilters);
  }, []);

  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
    onClose();
  }, [localFilters, onFiltersChange, onClose]);

  const hasActiveFilters = localFilters.searchQuery || 
    localFilters.location.length > 0 || 
    localFilters.eventTypes.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filter Events</Text>
          <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                value={localFilters.searchQuery}
                onChangeText={(text) => updateFilter('searchQuery', text)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Event Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Types</Text>
            <View style={styles.chipContainer}>
              {eventTypeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = localFilters.eventTypes.includes(option.type);
                
                return (
                  <TouchableOpacity
                    key={option.type}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleEventType(option.type)}
                  >
                    <IconComponent 
                      size={16} 
                      color={isSelected ? '#FFFFFF' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Locations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Neighborhoods</Text>
            <View style={styles.chipContainer}>
              {locationOptions.map((location) => {
                const isSelected = localFilters.location.includes(location);
                
                return (
                  <TouchableOpacity
                    key={location}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleLocation(location)}
                  >
                    <MapPin 
                      size={16} 
                      color={isSelected ? '#FFFFFF' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Maximum Distance: {localFilters.maxDistance}km
            </Text>
            <View style={styles.distanceOptions}>
              {[5, 10, 25, 50].map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceChip,
                    localFilters.maxDistance === distance && styles.chipSelected
                  ]}
                  onPress={() => updateFilter('maxDistance', distance)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.maxDistance === distance && styles.chipTextSelected
                  ]}>
                    {distance}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Matched Users Only */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => updateFilter('onlyMatchedUsers', !localFilters.onlyMatchedUsers)}
            >
              <View style={styles.toggleLeft}>
                <Users size={20} color="#735510" />
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>Matched Users Only</Text>
                  <Text style={styles.toggleSubtitle}>
                    Show events with users you've matched with
                  </Text>
                </View>
              </View>
              <View style={[
                styles.toggle,
                localFilters.onlyMatchedUsers && styles.toggleActive
              ]}>
                <View style={[
                  styles.toggleThumb,
                  localFilters.onlyMatchedUsers && styles.toggleThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.applyButtonLarge}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonLargeText}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  section: {
    marginBottom: 32,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#1F2937',
  },
  
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  chipSelected: {
    backgroundColor: '#735510',
    borderColor: '#735510',
  },
  
  chipText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#6B7280',
  },
  
  chipTextSelected: {
    color: '#FFFFFF',
  },
  
  distanceOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  distanceChip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  
  toggleText: {
    flex: 1,
  },
  
  toggleTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  
  toggleSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  
  toggle: {
    width: 48,
    height: 28,
    backgroundColor: '#D1D5DB',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  
  toggleActive: {
    backgroundColor: '#735510',
  },
  
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  
  clearButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#6B7280',
  },
  
  applyButtonLarge: {
    flex: 2,
    backgroundColor: '#735510',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  applyButtonLargeText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
});