/**
 * Progress indicator component for verification steps
 * Shows current progress with step indicators and labels
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';

interface Step {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  style?: ViewStyle;
  showLabels?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  style,
  showLabels = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressBar}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  step.completed && styles.completedStep,
                  step.active && styles.activeStep,
                ]}
              >
                {step.completed ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      step.active && styles.activeStepNumber,
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              
              {showLabels && (
                <Text
                  style={[
                    styles.stepLabel,
                    step.active && styles.activeStepLabel,
                    step.completed && styles.completedStepLabel,
                  ]}
                >
                  {step.title}
                </Text>
              )}
            </View>
            
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  step.completed && styles.completedConnector,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  stepContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  activeStep: {
    backgroundColor: '#735510',
    borderColor: '#735510',
  },
  
  completedStep: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#6B7280',
  },
  
  activeStepNumber: {
    color: '#FFFFFF',
  },
  
  stepLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 80,
  },
  
  activeStepLabel: {
    color: '#735510',
    fontFamily: 'Outfit-SemiBold',
  },
  
  completedStepLabel: {
    color: '#10B981',
    fontFamily: 'Outfit-Medium',
  },
  
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    marginBottom: 24,
  },
  
  completedConnector: {
    backgroundColor: '#10B981',
  },
});