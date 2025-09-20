/**
 * Email Verification Screen
 * Handles email input and OTP verification with proper validation
 */

import React, { useState } from 'react';
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
import { Mail } from 'lucide-react-native';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { OTPInput } from '../../components/verification/OTPInput';
import { ProgressIndicator } from '../../components/verification/ProgressIndicator';
import { useVerification } from '../../hooks/useVerification';
import { EmailFormData } from '../../types/verification';
import { VERIFICATION_CONSTANTS } from '../../constants/verification';

// Validation schema
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  otpCode: yup
    .string()
    .length(VERIFICATION_CONSTANTS.OTP_LENGTH, `OTP must be ${VERIFICATION_CONSTANTS.OTP_LENGTH} digits`),
});

export const EmailVerificationScreen: React.FC = () => {
  const {
    verificationState,
    sendEmailVerification,
    verifyEmailCode,
    resendOTP,
    otpTimer,
    canResendOTP,
    validateEmail,
    validateOTP,
    goToPreviousStep,
  } = useVerification();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: verificationState.email.email || '',
      otpCode: '',
    },
    mode: 'onChange',
  });

  const watchedEmail = watch('email');

  // Progress steps
  const steps = [
    { id: 1, title: 'Phone', completed: verificationState.phone.isVerified, active: false },
    { id: 2, title: 'Email', completed: verificationState.email.isVerified, active: true },
    { id: 3, title: 'Document', completed: verificationState.document.isVerified, active: false },
    { id: 4, title: 'Review', completed: verificationState.isCompleted, active: false },
  ];

  const handleSendOTP = async (data: EmailFormData) => {
    if (!validateEmail(data.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    const result = await sendEmailVerification(data.email);
    if (result.success) {
      setOtpSent(true);
      Alert.alert(
        'OTP Sent',
        `We've sent a verification code to ${data.email}. Please check your inbox and spam folder.`
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP(otpCode)) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit code');
      return;
    }

    const result = await verifyEmailCode(otpCode);
    if (result.success) {
      Alert.alert('Success', 'Email address verified successfully!');
      // Navigation will be handled by the verification hook
    }
  };

  const handleResendOTP = async () => {
    const result = await resendOTP('email');
    if (result.success) {
      Alert.alert('OTP Resent', 'A new verification code has been sent to your email');
    }
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
            <Mail size={48} color="#735510" />
            <Text style={styles.title}>Verify Your Email Address</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? 'Enter the verification code sent to your email'
                : 'We\'ll send you a verification code to confirm your email address'}
            </Text>
          </View>

          {!otpSent ? (
            /* Email Input */
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    error={errors.email?.message}
                    leftIcon={<Mail size={20} color="#6B7280" />}
                    required
                  />
                )}
              />

              <Button
                title="Send Verification Code"
                onPress={handleSubmit(handleSendOTP)}
                loading={verificationState.isLoading}
                disabled={!watchedEmail || !isValid}
                style={styles.sendButton}
              />
            </View>
          ) : (
            /* OTP Input */
            <View style={styles.otpContainer}>
              <View style={styles.emailDisplay}>
                <Text style={styles.emailDisplayLabel}>Verification code sent to:</Text>
                <Text style={styles.emailDisplayValue}>{watchedEmail}</Text>
              </View>

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
                title="Change Email Address"
                onPress={() => setOtpSent(false)}
                variant="ghost"
                style={styles.changeEmailButton}
              />
            </View>
          )}

          {/* Error Display */}
          {verificationState.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{verificationState.error}</Text>
            </View>
          )}

          {/* Navigation */}
          <View style={styles.navigation}>
            <Button
              title="Back"
              onPress={goToPreviousStep}
              variant="outline"
              style={styles.backButton}
            />
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Didn't receive the code?</Text>
            <Text style={styles.helpText}>
              • Check your spam/junk folder{'\n'}
              • Make sure the email address is correct{'\n'}
              • Wait a few minutes for delivery{'\n'}
              • Try resending the code
            </Text>
          </View>
        </ScrollView>
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
  
  sendButton: {
    marginTop: 8,
  },
  
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  emailDisplay: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    width: '100%',
  },
  
  emailDisplayLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  
  emailDisplayValue: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
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
  
  changeEmailButton: {
    marginTop: 16,
  },
  
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  
  errorText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#EF4444',
    textAlign: 'center',
  },
  
  navigation: {
    marginBottom: 24,
  },
  
  backButton: {
    width: '100%',
  },
  
  helpContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  helpText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});