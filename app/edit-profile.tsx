import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Camera,
  Upload,
  Save,
  X,
  Eye,
  EyeOff,
  MapPin,
  Briefcase,
  User,
  Mail,
  Phone,
  Lock,
  Info,
  Check,
  CircleAlert as AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';

const { width } = Dimensions.get('window');

// Validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits'),
  profession: yup.string().required('Profession is required'),
  location: yup.string().required('Location is required'),
  about: yup
    .string()
    .max(500, 'About section cannot exceed 500 characters')
    .required(),
  idealHousemate: yup
    .string()
    .required('Ideal housemate description is required'),
  profileImage: yup.string().required('Profile image is required'),
  interests: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Interests are required')
    .max(10)
    .required(),
});

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  about: string;
  idealHousemate: string;
  profileImage: string;
  interests: string[];
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  expanded: boolean;
}

const initialProfileData: ProfileFormData = {
  firstName: 'Alex',
  lastName: 'Thompson',
  email: 'alex.thompson@email.com',
  phone: '+31 6 12345678',
  profession: 'Product Manager',
  location: 'Amsterdam, Netherlands',
  about:
    'Love cooking, yoga, and movie nights. Looking for a clean, respectful housemate who enjoys good conversation and values a peaceful home environment.',
  idealHousemate:
    'Someone who is clean, communicative, and enjoys occasional shared activities but also respects personal space. Ideally looking for a long-term living arrangement.',
  profileImage:
    'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
  interests: ['Cooking', 'Yoga', 'Reading', 'Hiking', 'Tech', 'Travel'],
};

const availableInterests = [
  'Cooking',
  'Yoga',
  'Reading',
  'Hiking',
  'Tech',
  'Travel',
  'Photography',
  'Music',
  'Art',
  'Sports',
  'Gaming',
  'Dancing',
  'Movies',
  'Gardening',
  'Fitness',
  'Languages',
  'Volunteering',
  'Pets',
  'Fashion',
  'Writing',
];

export default function EditProfileScreen() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      expanded: true,
    },
    { id: 'contact', title: 'Contact Details', icon: Mail, expanded: false },
    {
      id: 'professional',
      title: 'Professional Info',
      icon: Briefcase,
      expanded: false,
    },
    { id: 'about', title: 'About & Preferences', icon: Info, expanded: false },
    { id: 'privacy', title: 'Privacy Settings', icon: Lock, expanded: false },
  ]);

  const [profileImage, setProfileImage] = useState(
    initialProfileData.profileImage
  );
  const [selectedInterests, setSelectedInterests] = useState(
    initialProfileData.interests
  );
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: initialProfileData,
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      setHasUnsavedChanges(true);

      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [watchedValues, isDirty]);

  const handleAutoSave = async () => {
    if (!isValid) return;

    setAutoSaveStatus('saving');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
      setHasUnsavedChanges(false);

      // Reset status after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload a profile picture.'
      );
      return;
    }

    Alert.alert(
      'Select Profile Picture',
      "Choose how you'd like to add your profile picture",
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openImageLibrary() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setIsUploading(true);

    try {
      // Simulate image upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProfileImage(uri);
      setHasUnsavedChanges(true);
    } catch (error) {
      Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];

      setValue('interests', newInterests);
      return newInterests;
    });
  };

  const handleSave = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated!',
        [{ text: 'OK', onPress: () => router.back() }]
      );

      setHasUnsavedChanges(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleRevert = () => {
    Alert.alert(
      'Revert Changes',
      'This will undo all unsaved changes. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revert',
          style: 'destructive',
          onPress: () => {
            reset(initialProfileData);
            setProfileImage(initialProfileData.profileImage);
            setSelectedInterests(initialProfileData.interests);
            setHasUnsavedChanges(false);
          },
        },
      ]
    );
  };

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <View style={styles.autoSaveIndicator}>
            <ActivityIndicator size="small" color="#735510" />
            <Text style={styles.autoSaveText}>Saving...</Text>
          </View>
        );
      case 'saved':
        return (
          <View style={styles.autoSaveIndicator}>
            <Check size={16} color="#10B981" />
            <Text style={[styles.autoSaveText, { color: '#10B981' }]}>
              Saved
            </Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.autoSaveIndicator}>
            <AlertCircle size={16} color="#EF4444" />
            <Text style={[styles.autoSaveText, { color: '#EF4444' }]}>
              Error saving
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderSection = (section: Section) => {
    const IconComponent = section.icon;

    return (
      <View key={section.id} style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
          accessibilityRole="button"
          accessibilityLabel={`${section.expanded ? 'Collapse' : 'Expand'} ${
            section.title
          } section`}
        >
          <View style={styles.sectionHeaderLeft}>
            <IconComponent size={20} color="#735510" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {section.expanded ? (
            <ChevronUp size={20} color="#6B7280" />
          ) : (
            <ChevronDown size={20} color="#6B7280" />
          )}
        </TouchableOpacity>

        {section.expanded && (
          <View style={styles.sectionContent}>
            {renderSectionFields(section.id)}
          </View>
        )}
      </View>
    );
  };

  const renderSectionFields = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return (
          <>
            {/* Profile Picture */}
            <View style={styles.profileImageSection}>
              <Text style={styles.fieldLabel}>Profile Picture</Text>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  style={styles.profileImageWrapper}
                  onPress={handleImagePicker}
                  disabled={isUploading}
                  accessibilityRole="button"
                  accessibilityLabel="Change profile picture"
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <User size={40} color="#9CA3AF" />
                    </View>
                  )}

                  <View style={styles.profileImageOverlay}>
                    {isUploading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Camera size={20} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.profileImageActions}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleImagePicker}
                    disabled={isUploading}
                  >
                    <Upload size={16} color="#735510" />
                    <Text style={styles.uploadButtonText}>
                      {isUploading ? 'Uploading...' : 'Change Photo'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Name Fields */}
            <View style={styles.fieldRow}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    containerStyle={styles.halfField}
                    required
                    accessibilityLabel="First name"
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    containerStyle={styles.halfField}
                    required
                    accessibilityLabel="Last name"
                  />
                )}
              />
            </View>
          </>
        );

      case 'contact':
        return (
          <>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  leftIcon={<Mail size={20} color="#6B7280" />}
                  required
                  accessibilityLabel="Email address"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                  leftIcon={<Phone size={20} color="#6B7280" />}
                  required
                  accessibilityLabel="Phone number"
                />
              )}
            />
          </>
        );

      case 'professional':
        return (
          <>
            <Controller
              control={control}
              name="profession"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Profession"
                  placeholder="Enter your profession"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.profession?.message}
                  leftIcon={<Briefcase size={20} color="#6B7280" />}
                  required
                  accessibilityLabel="Profession"
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Location"
                  placeholder="Enter your location"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.location?.message}
                  leftIcon={<MapPin size={20} color="#6B7280" />}
                  required
                  accessibilityLabel="Location"
                />
              )}
            />
          </>
        );

      case 'about':
        return (
          <>
            <Controller
              control={control}
              name="about"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.textAreaContainer}>
                  <Text style={styles.fieldLabel}>About Me</Text>
                  <Input
                    placeholder="Tell others about yourself..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={4}
                    error={errors.about?.message}
                    helperText={`${value?.length || 0}/500 characters`}
                    accessibilityLabel="About me description"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="idealHousemate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.textAreaContainer}>
                  <Text style={styles.fieldLabel}>Ideal Housemate</Text>
                  <Input
                    placeholder="Describe your ideal housemate..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={4}
                    error={errors.idealHousemate?.message}
                    helperText={`${value?.length || 0}/500 characters`}
                    accessibilityLabel="Ideal housemate description"
                  />
                </View>
              )}
            />

            {/* Interests */}
            <View style={styles.interestsContainer}>
              <Text style={styles.fieldLabel}>Interests</Text>
              <Text style={styles.fieldHelper}>
                Select up to 10 interests that describe you
              </Text>
              <View style={styles.interestsGrid}>
                {availableInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestTag,
                      selectedInterests.includes(interest) &&
                        styles.interestTagSelected,
                    ]}
                    onPress={() => toggleInterest(interest)}
                    disabled={
                      !selectedInterests.includes(interest) &&
                      selectedInterests.length >= 10
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${
                      selectedInterests.includes(interest) ? 'Remove' : 'Add'
                    } ${interest} interest`}
                  >
                    <Text
                      style={[
                        styles.interestTagText,
                        selectedInterests.includes(interest) &&
                          styles.interestTagTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.interestsCount}>
                {selectedInterests.length}/10 selected
              </Text>
            </View>
          </>
        );

      case 'privacy':
        return (
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyTitle}>Profile Visibility</Text>
            <Text style={styles.privacyDescription}>
              Control who can see your profile and contact information
            </Text>

            <View style={styles.privacyOptions}>
              <TouchableOpacity style={styles.privacyOption}>
                <View style={styles.privacyOptionLeft}>
                  <Text style={styles.privacyOptionTitle}>Public Profile</Text>
                  <Text style={styles.privacyOptionDescription}>
                    Anyone can view your profile
                  </Text>
                </View>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonSelected} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.privacyOption}>
                <View style={styles.privacyOptionLeft}>
                  <Text style={styles.privacyOptionTitle}>
                    Verified Users Only
                  </Text>
                  <Text style={styles.privacyOptionDescription}>
                    Only verified users can view your profile
                  </Text>
                </View>
                <View style={styles.radioButton} />
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            {getAutoSaveIndicator()}
          </View>

          <View style={styles.headerRight}>
            {hasUnsavedChanges && (
              <TouchableOpacity
                style={styles.revertButton}
                onPress={handleRevert}
                accessibilityRole="button"
                accessibilityLabel="Revert changes"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Profile</Text>
          <Text style={styles.breadcrumbSeparator}> › </Text>
          <Text style={styles.breadcrumbCurrent}>Edit Profile</Text>
        </View>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {sections.map(renderSection)}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
            accessibilityLabel="Cancel editing"
          />

          <Button
            title="Save Changes"
            onPress={handleSubmit(handleSave)}
            loading={autoSaveStatus === 'saving'}
            disabled={!isValid || !hasUnsavedChanges}
            style={styles.saveButton}
            accessibilityLabel="Save profile changes"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  revertButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoSaveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  autoSaveText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#735510',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  breadcrumbText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#9CA3AF',
  },
  breadcrumbCurrent: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  sectionContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  fieldHelper: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  profileImageSection: {
    marginBottom: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  profileImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    backgroundColor: '#735510',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImageActions: {
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f1e8',
    borderRadius: 20,
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  interestsContainer: {
    marginTop: 8,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  interestTagSelected: {
    backgroundColor: '#f5f1e8',
    borderColor: '#735510',
  },
  interestTagText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#6B7280',
  },
  interestTagTextSelected: {
    color: '#735510',
  },
  interestsCount: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  privacyContainer: {
    gap: 16,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  privacyDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  privacyOptionLeft: {
    flex: 1,
  },
  privacyOptionTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  privacyOptionDescription: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#735510',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
