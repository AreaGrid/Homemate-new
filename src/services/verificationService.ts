/**
 * Verification service layer for API communication
 * Handles all verification-related API calls with proper error handling
 */

import { 
  OTPResponse, 
  VerificationResponse, 
  ApiError, 
  VerificationState 
} from '../types/verification';
import { VERIFICATION_CONSTANTS, ERROR_CODES } from '../constants/verification';

class VerificationService {
  private baseURL = 'https://api.yourapp.com/v1/verification';
  private timeout = 10000; // 10 seconds

  /**
   * Generic API call wrapper with error handling
   */
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          code: errorData.code || ERROR_CODES.NETWORK_ERROR,
          message: errorData.message || 'Network request failed',
          details: errorData,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw {
          code: ERROR_CODES.TIMEOUT_ERROR,
          message: 'Request timed out',
        } as ApiError;
      }
      
      throw error;
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendPhoneOTP(phoneNumber: string, countryCode: string): Promise<OTPResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (phoneNumber.length < VERIFICATION_CONSTANTS.MIN_PHONE_LENGTH) {
          reject({
            code: ERROR_CODES.INVALID_PHONE,
            message: 'Invalid phone number format',
          } as ApiError);
          return;
        }

        resolve({
          success: true,
          verificationId: `phone_${Date.now()}`,
          expiresIn: VERIFICATION_CONSTANTS.OTP_EXPIRY_TIME,
          message: 'OTP sent successfully',
        });
      }, 1000);
    });
  }

  /**
   * Verify phone OTP
   */
  async verifyPhoneOTP(otpCode: string, verificationId: string): Promise<VerificationResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otpCode.length !== VERIFICATION_CONSTANTS.OTP_LENGTH) {
          reject({
            code: ERROR_CODES.INVALID_OTP,
            message: 'Invalid OTP format',
          } as ApiError);
          return;
        }

        // Mock validation - in real app, this would be server-side
        const isValid = otpCode === '123456'; // Mock valid OTP

        resolve({
          success: true,
          isValid,
          message: isValid ? 'Phone verified successfully' : 'Invalid OTP code',
        });
      }, 1000);
    });
  }

  /**
   * Send OTP to email address
   */
  async sendEmailOTP(email: string): Promise<OTPResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          reject({
            code: ERROR_CODES.INVALID_EMAIL,
            message: 'Invalid email format',
          } as ApiError);
          return;
        }

        resolve({
          success: true,
          verificationId: `email_${Date.now()}`,
          expiresIn: VERIFICATION_CONSTANTS.OTP_EXPIRY_TIME,
          message: 'Email OTP sent successfully',
        });
      }, 1000);
    });
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOTP(otpCode: string, verificationId: string): Promise<VerificationResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otpCode.length !== VERIFICATION_CONSTANTS.OTP_LENGTH) {
          reject({
            code: ERROR_CODES.INVALID_OTP,
            message: 'Invalid OTP format',
          } as ApiError);
          return;
        }

        // Mock validation
        const isValid = otpCode === '654321'; // Mock valid email OTP

        resolve({
          success: true,
          isValid,
          message: isValid ? 'Email verified successfully' : 'Invalid OTP code',
        });
      }, 1000);
    });
  }

  /**
   * Upload and verify document
   */
  async uploadDocument(
    documentType: string,
    frontImage: string,
    backImage?: string
  ): Promise<VerificationResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!frontImage) {
          reject({
            code: ERROR_CODES.INVALID_DOCUMENT,
            message: 'Front image is required',
          } as ApiError);
          return;
        }

        // Mock document processing
        resolve({
          success: true,
          isValid: true,
          message: 'Document verified successfully',
          data: {
            documentNumber: 'ABC123456',
            expiryDate: '2030-12-31',
            fullName: 'John Doe',
            dateOfBirth: '1990-01-01',
          },
        });
      }, 3000); // Longer timeout to simulate document processing
    });
  }

  /**
   * Submit final verification
   */
  async submitVerification(verificationData: VerificationState): Promise<VerificationResponse> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!verificationData.phone.isVerified || 
            !verificationData.email.isVerified || 
            !verificationData.document.isVerified) {
          reject({
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'All verification steps must be completed',
          } as ApiError);
          return;
        }

        resolve({
          success: true,
          isValid: true,
          message: 'Verification completed successfully',
          data: {
            verificationId: `verification_${Date.now()}`,
            status: 'verified',
            completedAt: new Date().toISOString(),
          },
        });
      }, 2000);
    });
  }

  /**
   * Check verification status
   */
  async checkVerificationStatus(sessionId: string): Promise<VerificationResponse> {
    return this.apiCall<VerificationResponse>(`/status/${sessionId}`);
  }

  /**
   * Resend OTP with rate limiting check
   */
  async resendOTP(type: 'phone' | 'email', identifier: string): Promise<OTPResponse> {
    // Implementation would include rate limiting logic
    if (type === 'phone') {
      return this.sendPhoneOTP(identifier, '+1'); // Default country code
    } else {
      return this.sendEmailOTP(identifier);
    }
  }
}

export const verificationService = new VerificationService();