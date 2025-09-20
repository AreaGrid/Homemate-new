import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Shield, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Camera, Upload, Phone, Mail, CreditCard, Briefcase, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

const verificationSteps = [
  {
    id: 'phone',
    title: 'Phone Number',
    subtitle: 'Verify your phone number with SMS',
    icon: Phone,
    status: 'completed',
    color: '#735510',
  },
  {
    id: 'email',
    title: 'Email Address',
    subtitle: 'Confirm your email address',
    icon: Mail,
    status: 'completed',
    color: '#735510',
  },
  {
    id: 'id',
    title: 'Government ID',
    subtitle: 'Upload a photo of your ID or passport',
    icon: CreditCard,
    status: 'completed',
    color: '#735510',
  },
  {
    id: 'employment',
    title: 'Employment Verification',
    subtitle: 'Verify your employment status',
    icon: Briefcase,
    status: 'pending',
    color: '#debd72',
  },
  {
    id: 'background',
    title: 'Background Check',
    subtitle: 'Optional background verification',
    icon: FileText,
    status: 'not_started',
    color: '#9CA3AF',
  },
];

const benefits = [
  'Higher match compatibility',
  'Increased profile visibility',
  'Access to verified users only',
  'Priority customer support',
  'Enhanced safety features',
];

export default function VerificationScreen() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'not_started':
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#735510';
      case 'pending':
        return '#debd72';
      case 'not_started':
      default:
        return '#9CA3AF';
    }
  };

  const completedCount = verificationSteps.filter(step => step.status === 'completed').length;
  const totalSteps = verificationSteps.length;
  const completionPercentage = (completedCount / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Verification Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <LinearGradient
          colors={['#f5f1e8', '#735510']}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Shield size={32} color="#FFFFFF" />
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Verification Progress</Text>
              <Text style={styles.progressSubtitle}>
                {completedCount} of {totalSteps} steps completed
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${completionPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(completionPercentage)}%
            </Text>
          </View>
        </LinearGradient>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Benefits</Text>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={20} color="#735510" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Verification Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Steps</Text>
          <View style={styles.stepsList}>
            {verificationSteps.map((step) => {
              const StatusIcon = getStatusIcon(step.status);
              const IconComponent = step.icon;
              
              return (
                <TouchableOpacity
                  key={step.id}
                  style={styles.stepItem}
                  onPress={() => setSelectedStep(step.id)}
                >
                  <View style={styles.stepIconContainer}>
                    <IconComponent size={24} color={step.color} />
                  </View>
                  
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <StatusIcon size={20} color={getStatusColor(step.status)} />
                    </View>
                    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                    
                    {step.status === 'pending' && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Complete</Text>
                      </TouchableOpacity>
                    )}
                    
                    {step.status === 'not_started' && (
                      <TouchableOpacity style={[styles.actionButton, styles.startButton]}>
                        <Text style={[styles.actionButtonText, styles.startButtonText]}>Start</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Upload</Text>
          <View style={styles.uploadOptions}>
            <TouchableOpacity style={styles.uploadOption}>
              <Camera size={24} color="#735510" />
              <Text style={styles.uploadText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadOption}>
              <Upload size={24} color="#735510" />
              <Text style={styles.uploadText}>Upload File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Our verification process is secure and typically takes 24-48 hours. 
            If you have questions, contact our support team.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  progressCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 16,
    padding: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressInfo: {
    marginLeft: 16,
    flex: 1,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#4B5563',
    marginLeft: 12,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#735510',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  startButton: {
    backgroundColor: '#F3F4F6',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  startButtonText: {
    color: '#6B7280',
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#735510',
    marginTop: 8,
  },
  helpSection: {
    backgroundColor: '#F9FAFB',
    margin: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#735510',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
});