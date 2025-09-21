import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';

export function useStatusBarStyle(backgroundColor: string) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Determine if background color is light or dark
    const isLightBackground = backgroundColor.toLowerCase().includes('fff') || 
                            backgroundColor.toLowerCase().includes('white');
    
    StatusBar.setBarStyle(
      isLightBackground ? 'dark-content' : 'light-content',
      true
    );
    
    // Set background color
    StatusBar.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);
}