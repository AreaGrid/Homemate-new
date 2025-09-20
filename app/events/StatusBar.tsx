import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

export function useStatusBarStyle(backgroundColor: string) {
  const [barStyle, setBarStyle] = useState<'light-content' | 'dark-content'>(
    'dark-content'
  );

  const calculateBrightness = useCallback((hexColor: string): number => {
    // Remove # if present
    const color = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate perceived brightness using YIQ formula
    return (r * 299 + g * 587 + b * 114) / 1000;
  }, []);

  useEffect(() => {
    // Calculate background brightness
    const brightness = calculateBrightness(backgroundColor);

    // If background is dark, use light status bar content
    // If background is light, use dark status bar content
    setBarStyle(brightness < 128 ? 'light-content' : 'dark-content');
  }, [backgroundColor, calculateBrightness]);

  return barStyle;
}
