/**
 * Custom hook for verification logic
 * Provides reusable verification functionality across components
 */

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { RootState, AppDispatch } from '../store';
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP,
  uploadDocument,
  submitVerification,
  setPhoneData,
  setEmailData,
  setDocumentData,
  nextStep,
  previousStep,
  clearError,
} from '../store/slices/verificationSlice';
import { VERIFICATION_CONSTANTS } from '../constants/verification';

export const useVerification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const verificationState = useSelector((state: RootState) => state.verification);
  
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);

  // OTP Timer management
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  // Phone verification methods
  const sendPhoneVerification = useCallback(async (phoneNumber: string, countryCode: string) => {
    try {
      dispatch(setPhoneData({ phoneNumber, countryCode, fullPhoneNumber: `${countryCode}${phoneNumber}` }));
      await dispatch(sendPhoneOTP({ phoneNumber, countryCode })).unwrap();
      
      setOtpTimer(VERIFICATION_CONSTANTS.OTP_RESEND_COOLDOWN);
      setCanResendOTP(false);
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send phone verification');
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const verifyPhoneCode = useCallback(async (otpCode: string) => {
    if (!verificationState.phone.verificationId) {
      Alert.alert('Error', 'No verification ID found. Please request a new code.');
      return { success: false };
    }

    try {
      await dispatch(verifyPhoneOTP({ 
        otpCode, 
        verificationId: verificationState.phone.verificationId 
      })).unwrap();
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
      return { success: false, error: error.message };
    }
  }, [dispatch, verificationState.phone.verificationId]);

  // Email verification methods
  const sendEmailVerification = useCallback(async (email: string) => {
    try {
      dispatch(setEmailData({ email }));
      await dispatch(sendEmailOTP({ email })).unwrap();
      
      setOtpTimer(VERIFICATION_CONSTANTS.OTP_RESEND_COOLDOWN);
      setCanResendOTP(false);
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send email verification');
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const verifyEmailCode = useCallback(async (otpCode: string) => {
    if (!verificationState.email.verificationId) {
      Alert.alert('Error', 'No verification ID found. Please request a new code.');
      return { success: false };
    }

    try {
      await dispatch(verifyEmailOTP({ 
        otpCode, 
        verificationId: verificationState.email.verificationId 
      })).unwrap();
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
      return { success: false, error: error.message };
    }
  }, [dispatch, verificationState.email.verificationId]);

  // Document verification methods
  const uploadDocumentImages = useCallback(async (
    documentType: string,
    frontImage: string,
    backImage?: string
  ) => {
    try {
      await dispatch(uploadDocument({ documentType, frontImage, backImage })).unwrap();
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Document upload failed');
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Final submission
  const submitFinalVerification = useCallback(async () => {
    try {
      await dispatch(submitVerification()).unwrap();
      return { success: true };
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification submission failed');
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Navigation helpers
  const goToNextStep = useCallback(() => {
    dispatch(nextStep());
  }, [dispatch]);

  const goToPreviousStep = useCallback(() => {
    dispatch(previousStep());
  }, [dispatch]);

  // Error handling
  const clearVerificationError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Resend OTP
  const resendOTP = useCallback(async (type: 'phone' | 'email') => {
    if (!canResendOTP) {
      Alert.alert('Please Wait', `You can resend the code in ${otpTimer} seconds`);
      return { success: false };
    }

    try {
      if (type === 'phone') {
        await sendPhoneVerification(
          verificationState.phone.phoneNumber,
          verificationState.phone.countryCode
        );
      } else {
        await sendEmailVerification(verificationState.email.email);
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [canResendOTP, otpTimer, sendPhoneVerification, sendEmailVerification, verificationState]);

  // Validation helpers
  const validatePhoneNumber = useCallback((phoneNumber: string): boolean => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.length >= VERIFICATION_CONSTANTS.MIN_PHONE_LENGTH && 
           cleanNumber.length <= VERIFICATION_CONSTANTS.MAX_PHONE_LENGTH;
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateOTP = useCallback((otp: string): boolean => {
    return otp.length === VERIFICATION_CONSTANTS.OTP_LENGTH && /^\d+$/.test(otp);
  }, []);

  return {
    // State
    verificationState,
    otpTimer,
    canResendOTP,
    
    // Phone verification
    sendPhoneVerification,
    verifyPhoneCode,
    
    // Email verification
    sendEmailVerification,
    verifyEmailCode,
    
    // Document verification
    uploadDocumentImages,
    
    // Final submission
    submitFinalVerification,
    
    // Navigation
    goToNextStep,
    goToPreviousStep,
    
    // Utilities
    resendOTP,
    clearVerificationError,
    validatePhoneNumber,
    validateEmail,
    validateOTP,
  };
};