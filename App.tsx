import React, { useState } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';
import { Home, Camera, Bookmark, BookOpen, User } from 'lucide-react-native';

// Screen Imports
import HomeScreen from './src/screens/HomeScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import SavedScreen from './src/screens/SavedScreen';
import QuizScreen from './src/screens/QuizScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/components/SplashScreen';

const Tab = createBottomTabNavigator();

const KavanaTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <NavigationContainer theme={KavanaTheme}>
        <Tab.Navigator
          safeAreaInsets={Platform.OS === 'web' ? { bottom: 0, top: 0, left: 0, right: 0 } : undefined}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarStyle: {
              backgroundColor: Colors.surface,
              borderTopColor: Colors.border,
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'web' ? 12 : 8,
              height: Platform.OS === 'web' ? 70 : 64,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 'bold',
              marginBottom: Platform.OS === 'web' ? 2 : 4,
            },
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') {
                return <Home size={size} color={color} />;
              } else if (route.name === 'Capture') {
                return <Camera size={size} color={color} />;
              } else if (route.name === 'Saved') {
                return <Bookmark size={size} color={color} />;
              } else if (route.name === 'Quiz') {
                return <BookOpen size={size} color={color} />;
              } else if (route.name === 'Profile') {
                return <User size={size} color={color} />;
              }
              return null;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Capture" component={CaptureScreen} />
          <Tab.Screen name="Saved" component={SavedScreen} />
          <Tab.Screen name="Quiz" component={QuizScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      {isLoading && (
        <SplashScreen onComplete={() => setIsLoading(false)} />
      )}
    </SafeAreaProvider>
  );
}

