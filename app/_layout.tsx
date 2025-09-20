import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { paddingBottom: 0 }
      }}>
        <Stack.Screen name="+not-found" />
        <Stack.Screen 
          name="events/join-events" 
          options={{ 
            headerShown: false,
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="events/event-detail" 
          options={{ 
            headerShown: false,
            presentation: 'card'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
