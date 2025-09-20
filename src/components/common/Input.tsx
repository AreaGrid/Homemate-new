/**
 * Reusable Input component with validation and accessibility features
 * Supports different types, validation states, and custom styling
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  variant = 'outline',
  size = 'medium',
  required = false,
  secureTextEntry,
  ...props
}, ref) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const showPasswordToggle = secureTextEntry !== undefined;

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    hasError && styles.error,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    inputStyle,
  ];

  const renderRightIcon = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          style={styles.iconButton}
          accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
          accessibilityRole="button"
        >
          {isSecure ? (
            <Eye size={20} color="#6B7280" />
          ) : (
            <EyeOff size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      );
    }

    if (hasError) {
      return (
        <View style={styles.iconButton}>
          <AlertCircle size={20} color="#EF4444" />
        </View>
      );
    }

    return rightIcon ? (
      <View style={styles.iconButton}>
        {rightIcon}
      </View>
    ) : null;
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.iconButton}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={inputStyles}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={label}
          accessibilityHint={helperText}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  
  required: {
    color: '#EF4444',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  
  // Variants
  default: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  filled: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  
  // Sizes
  small: {
    minHeight: 40,
    paddingHorizontal: 12,
  },
  
  medium: {
    minHeight: 48,
    paddingHorizontal: 16,
  },
  
  large: {
    minHeight: 56,
    paddingHorizontal: 20,
  },
  
  // States
  focused: {
    borderColor: '#735510',
  },
  
  error: {
    borderColor: '#EF4444',
  },
  
  input: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
    color: '#1F2937',
  },
  
  // Input sizes
  smallInput: {
    fontSize: 14,
  },
  
  mediumInput: {
    fontSize: 16,
  },
  
  largeInput: {
    fontSize: 18,
  },
  
  iconButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  helperText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  
  errorText: {
    color: '#EF4444',
  },
});