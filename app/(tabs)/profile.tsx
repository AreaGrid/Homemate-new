import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings,
  CreditCard as Edit,
  Shield,
  Star,
  MapPin,
  Briefcase,
  Camera,
  Bell,
  Lock,
  BadgeHelp as Help,
  LogOut,
  ChevronRight,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';

const userProfile = {
  name: 'Alex Thompson',
  age: 28,
  profession: 'Product Manager',
  location: 'Amsterdam, Netherlands',
  profileCompletion: 85,
  compatibility: 92,
  trustScore: 4, // Added this field
  images: [
    'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
  ],
  about:
    'Love cooking, yoga, and movie nights. Looking for a clean, respectful housemate who enjoys good conversation.',
  interests: ['Cooking', 'Yoga', 'Reading', 'Hiking', 'Tech', 'Travel'],
  verificationStatus: {
    phone: true,
    email: true,
    id: true,
    employment: true,
    background: false,
  },
  preferences: {
    notifications: true,
    locationSharing: false,
    profileVisibility: true,
  },
};

const verificationItems = [
  {
    key: 'phone',
    label: 'Phone Number',
    icon: CheckCircle,
    color: '#A3B18A',
  },
  {
    key: 'email',
    label: 'Email Address',
    icon: CheckCircle,
    color: '#A3B18A',
  },
  {
    key: 'id',
    label: 'Government ID',
    icon: CheckCircle,
    color: '#A3B18A',
  },
  {
    key: 'employment',
    label: 'Employment',
    icon: CheckCircle,
    color: '#A3B18A',
  },
  {
    key: 'background',
    label: 'Background Check',
    icon: Clock,
    color: '#F59E0B',
  },
];

export default function ProfileScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(userProfile.preferences);
  const [microCopyLanguage, setMicroCopyLanguage] = useState<
    'english' | 'dutch'
  >('english');
  const [microCopyEnabled, setMicroCopyEnabled] = useState(true);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const getVerificationLevel = () => {
    const verified = Object.values(userProfile.verificationStatus).filter(
      Boolean
    ).length;
    const total = Object.keys(userProfile.verificationStatus).length;
    return `${verified}/${total}`;
  };

  if (showSettings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.settingsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowSettings(false)}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.settingsTitle}>Settings</Text>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.settingsContent}>
          {/* Privacy Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Privacy & Safety</Text>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Bell size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={preferences.notifications}
                onValueChange={(value) =>
                  updatePreference('notifications', value)
                }
                trackColor={{ false: '#D1D5DB', true: '#735510' }}
                thumbColor={preferences.notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>Location Sharing</Text>
              </View>
              <Switch
                value={preferences.locationSharing}
                onValueChange={(value) =>
                  updatePreference('locationSharing', value)
                }
                trackColor={{ false: '#D1D5DB', true: '#735510' }}
                thumbColor={preferences.locationSharing ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Lock size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>Profile Visibility</Text>
              </View>
              <Switch
                value={preferences.profileVisibility}
                onValueChange={(value) =>
                  updatePreference('profileVisibility', value)
                }
                trackColor={{ false: '#D1D5DB', true: '#735510' }}
                thumbColor={
                  preferences.profileVisibility ? '#FFFFFF' : '#FFFFFF'
                }
              />
            </View>
          </View>

          {/* Micro-Copy Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Homepage Messages</Text>

            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsItemLabel}>
                  Show Inspirational Messages
                </Text>
              </View>
              <Switch
                value={microCopyEnabled}
                onValueChange={setMicroCopyEnabled}
                trackColor={{ false: '#D1D5DB', true: '#735510' }}
                thumbColor={microCopyEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {microCopyEnabled && (
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Text style={styles.settingsItemLabel}>Message Language</Text>
                </View>
                <View style={styles.languageSelector}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      microCopyLanguage === 'english' &&
                        styles.languageOptionActive,
                    ]}
                    onPress={() => setMicroCopyLanguage('english')}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        microCopyLanguage === 'english' &&
                          styles.languageOptionTextActive,
                      ]}
                    >
                      English
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      microCopyLanguage === 'dutch' &&
                        styles.languageOptionActive,
                    ]}
                    onPress={() => setMicroCopyLanguage('dutch')}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        microCopyLanguage === 'dutch' &&
                          styles.languageOptionTextActive,
                      ]}
                    >
                      Nederlands
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Account Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Account</Text>

            <TouchableOpacity style={styles.settingsButton}>
              <View style={styles.settingsItemLeft}>
                <Shield size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>
                  Verification Center
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton}>
              <View style={styles.settingsItemLeft}>
                <Edit size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>Edit Profile</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton}>
              <View style={styles.settingsItemLeft}>
                <Help size={20} color="#6B7280" />
                <Text style={styles.settingsItemLabel}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Account Actions</Text>

            <TouchableOpacity
              style={[styles.settingsButton, styles.dangerButton]}
            >
              <View style={styles.settingsItemLeft}>
                <LogOut size={20} color="#EF4444" />
                <Text style={[styles.settingsItemLabel, styles.dangerText]}>
                  Sign Out
                </Text>
              </View>
              <ChevronRight size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#f5f1e8', '#735510']}
            style={styles.profileHeader}
          >
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userProfile.images[0] }}
              style={styles.profileImage}
            />
            {/* <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userProfile.name}, {userProfile.age}
            </Text>

            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailText}>
                Trust Score: {userProfile.trustScore || 4}/5
              </Text>
            </View>

            <View style={styles.profileDetail}>
              <Briefcase size={16} color="#6B7280" />
              <Text style={styles.profileDetailText}>
                {userProfile.profession}
              </Text>
            </View>

            <View style={styles.profileDetail}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.profileDetailText}>
                {userProfile.location}
              </Text>
            </View>
          </View>

          {/* Profile Completion */}
          <View style={styles.completionSection}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Profile Completion</Text>
              <Text style={styles.completionPercentage}>
                {userProfile.profileCompletion}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${userProfile.profileCompletion}%` },
                ]}
              />
            </View>
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Complete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Edit size={16} color="#735510" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Verification Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            <Text style={styles.verificationLevel}>
              {getVerificationLevel()} Verified
            </Text>
          </View>

          <View style={styles.verificationList}>
            {verificationItems.map((item) => {
              const isVerified =
                userProfile.verificationStatus[
                  item.key as keyof typeof userProfile.verificationStatus
                ];
              const IconComponent = item.icon;

              return (
                <View key={item.key} style={styles.verificationItem}>
                  <IconComponent
                    size={20}
                    color={isVerified ? item.color : '#D1D5DB'}
                  />
                  <Text
                    style={[
                      styles.verificationLabel,
                      isVerified
                        ? styles.verifiedLabel
                        : styles.unverifiedLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {!isVerified && (
                    <TouchableOpacity style={styles.verifyButton}>
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>{userProfile.about}</Text>

          <TouchableOpacity style={styles.editAboutButton}>
            <Text style={styles.editAboutButtonText}>Edit About Me</Text>
          </TouchableOpacity>
        </View>

        {/* Ideal Housemate Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <Text style={styles.aboutText}>
            Someone who is clean, communicative, and enjoys occasional shared
            activities but also respects personal space. Ideally looking for a
            long-term living arrangement with someone who values a peaceful home
            environment.
          </Text>

          <TouchableOpacity style={styles.editAboutButton}>
            <Text style={styles.editAboutButtonText}>Edit Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {userProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleEditProfile}
          >
            <Edit size={20} color="#E07A5F" />
            <Text style={styles.quickActionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <Shield size={20} color="#A3B18A" />
            <Text style={styles.quickActionText}>Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <Help size={20} color="#6B7280" />
            <Text style={styles.quickActionText}>Help Center</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
  },
  settingsButton1: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileHeader: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: -40,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: '#735510',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  completionSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  completionPercentage: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#735510',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#735510',
    borderRadius: 4,
  },
  completeButton: {
    backgroundColor: '#f5f1e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#735510',
    marginTop: 8,
    gap: 6,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  verificationLevel: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#A3B18A',
  },
  verificationList: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  verificationLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginLeft: 12,
  },
  verifiedLabel: {
    color: '#1F2937',
  },
  unverifiedLabel: {
    color: '#6B7280',
  },
  verifyButton: {
    backgroundColor: '#735510',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifyButtonText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  editAboutButton: {
    backgroundColor: '#f5f1e8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editAboutButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
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
  quickActionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
    marginLeft: 12,
  },
  // Settings screen styles
  settingsHeader: {
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
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  saveButton: {
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  settingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dangerButton: {
    backgroundColor: 'transparent',
  },
  dangerText: {
    color: '#EF4444',
  },
  languageSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  languageOptionActive: {
    backgroundColor: '#735510',
  },
  languageOptionText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#6B7280',
  },
  languageOptionTextActive: {
    color: '#FFFFFF',
  },
});
