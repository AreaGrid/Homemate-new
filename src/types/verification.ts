/**
 * TypeScript interfaces for the verification system
 * Provides type safety across all verification components
 */

export interface PhoneVerificationData {
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  isVerified: boolean;
  otpCode?: string;
  verificationId?: string;
}

export interface EmailVerificationData {
  email: string;
  isVerified: boolean;
  otpCode?: string;
  verificationId?: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  requiredFields: string[];
}

export interface DocumentVerificationData {
  documentType: DocumentType;
  frontImage?: string;
  backImage?: string;
  isVerified: boolean;
  extractedData?: {
    documentNumber?: string;
    expiryDate?: string;
    fullName?: string;
    dateOfBirth?: string;
  };
}

export interface VerificationState {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;
  phone: PhoneVerificationData;
  email: EmailVerificationData;
  document: DocumentVerificationData;
  isCompleted: boolean;
  sessionId: string;
}

export interface OTPResponse {
  success: boolean;
  verificationId: string;
  expiresIn: number;
  message: string;
}

export interface VerificationResponse {
  success: boolean;
  isValid: boolean;
  message: string;
  data?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Navigation types
export type VerificationStackParamList = {
  PhoneVerification: undefined;
  EmailVerification: undefined;
  DocumentVerification: undefined;
  ReviewInformation: undefined;
  VerificationSuccess: undefined;
};

// Form validation schemas
export interface PhoneFormData {
  countryCode: string;
  phoneNumber: string;
  otpCode: string;
}

export interface EmailFormData {
  email: string;
  otpCode: string;
}

export interface DocumentFormData {
  documentType: string;
  frontImage: string;
  backImage?: string;
}