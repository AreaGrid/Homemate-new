/**
 * OTP Input component with auto-focus and paste support
 * Provides accessible OTP input with proper keyboard handling
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useOTP } from '../../hooks/useOTP';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onCodeChange?: (otp: string) => void;
  style?: ViewStyle;
  autoFocus?: boolean;
  editable?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onCodeChange,
  style,
  autoFocus = true,
  editable = true,
}) => {
  const {
    otp,
    activeIndex,
    inputRefs,
    handleChange,
    handleKeyPress,
    handleFocus,
  } = useOTP({ length, onComplete, onCodeChange });

  return (
    <View style={[styles.container, style]}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            activeIndex === index && styles.activeInput,
            digit && styles.filledInput,
          ]}
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => handleFocus(index)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          editable={editable}
          autoFocus={autoFocus && index === 0}
          accessibilityLabel={`OTP digit ${index + 1}`}
          accessibilityHint={`Enter digit ${index + 1} of ${length}`}
          testID={`otp-input-${index}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  
  activeInput: {
    borderColor: '#735510',
    backgroundColor: '#F9FAFB',
  },
  
  filledInput: {
    borderColor: '#735510',
    backgroundColor: '#F0F9FF',
  },
});