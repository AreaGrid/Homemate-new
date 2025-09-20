/**
 * Custom hook for OTP input management
 * Handles OTP input state, validation, and auto-focus behavior
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { TextInput } from 'react-native';
import { VERIFICATION_CONSTANTS } from '../constants/verification';

interface UseOTPProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onCodeChange?: (otp: string) => void;
}

export const useOTP = ({ 
  length = VERIFICATION_CONSTANTS.OTP_LENGTH, 
  onComplete,
  onCodeChange 
}: UseOTPProps = {}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  // Handle OTP input change
  const handleChange = useCallback((value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste operation
    if (value.length > 1) {
      const pastedCode = value.slice(0, length);
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedCode[i] || '';
      }
      setOtp(newOtp);
      
      // Focus on the last filled input or next empty input
      const lastFilledIndex = Math.min(pastedCode.length - 1, length - 1);
      setActiveIndex(lastFilledIndex);
      inputRefs.current[lastFilledIndex]?.focus();
      
      const otpString = newOtp.join('');
      onCodeChange?.(otpString);
      
      if (otpString.length === length) {
        onComplete?.(otpString);
      }
      return;
    }

    // Handle single character input
    newOtp[index] = value;
    setOtp(newOtp);
    
    const otpString = newOtp.join('');
    onCodeChange?.(otpString);

    // Auto-focus next input
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when OTP is fully entered
    if (otpString.length === length) {
      onComplete?.(otpString);
    }
  }, [otp, length, onComplete, onCodeChange]);

  // Handle backspace
  const handleKeyPress = useCallback((key: string, index: number) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      
      if (newOtp[index]) {
        // Clear current input
        newOtp[index] = '';
        setOtp(newOtp);
        onCodeChange?.(newOtp.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
        onCodeChange?.(newOtp.join(''));
      }
    }
  }, [otp, onCodeChange]);

  // Handle input focus
  const handleFocus = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Clear OTP
  const clearOTP = useCallback(() => {
    setOtp(new Array(length).fill(''));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    onCodeChange?.('');
  }, [length, onCodeChange]);

  // Set OTP programmatically
  const setOTPValue = useCallback((value: string) => {
    const newOtp = new Array(length).fill('');
    const cleanValue = value.replace(/\D/g, '').slice(0, length);
    
    for (let i = 0; i < cleanValue.length; i++) {
      newOtp[i] = cleanValue[i];
    }
    
    setOtp(newOtp);
    setActiveIndex(Math.min(cleanValue.length, length - 1));
    onCodeChange?.(cleanValue);
    
    if (cleanValue.length === length) {
      onComplete?.(cleanValue);
    }
  }, [length, onComplete, onCodeChange]);

  // Get current OTP value
  const getOTPValue = useCallback(() => {
    return otp.join('');
  }, [otp]);

  // Check if OTP is complete
  const isComplete = useCallback(() => {
    return otp.every(digit => digit !== '') && otp.length === length;
  }, [otp, length]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return {
    otp,
    activeIndex,
    inputRefs,
    handleChange,
    handleKeyPress,
    handleFocus,
    clearOTP,
    setOTPValue,
    getOTPValue,
    isComplete: isComplete(),
  };
};