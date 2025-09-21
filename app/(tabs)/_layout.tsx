import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  MessageCircle,
  User,
  Heart,
  List,
} from 'lucide-react-native';
import { Image } from 'react-native';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';

export default function TabLayout() {
  useStatusBarStyle('#FFFFFFFF'); // Set status bar style for light background
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffffff',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingTop: 12,
          paddingBottom: 12,
          height: 92,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Outfit-Medium',
          marginTop: 6,
        },
        tabBarActiveTintColor: '#735510',
        tabBarInactiveTintColor: '#6B7280',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../assets/images/homemate_logoFavBrown.png')}
              style={{
                width: 42,
                height: 42,
                tintColor: color, // This will apply the active/inactive colors
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Heart size={26} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={26} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={26} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
