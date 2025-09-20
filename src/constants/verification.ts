/**
 * Constants for the verification system
 * Centralized configuration for timeouts, limits, and validation rules
 */

export const VERIFICATION_CONSTANTS = {
  // OTP Configuration
  OTP_LENGTH: 6,
  OTP_EXPIRY_TIME: 300, // 5 minutes in seconds
  OTP_RESEND_COOLDOWN: 60, // 1 minute in seconds
  MAX_OTP_ATTEMPTS: 3,
  
  // Rate Limiting
  MAX_PHONE_REQUESTS_PER_HOUR: 5,
  MAX_EMAIL_REQUESTS_PER_HOUR: 5,
  
  // Image Upload
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png'],
  IMAGE_QUALITY: 0.8,
  
  // Session Management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Validation
  MIN_PHONE_LENGTH: 7,
  MAX_PHONE_LENGTH: 15,
  
  // Storage Keys
  STORAGE_KEYS: {
    VERIFICATION_STATE: '@verification_state',
    SESSION_ID: '@session_id',
    PHONE_DATA: '@phone_verification',
    EMAIL_DATA: '@email_verification',
    DOCUMENT_DATA: '@document_verification',
  },
} as const;

export const DOCUMENT_TYPES = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'International passport document',
    requiredFields: ['documentNumber', 'expiryDate', 'fullName', 'dateOfBirth'],
  },
  {
    id: 'drivers_license',
    name: 'Driver\'s License',
    description: 'Government-issued driver\'s license',
    requiredFields: ['documentNumber', 'expiryDate', 'fullName', 'dateOfBirth'],
  },
  {
    id: 'national_id',
    name: 'National ID',
    description: 'Government-issued national identification',
    requiredFields: ['documentNumber', 'fullName', 'dateOfBirth'],
  },
] as const;

export const ERROR_CODES = {
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Validation Errors
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_OTP: 'INVALID_OTP',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Document Errors
  INVALID_DOCUMENT: 'INVALID_DOCUMENT',
  POOR_IMAGE_QUALITY: 'POOR_IMAGE_QUALITY',
  
  // Session Errors
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export const SUCCESS_MESSAGES = {
  PHONE_VERIFIED: 'Phone number verified successfully',
  EMAIL_VERIFIED: 'Email address verified successfully',
  DOCUMENT_VERIFIED: 'Document verified successfully',
  VERIFICATION_COMPLETE: 'Verification process completed successfully',
} as const;