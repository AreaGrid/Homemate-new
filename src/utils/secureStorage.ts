/**
 * Secure storage utilities for sensitive verification data
 * Uses React Native Keychain for secure storage with encryption
 */

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VERIFICATION_CONSTANTS } from '../constants/verification';

interface SecureStorageOptions {
  service?: string;
  accessGroup?: string;
  touchID?: boolean;
  showModal?: boolean;
}

class SecureStorage {
  private defaultOptions: Keychain.Options = {
    service: 'HomemateVerification',
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    authenticatePrompt: 'Authenticate to access verification data',
    storage: Keychain.STORAGE_TYPE.KC,
  };

  /**
   * Store sensitive data securely using Keychain
   */
  async setSecureItem(
    key: string,
    value: string,
    options: SecureStorageOptions = {}
  ): Promise<boolean> {
    try {
      const keychainOptions: Keychain.Options = {
        ...this.defaultOptions,
        service: options.service || this.defaultOptions.service,
      };

      await Keychain.setInternetCredentials(
        key,
        key, // username
        value, // password (our data)
        keychainOptions
      );

      return true;
    } catch (error) {
      console.error('SecureStorage setSecureItem error:', error);
      return false;
    }
  }

  /**
   * Retrieve sensitive data securely from Keychain
   */
  async getSecureItem(
    key: string,
    options: SecureStorageOptions = {}
  ): Promise<string | null> {
    try {
      const keychainOptions: Keychain.Options = {
        ...this.defaultOptions,
        service: options.service || this.defaultOptions.service,
      };

      const credentials = await Keychain.getInternetCredentials(key, keychainOptions);
      
      if (credentials && credentials.password) {
        return credentials.password;
      }
      
      return null;
    } catch (error) {
      console.error('SecureStorage getSecureItem error:', error);
      return null;
    }
  }

  /**
   * Remove sensitive data from Keychain
   */
  async removeSecureItem(key: string): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials(key);
      return true;
    } catch (error) {
      console.error('SecureStorage removeSecureItem error:', error);
      return false;
    }
  }

  /**
   * Store verification data securely
   */
  async storeVerificationData(data: any): Promise<boolean> {
    try {
      const serializedData = JSON.stringify(data);
      return await this.setSecureItem(
        VERIFICATION_CONSTANTS.STORAGE_KEYS.VERIFICATION_STATE,
        serializedData
      );
    } catch (error) {
      console.error('Error storing verification data:', error);
      return false;
    }
  }

  /**
   * Retrieve verification data securely
   */
  async getVerificationData(): Promise<any | null> {
    try {
      const serializedData = await this.getSecureItem(
        VERIFICATION_CONSTANTS.STORAGE_KEYS.VERIFICATION_STATE
      );
      
      if (serializedData) {
        return JSON.parse(serializedData);
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving verification data:', error);
      return null;
    }
  }

  /**
   * Clear all verification data
   */
  async clearVerificationData(): Promise<boolean> {
    try {
      const keys = Object.values(VERIFICATION_CONSTANTS.STORAGE_KEYS);
      const promises = keys.map(key => this.removeSecureItem(key));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error clearing verification data:', error);
      return false;
    }
  }

  /**
   * Store session data (less sensitive, can use AsyncStorage)
   */
  async storeSessionData(key: string, data: any): Promise<boolean> {
    try {
      const serializedData = JSON.stringify(data);
      await AsyncStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error storing session data:', error);
      return false;
    }
  }

  /**
   * Retrieve session data
   */
  async getSessionData(key: string): Promise<any | null> {
    try {
      const serializedData = await AsyncStorage.getItem(key);
      if (serializedData) {
        return JSON.parse(serializedData);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving session data:', error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  async clearSessionData(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing session data:', error);
      return false;
    }
  }

  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return biometryType !== null;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometry type
   */
  async getBiometryType(): Promise<Keychain.BIOMETRY_TYPE | null> {
    try {
      return await Keychain.getSupportedBiometryType();
    } catch (error) {
      console.error('Error getting biometry type:', error);
      return null;
    }
  }
}

export const secureStorage = new SecureStorage();