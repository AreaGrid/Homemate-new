import { QuestionnaireAnswer, CompatibilityBreakdown, Match } from '@/types/matching';

/**
 * Enhanced matching algorithm that calculates detailed compatibility scores
 * based on comprehensive questionnaire responses and user preferences
 */

export interface MatchingWeights {
  lifestyle: number;
  social: number;
  practical: number;
  interests: number;
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  lifestyle: 0.35,  // Cleanliness, noise, sleep schedule
  social: 0.25,     // Social preferences, guest policies
  practical: 0.25,  // Financial habits, conflict resolution
  interests: 0.15,  // Shared hobbies and interests
};

/**
 * Calculate lifestyle compatibility based on living habits
 */
function calculateLifestyleCompatibility(
  userAnswers: QuestionnaireAnswer[],
  matchAnswers: QuestionnaireAnswer[]
): { score: number; details: string[] } {
  const details: string[] = [];
  let totalScore = 0;
  let factors = 0;

  // Cleanliness compatibility
  const userCleanliness = getUserAnswer(userAnswers, 1);
  const matchCleanliness = getUserAnswer(matchAnswers, 1);
  const cleanlinessScore = calculateAnswerCompatibility(userCleanliness, matchCleanliness);
  totalScore += cleanlinessScore * 30; // 30% weight for cleanliness
  factors++;

  if (cleanlinessScore > 80) {
    details.push('Both prefer clean, organized living spaces');
  } else if (cleanlinessScore > 60) {
    details.push('Compatible cleanliness standards');
  }

  // Sleep schedule compatibility
  const userSleep = getUserAnswer(userAnswers, 5);
  const matchSleep = getUserAnswer(matchAnswers, 5);
  const sleepScore = calculateAnswerCompatibility(userSleep, matchSleep);
  totalScore += sleepScore * 25; // 25% weight for sleep schedule
  factors++;

  if (sleepScore > 80) {
    details.push(`Similar bedtime schedules (${userSleep})`);
  }

  // Noise level compatibility
  const userNoise = getUserAnswer(userAnswers, 6);
  const matchNoise = getUserAnswer(matchAnswers, 6);
  const noiseScore = calculateAnswerCompatibility(userNoise, matchNoise);
  totalScore += noiseScore * 25; // 25% weight for noise tolerance
  factors++;

  // Guest policy compatibility
  const userGuests = getUserAnswer(userAnswers, 7);
  const matchGuests = getUserAnswer(matchAnswers, 7);
  const guestScore = calculateAnswerCompatibility(userGuests, matchGuests);
  totalScore += guestScore * 20; // 20% weight for guest policies
  factors++;

  if (guestScore > 80) {
    details.push('Shared approach to guest policies');
  }

  return {
    score: Math.round(totalScore / factors),
    details
  };
}

/**
 * Calculate social compatibility based on interaction preferences
 */
function calculateSocialCompatibility(
  userAnswers: QuestionnaireAnswer[],
  matchAnswers: QuestionnaireAnswer[]
): { score: number; details: string[] } {
  const details: string[] = [];
  let totalScore = 0;
  let factors = 0;

  // Social interaction level
  const userSocial = getUserAnswer(userAnswers, 3);
  const matchSocial = getUserAnswer(matchAnswers, 3);
  const socialScore = calculateAnswerCompatibility(userSocial, matchSocial);
  totalScore += socialScore * 40; // 40% weight for social level
  factors++;

  if (socialScore > 80) {
    details.push('Both enjoy occasional shared activities');
  }

  // Shared meals preference
  const userMeals = getUserAnswer(userAnswers, 4);
  const matchMeals = getUserAnswer(matchAnswers, 4);
  const mealsScore = calculateAnswerCompatibility(userMeals, matchMeals);
  totalScore += mealsScore * 30; // 30% weight for meal sharing
  factors++;

  // Communication style
  const userComm = getUserAnswer(userAnswers, 8);
  const matchComm = getUserAnswer(matchAnswers, 8);
  const commScore = calculateAnswerCompatibility(userComm, matchComm);
  totalScore += commScore * 30; // 30% weight for communication
  factors++;

  if (commScore > 70) {
    details.push('Similar communication styles');
    details.push('Mutual respect for personal space');
  }

  return {
    score: Math.round(totalScore / factors),
    details
  };
}

/**
 * Calculate practical compatibility based on financial and living arrangements
 */
function calculatePracticalCompatibility(
  userAnswers: QuestionnaireAnswer[],
  matchAnswers: QuestionnaireAnswer[]
): { score: number; details: string[] } {
  const details: string[] = [];
  let totalScore = 0;
  let factors = 0;

  // Financial responsibility
  const userFinance = getUserAnswer(userAnswers, 9);
  const matchFinance = getUserAnswer(matchAnswers, 9);
  const financeScore = calculateScaleCompatibility(userFinance as number, matchFinance as number);
  totalScore += financeScore * 40; // 40% weight for financial habits
  factors++;

  if (financeScore > 80) {
    details.push('Both prioritize timely bill payments');
  }

  // Expense splitting preference
  const userExpenses = getUserAnswer(userAnswers, 10);
  const matchExpenses = getUserAnswer(matchAnswers, 10);
  const expenseScore = calculateAnswerCompatibility(userExpenses, matchExpenses);
  totalScore += expenseScore * 30; // 30% weight for expense handling
  factors++;

  if (expenseScore > 70) {
    details.push('Prefer equal expense splitting');
  }

  // Long-term goals alignment
  const userGoals = getUserAnswer(userAnswers, 11) as string[];
  const matchGoals = getUserAnswer(matchAnswers, 11) as string[];
  const goalsScore = calculateArrayCompatibility(userGoals, matchGoals);
  totalScore += goalsScore * 30; // 30% weight for long-term goals
  factors++;

  if (goalsScore > 70) {
    details.push('Long-term housing commitment');
  }

  return {
    score: Math.round(totalScore / factors),
    details
  };
}

/**
 * Calculate interest compatibility based on shared hobbies and activities
 */
function calculateInterestCompatibility(
  userInterests: string[],
  matchInterests: string[]
): { score: number; sharedInterests: string[] } {
  const sharedInterests = userInterests.filter(interest => 
    matchInterests.includes(interest)
  );

  const totalInterests = new Set([...userInterests, ...matchInterests]).size;
  const score = totalInterests > 0 ? (sharedInterests.length / totalInterests) * 100 : 0;

  return {
    score: Math.round(score),
    sharedInterests
  };
}

/**
 * Main function to calculate comprehensive compatibility
 */
export function calculateCompatibility(
  userAnswers: QuestionnaireAnswer[],
  userInterests: string[],
  matchAnswers: QuestionnaireAnswer[],
  matchInterests: string[],
  weights: MatchingWeights = DEFAULT_WEIGHTS
): CompatibilityBreakdown {
  const lifestyle = calculateLifestyleCompatibility(userAnswers, matchAnswers);
  const social = calculateSocialCompatibility(userAnswers, matchAnswers);
  const practical = calculatePracticalCompatibility(userAnswers, matchAnswers);
  const interests = calculateInterestCompatibility(userInterests, matchInterests);

  const overall = Math.round(
    lifestyle.score * weights.lifestyle +
    social.score * weights.social +
    practical.score * weights.practical +
    interests.score * weights.interests
  );

  return {
    overall,
    lifestyle,
    social,
    practical,
    interests
  };
}

/**
 * Helper function to get user's answer for a specific question
 */
function getUserAnswer(answers: QuestionnaireAnswer[], questionId: number): any {
  const answer = answers.find(a => a.questionId === questionId);
  return answer ? answer.answer : null;
}

/**
 * Calculate compatibility between two single-choice answers
 */
function calculateAnswerCompatibility(answer1: any, answer2: any): number {
  if (!answer1 || !answer2) return 0;
  
  // Exact match gets 100%
  if (answer1 === answer2) return 100;
  
  // For different answers, we can implement more sophisticated logic
  // For now, return a base compatibility score
  return 60;
}

/**
 * Calculate compatibility between two scale answers (1-5)
 */
function calculateScaleCompatibility(scale1: number, scale2: number): number {
  if (!scale1 || !scale2) return 0;
  
  const difference = Math.abs(scale1 - scale2);
  const maxDifference = 4; // Maximum difference on a 1-5 scale
  
  return Math.round((1 - difference / maxDifference) * 100);
}

/**
 * Calculate compatibility between two array answers (multiple choice)
 */
function calculateArrayCompatibility(array1: string[], array2: string[]): number {
  if (!array1 || !array2 || array1.length === 0 || array2.length === 0) return 0;
  
  const intersection = array1.filter(item => array2.includes(item));
  const union = new Set([...array1, ...array2]);
  
  return Math.round((intersection.length / union.size) * 100);
}

/**
 * Calculate trust score based on verification status and profile completeness
 */
export function calculateTrustScore(
  verificationStatus: any,
  profileCompletion: number,
  hasReferences: boolean = false
): number {
  let score = 0;
  
  // Verification components (70% of trust score)
  const verifications = Object.values(verificationStatus);
  const verifiedCount = verifications.filter(Boolean).length;
  const verificationScore = (verifiedCount / verifications.length) * 70;
  score += verificationScore;
  
  // Profile completion (20% of trust score)
  const completionScore = (profileCompletion / 100) * 20;
  score += completionScore;
  
  // References bonus (10% of trust score)
  if (hasReferences) {
    score += 10;
  }
  
  return Math.round(score);
}