/**
 * Verification Navigator
 * Handles navigation between verification screens with proper type safety
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { VerificationStackParamList } from '../types/verification';
import { RootState } from '../store';

// Import screens
import { PhoneVerificationScreen } from '../screens/verification/PhoneVerificationScreen';
import { EmailVerificationScreen } from '../screens/verification/EmailVerificationScreen';
// import { DocumentVerificationScreen } from '../screens/verification/DocumentVerificationScreen';
// import { ReviewInformationScreen } from '../screens/verification/ReviewInformationScreen';
// import { VerificationSuccessScreen } from '../screens/verification/VerificationSuccessScreen';

const Stack = createStackNavigator<VerificationStackParamList>();

export const VerificationNavigator: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.verification.currentStep);

  // Determine initial route based on current step
  const getInitialRouteName = (): keyof VerificationStackParamList => {
    switch (currentStep) {
      case 1:
        return 'PhoneVerification';
      case 2:
        return 'EmailVerification';
      case 3:
        return 'DocumentVerification';
      case 4:
        return 'ReviewInformation';
      default:
        return 'PhoneVerification';
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back to prevent skipping steps
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{
          title: 'Phone Verification',
        }}
      />
      
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{
          title: 'Email Verification',
        }}
      />
      
      {/* TODO: Implement remaining screens */}
      {/* <Stack.Screen
        name="DocumentVerification"
        component={DocumentVerificationScreen}
        options={{
          title: 'Document Verification',
        }}
      />
      
      <Stack.Screen
        name="ReviewInformation"
        component={ReviewInformationScreen}
        options={{
          title: 'Review Information',
        }}
      />
      
      <Stack.Screen
        name="VerificationSuccess"
        component={VerificationSuccessScreen}
        options={{
          title: 'Verification Complete',
        }}
      /> */}
    </Stack.Navigator>
  );
};