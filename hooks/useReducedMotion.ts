import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook to detect if user prefers reduced motion for accessibility
 * Returns true if reduced motion is preferred, false otherwise
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial reduced motion preference
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      setReducedMotion(isEnabled);
    });

    // Listen for changes in reduced motion preference
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setReducedMotion(isEnabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return reducedMotion;
}