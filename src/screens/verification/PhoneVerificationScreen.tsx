/**
 * Phone Verification Screen
 * Handles phone number input and OTP verification with country code selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { ChevronDown, Phone } from 'lucide-react-native';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { OTPInput } from '../../components/verification/OTPInput';
import { ProgressIndicator } from '../../components/verification/ProgressIndicator';
import { useVerification } from '../../hooks/useVerification';
import { PhoneFormData } from '../../types/verification';
import { VERIFICATION_CONSTANTS } from '../../constants/verification';

// Validation schema
const phoneSchema = yup.object().shape({
  countryCode: yup.string().required('Country code is required'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .min(VERIFICATION_CONSTANTS.MIN_PHONE_LENGTH, 'Phone number is too short')
    .max(VERIFICATION_CONSTANTS.MAX_PHONE_LENGTH, 'Phone number is too long')
    .matches(/^\d+$/, 'Phone number must contain only digits'),
  otpCode: yup
    .string()
    .length(VERIFICATION_CONSTANTS.OTP_LENGTH, `OTP must be ${VERIFICATION_CONSTANTS.OTP_LENGTH} digits`),
});

export const PhoneVerificationScreen: React.FC = () => {
  const {
    verificationState,
    sendPhoneVerification,
    verifyPhoneCode,
    resendOTP,
    otpTimer,
    canResendOTP,
    validatePhoneNumber,
    validateOTP,
  } = useVerification();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    cca2: 'US',
    callingCode: ['1'],
    name: 'United States',
  } as Country);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<PhoneFormData>({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      countryCode: `+${selectedCountry.callingCode[0]}`,
      phoneNumber: '',
      otpCode: '',
    },
    mode: 'onChange',
  });

  const watchedPhoneNumber = watch('phoneNumber');

  // Update country code when country changes
  useEffect(() => {
    setValue('countryCode', `+${selectedCountry.callingCode[0]}`);
  }, [selectedCountry, setValue]);

  // Progress steps
  const steps = [
    { id: 1, title: 'Phone', completed: verificationState.phone.isVerified, active: true },
    { id: 2, title: 'Email', completed: verificationState.email.isVerified, active: false },
    { id: 3, title: 'Document', completed: verificationState.document.isVerified, active: false },
    { id: 4, title: 'Review', completed: verificationState.isCompleted, active: false },
  ];

  const handleSendOTP = async (data: PhoneFormData) => {
    if (!validatePhoneNumber(data.phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    const result = await sendPhoneVerification(data.phoneNumber, data.countryCode);
    if (result.success) {
      setOtpSent(true);
      Alert.alert(
        'OTP Sent',
        `We've sent a verification code to ${data.countryCode} ${data.phoneNumber}`
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP(otpCode)) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit code');
      return;
    }

    const result = await verifyPhoneCode(otpCode);
    if (result.success) {
      Alert.alert('Success', 'Phone number verified successfully!');
      // Navigation will be handled by the verification hook
    }
  };

  const handleResendOTP = async () => {
    const result = await resendOTP('phone');
    if (result.success) {
      Alert.alert('OTP Resent', 'A new verification code has been sent');
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  const handleOTPComplete = (code: string) => {
    setOtpCode(code);
    setValue('otpCode', code);
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Indicator */}
          <ProgressIndicator steps={steps} />

          {/* Header */}
          <View style={styles.header}>
            <Phone size={48} color="#735510" />
            <Text style={styles.title}>Verify Your Phone Number</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? 'Enter the verification code sent to your phone'
                : 'We\'ll send you a verification code to confirm your number'}
            </Text>
          </View>

          {!otpSent ? (
            /* Phone Number Input */
            <View style={styles.form}>
              <View style={styles.phoneInputContainer}>
                <Button
                  title={`${selectedCountry.flag} ${selectedCountry.callingCode[0]}`}
                  onPress={() => setShowCountryPicker(true)}
                  variant="outline"
                  style={styles.countryButton}
                  textStyle={styles.countryButtonText}
                />
                
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Phone number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={errors.phoneNumber?.message}
                      containerStyle={styles.phoneInput}
                      autoComplete="tel"
                      textContentType="telephoneNumber"
                    />
                  )}
                />
              </View>

              <Button
                title="Send Verification Code"
                onPress={handleSubmit(handleSendOTP)}
                loading={verificationState.isLoading}
                disabled={!watchedPhoneNumber || !isValid}
                style={styles.sendButton}
              />
            </View>
          ) : (
            /* OTP Input */
            <View style={styles.otpContainer}>
              <OTPInput
                length={VERIFICATION_CONSTANTS.OTP_LENGTH}
                onComplete={handleOTPComplete}
                onCodeChange={setOtpCode}
                style={styles.otpInput}
              />

              <View style={styles.otpActions}>
                <Button
                  title="Verify Code"
                  onPress={handleVerifyOTP}
                  loading={verificationState.isLoading}
                  disabled={!validateOTP(otpCode)}
                  style={styles.verifyButton}
                />

                <View style={styles.resendContainer}>
                  {otpTimer > 0 ? (
                    <Text style={styles.timerText}>
                      Resend code in {formatTimer(otpTimer)}
                    </Text>
                  ) : (
                    <Button
                      title="Resend Code"
                      onPress={handleResendOTP}
                      variant="ghost"
                      disabled={!canResendOTP}
                    />
                  )}
                </View>
              </View>

              <Button
                title="Change Phone Number"
                onPress={() => setOtpSent(false)}
                variant="ghost"
                style={styles.changeNumberButton}
              />
            </View>
          )}

          {/* Error Display */}
          {verificationState.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{verificationState.error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Country Picker Modal */}
        <CountryPicker
          visible={showCountryPicker}
          onSelect={handleCountrySelect}
          onClose={() => setShowCountryPicker(false)}
          withFilter
          withFlag
          withCallingCode
          withEmoji
          countryCode={selectedCountry.cca2}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  title: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  form: {
    marginBottom: 32,
  },
  
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  
  countryButton: {
    minWidth: 100,
    paddingHorizontal: 12,
  },
  
  countryButtonText: {
    fontSize: 16,
  },
  
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  
  sendButton: {
    marginTop: 8,
  },
  
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  otpInput: {
    marginBottom: 32,
  },
  
  otpActions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  
  verifyButton: {
    width: '100%',
  },
  
  resendContainer: {
    alignItems: 'center',
  },
  
  timerText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  
  changeNumberButton: {
    marginTop: 16,
  },
  
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  
  errorText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#EF4444',
    textAlign: 'center',
  },
});