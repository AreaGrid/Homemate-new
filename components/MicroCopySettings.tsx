import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MicroCopySettingsProps {
  language: 'english' | 'dutch';
  onLanguageChange: (language: 'english' | 'dutch') => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function MicroCopySettings({
  language,
  onLanguageChange,
  enabled,
  onToggle,
}: MicroCopySettingsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Inspirational Messages</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Show Messages</Text>
        <TouchableOpacity
          style={[styles.toggle, enabled && styles.toggleActive]}
          onPress={() => onToggle(!enabled)}
        >
          <View
            style={[styles.toggleThumb, enabled && styles.toggleThumbActive]}
          />
        </TouchableOpacity>
      </View>

      {enabled && (
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'english' && styles.languageButtonActive,
              ]}
              onPress={() => onLanguageChange('english')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'english' && styles.languageButtonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'dutch' && styles.languageButtonActive,
              ]}
              onPress={() => onLanguageChange('dutch')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'dutch' && styles.languageButtonTextActive,
                ]}
              >
                Nederlands
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
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
  languageButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  languageButtonActive: {
    backgroundColor: '#735510',
  },
  languageButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#6B7280',
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
});
