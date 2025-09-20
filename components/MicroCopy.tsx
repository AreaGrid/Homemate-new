import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useFonts, Outfit_400Regular, Outfit_500Medium } from '@expo-google-fonts/outfit';
import { useFocusEffect } from '@react-navigation/native';

interface MicroCopyMessage {
  id: number;
  english: string;
  dutch: string;
}

const microCopyMessages: MicroCopyMessage[] = [
  {
    id: 1,
    english: "A good vibe at home matters more than a big room.",
    dutch: "Een fijne sfeer thuis zegt meer dan een grote kamer."
  },
  {
    id: 2,
    english: "Respecting each other's space makes living together easy.",
    dutch: "Elkaars ruimte respecteren maakt samenwonen zoveel makkelijker."
  },
  {
    id: 3,
    english: "Cooking together beats eating alone every time.",
    dutch: "Samen koken is altijd leuker dan alleen eten."
  },
  {
    id: 4,
    english: "Trust is the real key to a happy home.",
    dutch: "Vertrouwen is de echte sleutel tot een fijn huis."
  },
  {
    id: 5,
    english: "Clean habits, chill vibes.",
    dutch: "Schoon huis, relaxte sfeer."
  },
  {
    id: 6,
    english: "It's not about the rent, it's about the respect.",
    dutch: "Het gaat niet om de huur, maar om het respect."
  },
  {
    id: 7,
    english: "Sharing laughs makes the space feel lighter.",
    dutch: "Lachen samen maakt het huis meteen lichter."
  },
  {
    id: 8,
    english: "Quiet time is just as valuable as hangout time.",
    dutch: "Rustige momenten zijn net zo waardevol als samen chillen."
  },
  {
    id: 9,
    english: "Good roommates feel more like friends.",
    dutch: "Goede huisgenoten voelen vaak als vrienden."
  },
  {
    id: 10,
    english: "Home feels right when people feel right.",
    dutch: "Een huis voelt goed als de mensen goed voelen."
  },
  {
    id: 11,
    english: "Small gestures make the biggest difference at home.",
    dutch: "Kleine gebaren maken thuis het grootste verschil."
  },
  {
    id: 12,
    english: "Shared spaces, shared memories, shared growth.",
    dutch: "Gedeelde ruimtes, gedeelde herinneringen, gedeelde groei."
  },
  {
    id: 13,
    english: "The best homes are built on understanding.",
    dutch: "De beste huizen zijn gebouwd op begrip."
  },
  {
    id: 14,
    english: "Living together means growing together.",
    dutch: "Samenwonen betekent samen groeien."
  },
  {
    id: 15,
    english: "Home is where kindness lives daily.",
    dutch: "Thuis is waar vriendelijkheid dagelijks leeft."
  },
  {
    id: 16,
    english: "Goede buren beginnen met goede huisgenoten.",
    dutch: "Good neighbors start with good housemates."
  },
  {
    id: 17,
    english: "Samen delen maakt alles lichter.",
    dutch: "Sharing together makes everything lighter."
  },
  {
    id: 18,
    english: "Thuis voelt als thuis door de juiste mensen.",
    dutch: "Home feels like home through the right people."
  },
  {
    id: 19,
    english: "Respect groeit in kleine dagelijkse momenten.",
    dutch: "Respect grows in small daily moments."
  },
  {
    id: 20,
    english: "Een warm welkom maakt elk huis een thuis.",
    dutch: "A warm welcome makes every house a home."
  }
];

interface MicroCopyProps {
  language?: 'english' | 'dutch';
  style?: any;
  reducedMotion?: boolean;
}

export default function MicroCopy({ 
  language = 'english', 
  style,
  reducedMotion = false 
}: MicroCopyProps) {
  const [currentMessage, setCurrentMessage] = useState<MicroCopyMessage | null>(null);
  const [previousMessageId, setPreviousMessageId] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
  });

  // Function to get a random message that's different from the previous one
  const getRandomMessage = (): MicroCopyMessage => {
    const availableMessages = microCopyMessages.filter(
      message => message.id !== previousMessageId
    );
    
    // If all messages have been used, reset and use all messages
    const messagesToChooseFrom = availableMessages.length > 0 
      ? availableMessages 
      : microCopyMessages;
    
    const randomIndex = Math.floor(Math.random() * messagesToChooseFrom.length);
    return messagesToChooseFrom[randomIndex];
  };

  // Function to animate in the new message
  const animateNewMessage = (newMessage: MicroCopyMessage) => {
    if (reducedMotion) {
      // For reduced motion, just update without animation
      setCurrentMessage(newMessage);
      setPreviousMessageId(newMessage.id);
      return;
    }

    // Start with invisible and slightly offset
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    // Set the new message
    setCurrentMessage(newMessage);
    setPreviousMessageId(newMessage.id);
    
    // Animate in with fade and subtle slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Function to animate out current message and in new message
  const transitionToNewMessage = () => {
    const newMessage = getRandomMessage();
    
    if (reducedMotion) {
      animateNewMessage(newMessage);
      return;
    }

    if (currentMessage) {
      // Fade out current message
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After fade out, animate in new message
        animateNewMessage(newMessage);
      });
    } else {
      // First time, just animate in
      animateNewMessage(newMessage);
    }
  };

  // Trigger new message when screen comes into focus (user navigates back)
  useFocusEffect(
    React.useCallback(() => {
      transitionToNewMessage();
    }, [language, reducedMotion])
  );

  if (!fontsLoaded || !currentMessage) {
    return <View style={[styles.container, style]} />;
  }

  const displayText = language === 'dutch' ? currentMessage.dutch : currentMessage.english;

  return (
    <View style={[styles.container, style]}>
      <Animated.Text 
        style={[
          styles.text,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        accessibilityRole="text"
        accessibilityLabel={`Inspirational message: ${displayText}`}
      >
        {displayText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: '100%',
  },
});