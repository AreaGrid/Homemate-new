/**
 * Validation utilities for verification system
 * Provides comprehensive validation functions with security considerations
 */

import { VERIFICATION_CONSTANTS, ERROR_CODES } from '../constants/verification';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}

/**
 * Phone number validation with international support
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: string = '+1'
): ValidationResult => {
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (!cleanNumber) {
    return {
      isValid: false,
      error: 'Phone number is required',
      code: ERROR_CODES.INVALID_PHONE,
    };
  }

  if (cleanNumber.length < VERIFICATION_CONSTANTS.MIN_PHONE_LENGTH) {
    return {
      isValid: false,
      error: 'Phone number is too short',
      code: ERROR_CODES.INVALID_PHONE,
    };
  }

  if (cleanNumber.length > VERIFICATION_CONSTANTS.MAX_PHONE_LENGTH) {
    return {
      isValid: false,
      error: 'Phone number is too long',
      code: ERROR_CODES.INVALID_PHONE,
    };
  }

  // Additional country-specific validation can be added here
  const fullNumber = `${countryCode}${cleanNumber}`;
  
  // Basic international format validation
  if (!/^\+\d{7,15}$/.test(fullNumber)) {
    return {
      isValid: false,
      error: 'Invalid phone number format',
      code: ERROR_CODES.INVALID_PHONE,
    };
  }

  return { isValid: true };
};

/**
 * Email validation with comprehensive checks
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email address is required',
      code: ERROR_CODES.INVALID_EMAIL,
    };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
      code: ERROR_CODES.INVALID_EMAIL,
    };
  }

  // Check for common email issues
  if (email.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long',
      code: ERROR_CODES.INVALID_EMAIL,
    };
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return {
      isValid: false,
      error: 'Invalid email format',
      code: ERROR_CODES.INVALID_EMAIL,
    };
  }

  // Check for valid characters
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!validEmailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Email contains invalid characters',
      code: ERROR_CODES.INVALID_EMAIL,
    };
  }

  return { isValid: true };
};

/**
 * OTP validation
 */
export const validateOTP = (otp: string): ValidationResult => {
  if (!otp) {
    return {
      isValid: false,
      error: 'Verification code is required',
      code: ERROR_CODES.INVALID_OTP,
    };
  }

  if (otp.length !== VERIFICATION_CONSTANTS.OTP_LENGTH) {
    return {
      isValid: false,
      error: `Verification code must be ${VERIFICATION_CONSTANTS.OTP_LENGTH} digits`,
      code: ERROR_CODES.INVALID_OTP,
    };
  }

  if (!/^\d+$/.test(otp)) {
    return {
      isValid: false,
      error: 'Verification code must contain only numbers',
      code: ERROR_CODES.INVALID_OTP,
    };
  }

  return { isValid: true };
};

/**
 * Document validation
 */
export const validateDocument = (
  documentType: string,
  frontImage?: string,
  backImage?: string
): ValidationResult => {
  if (!documentType) {
    return {
      isValid: false,
      error: 'Document type is required',
      code: ERROR_CODES.INVALID_DOCUMENT,
    };
  }

  if (!frontImage) {
    return {
      isValid: false,
      error: 'Front image of document is required',
      code: ERROR_CODES.INVALID_DOCUMENT,
    };
  }

  // Validate image format (basic check)
  const supportedFormats = VERIFICATION_CONSTANTS.SUPPORTED_IMAGE_FORMATS;
  const frontImageExt = frontImage.split('.').pop()?.toLowerCase();
  
  if (!frontImageExt || !supportedFormats.includes(frontImageExt)) {
    return {
      isValid: false,
      error: `Unsupported image format. Please use: ${supportedFormats.join(', ')}`,
      code: ERROR_CODES.INVALID_DOCUMENT,
    };
  }

  // Validate back image if provided
  if (backImage) {
    const backImageExt = backImage.split('.').pop()?.toLowerCase();
    if (!backImageExt || !supportedFormats.includes(backImageExt)) {
      return {
        isValid: false,
        error: `Unsupported back image format. Please use: ${supportedFormats.join(', ')}`,
        code: ERROR_CODES.INVALID_DOCUMENT,
      };
    }
  }

  return { isValid: true };
};

/**
 * Image quality validation
 */
export const validateImageQuality = (imageUri: string): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    // This would typically involve checking image dimensions, file size, etc.
    // For now, we'll do basic validation
    
    if (!imageUri) {
      resolve({
        isValid: false,
        error: 'Image is required',
        code: ERROR_CODES.INVALID_DOCUMENT,
      });
      return;
    }

    // In a real implementation, you would:
    // 1. Check image dimensions (minimum resolution)
    // 2. Check file size
    // 3. Analyze image quality/clarity
    // 4. Check for blur detection
    // 5. Validate image is not corrupted

    resolve({ isValid: true });
  });
};

/**
 * Input sanitization for security
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[\\]/g, '') // Remove backslashes
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Rate limiting validation
 */
export const validateRateLimit = (
  attempts: number,
  maxAttempts: number,
  timeWindow: number,
  lastAttempt: number
): ValidationResult => {
  const now = Date.now();
  const timeSinceLastAttempt = now - lastAttempt;

  if (attempts >= maxAttempts && timeSinceLastAttempt < timeWindow) {
    const remainingTime = Math.ceil((timeWindow - timeSinceLastAttempt) / 1000 / 60);
    return {
      isValid: false,
      error: `Too many attempts. Please try again in ${remainingTime} minutes.`,
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    };
  }

  return { isValid: true };
};

/**
 * Session validation
 */
export const validateSession = (
  sessionId: string,
  createdAt: number,
  maxAge: number = VERIFICATION_CONSTANTS.SESSION_TIMEOUT
): ValidationResult => {
  if (!sessionId) {
    return {
      isValid: false,
      error: 'Invalid session',
      code: ERROR_CODES.SESSION_EXPIRED,
    };
  }

  const now = Date.now();
  const sessionAge = now - createdAt;

  if (sessionAge > maxAge) {
    return {
      isValid: false,
      error: 'Session has expired',
      code: ERROR_CODES.SESSION_EXPIRED,
    };
  }

  return { isValid: true };
};

/**
 * Comprehensive verification state validation
 */
export const validateVerificationState = (state: any): ValidationResult => {
  if (!state) {
    return {
      isValid: false,
      error: 'Verification state is required',
    };
  }

  // Validate phone verification
  if (!state.phone?.isVerified) {
    return {
      isValid: false,
      error: 'Phone verification is incomplete',
    };
  }

  // Validate email verification
  if (!state.email?.isVerified) {
    return {
      isValid: false,
      error: 'Email verification is incomplete',
    };
  }

  // Validate document verification
  if (!state.document?.isVerified) {
    return {
      isValid: false,
      error: 'Document verification is incomplete',
    };
  }

  return { isValid: true };
};