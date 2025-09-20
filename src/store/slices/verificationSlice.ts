/**
 * Redux slice for verification state management
 * Handles all verification-related state updates with proper typing
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  VerificationState, 
  PhoneVerificationData, 
  EmailVerificationData, 
  DocumentVerificationData,
  OTPResponse,
  VerificationResponse,
  ApiError 
} from '../types/verification';
import { verificationService } from '../services/verificationService';
import { VERIFICATION_CONSTANTS } from '../constants/verification';

// Initial state
const initialState: VerificationState = {
  currentStep: 1,
  totalSteps: 4,
  isLoading: false,
  error: null,
  phone: {
    countryCode: '+1',
    phoneNumber: '',
    fullPhoneNumber: '',
    isVerified: false,
  },
  email: {
    email: '',
    isVerified: false,
  },
  document: {
    documentType: {
      id: '',
      name: '',
      description: '',
      requiredFields: [],
    },
    isVerified: false,
  },
  isCompleted: false,
  sessionId: '',
};

// Async thunks for API calls
export const sendPhoneOTP = createAsyncThunk<
  OTPResponse,
  { phoneNumber: string; countryCode: string },
  { rejectValue: ApiError }
>(
  'verification/sendPhoneOTP',
  async ({ phoneNumber, countryCode }, { rejectWithValue }) => {
    try {
      const response = await verificationService.sendPhoneOTP(phoneNumber, countryCode);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const verifyPhoneOTP = createAsyncThunk<
  VerificationResponse,
  { otpCode: string; verificationId: string },
  { rejectValue: ApiError }
>(
  'verification/verifyPhoneOTP',
  async ({ otpCode, verificationId }, { rejectWithValue }) => {
    try {
      const response = await verificationService.verifyPhoneOTP(otpCode, verificationId);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const sendEmailOTP = createAsyncThunk<
  OTPResponse,
  { email: string },
  { rejectValue: ApiError }
>(
  'verification/sendEmailOTP',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await verificationService.sendEmailOTP(email);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const verifyEmailOTP = createAsyncThunk<
  VerificationResponse,
  { otpCode: string; verificationId: string },
  { rejectValue: ApiError }
>(
  'verification/verifyEmailOTP',
  async ({ otpCode, verificationId }, { rejectWithValue }) => {
    try {
      const response = await verificationService.verifyEmailOTP(otpCode, verificationId);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const uploadDocument = createAsyncThunk<
  VerificationResponse,
  { documentType: string; frontImage: string; backImage?: string },
  { rejectValue: ApiError }
>(
  'verification/uploadDocument',
  async ({ documentType, frontImage, backImage }, { rejectWithValue }) => {
    try {
      const response = await verificationService.uploadDocument(documentType, frontImage, backImage);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const submitVerification = createAsyncThunk<
  VerificationResponse,
  void,
  { rejectValue: ApiError }
>(
  'verification/submitVerification',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { verification: VerificationState };
      const response = await verificationService.submitVerification(state.verification);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Verification slice
const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    // Navigation actions
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    
    // Phone verification actions
    setPhoneData: (state, action: PayloadAction<Partial<PhoneVerificationData>>) => {
      state.phone = { ...state.phone, ...action.payload };
    },
    
    // Email verification actions
    setEmailData: (state, action: PayloadAction<Partial<EmailVerificationData>>) => {
      state.email = { ...state.email, ...action.payload };
    },
    
    // Document verification actions
    setDocumentData: (state, action: PayloadAction<Partial<DocumentVerificationData>>) => {
      state.document = { ...state.document, ...action.payload };
    },
    
    // General actions
    clearError: (state) => {
      state.error = null;
    },
    
    resetVerification: (state) => {
      return { ...initialState, sessionId: state.sessionId };
    },
    
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    // Phone OTP sending
    builder
      .addCase(sendPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phone.verificationId = action.payload.verificationId;
      })
      .addCase(sendPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send phone OTP';
      });
    
    // Phone OTP verification
    builder
      .addCase(verifyPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isValid) {
          state.phone.isVerified = true;
          state.currentStep = 2; // Move to email verification
        }
      })
      .addCase(verifyPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Invalid OTP code';
      });
    
    // Email OTP sending
    builder
      .addCase(sendEmailOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendEmailOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.email.verificationId = action.payload.verificationId;
      })
      .addCase(sendEmailOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send email OTP';
      });
    
    // Email OTP verification
    builder
      .addCase(verifyEmailOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isValid) {
          state.email.isVerified = true;
          state.currentStep = 3; // Move to document verification
        }
      })
      .addCase(verifyEmailOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Invalid email OTP';
      });
    
    // Document upload
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.document.isVerified = true;
          state.document.extractedData = action.payload.data;
          state.currentStep = 4; // Move to review
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Document upload failed';
      });
    
    // Final submission
    builder
      .addCase(submitVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isCompleted = true;
        }
      })
      .addCase(submitVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Verification submission failed';
      });
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setPhoneData,
  setEmailData,
  setDocumentData,
  clearError,
  resetVerification,
  setSessionId,
  setLoading,
} = verificationSlice.actions;

export default verificationSlice.reducer;