export interface QuestionnaireAnswer {
  questionId: number;
  answer: string | string[] | number;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  images: string[];
  about: string;
  idealHousemate: string;
  interests: string[];
  verificationStatus: VerificationStatus;
  lifestyle: LifestylePreferences;
  questionnaire: QuestionnaireAnswer[];
  trustScore: number;
  profileCompletion: number;
}

export interface LifestylePreferences {
  cleanliness: string;
  socialLevel: string;
  bedtime: string;
  pets: string;
  noiseLevel: string;
  guestPolicy: string;
  conflictResolution: string;
  financialHabits: string;
  longTermGoals: string;
}

export interface VerificationStatus {
  phone: boolean;
  email: boolean;
  id: boolean;
  employment: boolean;
  background: boolean;
  references: boolean;
}

export interface CompatibilityBreakdown {
  overall: number;
  lifestyle: {
    score: number;
    details: string[];
  };
  social: {
    score: number;
    details: string[];
  };
  practical: {
    score: number;
    details: string[];
  };
  interests: {
    score: number;
    sharedInterests: string[];
  };
}

export interface Match {
  id: number;
  name: string;
  age: number;
  profession: string;
  location: string;
  images: string[];
  about: string;
  idealHousemate: string;
  interests: string[];
  lifestyle: LifestylePreferences;
  verificationStatus: VerificationStatus;
  trustScore: number;
  compatibility: CompatibilityBreakdown;
  verified: boolean;
  lastActive: string;
}

export interface ConversationStarter {
  id: string;
  text: string;
  category: 'lifestyle' | 'interests' | 'practical' | 'social';
  basedOn: string[];
}

export interface MatchFeedback {
  matchId: number;
  rating: number;
  whatWorked: string[];
  whatDidntWork: string[];
  reason: string;
  wouldRecommend: boolean;
  additionalComments: string;
}