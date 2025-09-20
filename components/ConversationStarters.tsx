import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ConversationStarter } from '@/types/matching';

interface ConversationStartersProps {
  starters: ConversationStarter[];
  onSelect: (starter: ConversationStarter) => void;
}

export default function ConversationStarters({ starters, onSelect }: ConversationStartersProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lifestyle':
        return '#735510';
      case 'interests':
        return '#debd72';
      case 'practical':
        return '#A3B18A';
      case 'social':
        return '#E07A5F';
      default:
        return '#6B7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lifestyle':
        return 'Lifestyle';
      case 'interests':
        return 'Interests';
      case 'practical':
        return 'Practical';
      case 'social':
        return 'Social';
      default:
        return 'General';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation Starters</Text>
      <Text style={styles.subtitle}>Based on your compatibility</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.startersScroll}>
        {starters.map((starter) => (
          <TouchableOpacity
            key={starter.id}
            style={styles.starterCard}
            onPress={() => onSelect(starter)}
          >
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(starter.category) }]}>
              <Text style={styles.categoryText}>{getCategoryLabel(starter.category)}</Text>
            </View>
            <Text style={styles.starterText}>{starter.text}</Text>
            <Text style={styles.basedOnText}>
              Based on: {starter.basedOn.join(', ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  startersScroll: {
    paddingLeft: 24,
  },
  starterCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  starterText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  basedOnText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
});