import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import RegisterScreen from './src/userscreens/RegisterScreen';
import SignInScreen from './src/userscreens/SignInScreen';
import newdashboard from './src/userscreens/NewDashboard';

import Notifications from './src/userscreens/Notifications';
import ExamHistory from './src/userscreens/ExamHistory';
import StudyPlanner from './src/userscreens/StudyPlanner';
import Leaderboard from './src/userscreens/Leaderboard';
import Settings from './src/userscreens/Settings';
import Progress from './src/userscreens/Progress';
import NEETMockTest from './src/userscreens/NEETMockTest';
import UPSCMockTest from './src/userscreens/UPSCMockTest';
import MPSCMockTest from './src/userscreens/MPSCMockTest';
import IndexScreen from './src/userscreens/IndexScreen';
import AvailableExams from './src/userscreens/AvailableExams';
import TakeExam from './src/userscreens/TakeExam';
import PerformanceOverview from './src/userscreens/PerformanceOverview';
import RateUsScreen from './src/userscreens/RateUsScreen';
import ForgotPasswordScreen from './src/userscreens/ForgotPasswordScreen';
// Admin screens imports
import AdminDashboard from './src/adminscreens/AdminDashboard';
import Candidates from './src/adminscreens/Candidates';
import QuestionsPage from './src/adminscreens/QuestionsPage';
import StatisticsPage from './src/adminscreens/StatisticsPage';
import AdminLoginScreen from './src/adminscreens/AdminLoginScreen';
import Exams from './src/adminscreens/Exams';
import ManageQuestions from './src/adminscreens/ManageQuestions';
import AdminSettings from './src/adminscreens/AdminSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from './src/components/ErrorBoundary';
import { UserProvider } from './src/context/UserContext';

export type RootStackParamList = {
  Index: undefined;
  SignIn: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  NewDashboard: undefined;

  Notifications: undefined;
  ExamHistory: undefined;
  StudyPlanner: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  Progress: undefined;
  NEETMockTest: undefined;
  UPSCMockTest: undefined;
  MPSCMockTest: undefined;
  AvailableExams: undefined;
  TakeExam: { examId: string };
  PerformanceOverview: undefined;
  RateUsScreen: undefined;
  // Admin routes
  AdminDashboard: undefined;
  Exams: undefined;
  Candidates: undefined;
  QuestionsPage: undefined;
  StatisticsPage: undefined;
  AdminLogin: undefined;
  ManageQuestions: { examId: string };
  AdminSettings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Index');

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          // If user is logged in, set initial route based on role
          if (user.isAdmin) {
            setInitialRoute('AdminDashboard');
          } else {
            setInitialRoute('NewDashboard');
          }
        }
      } catch (error) {
        console.log('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              gestureEnabled: false, // Disable swipe back gesture
            }}
          >
            {/* User screens */}
            <Stack.Screen name="Index" component={IndexScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="NewDashboard"
              component={newdashboard}
              options={{
                headerShown: false,
                gestureEnabled: false // Prevent swipe back
              }}
            />

            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="ExamHistory" component={ExamHistory} options={{ headerShown: false }} />
            <Stack.Screen name="StudyPlanner" component={StudyPlanner} options={{ headerShown: false }} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="Progress" component={Progress} options={{ headerShown: false }} />
            <Stack.Screen name="NEETMockTest" component={NEETMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="UPSCMockTest" component={UPSCMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="MPSCMockTest" component={MPSCMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="AvailableExams" component={AvailableExams} options={{ headerShown: false }} />
            <Stack.Screen name="TakeExam" component={TakeExam} options={{ headerShown: false }} />
            <Stack.Screen name="PerformanceOverview" component={PerformanceOverview} options={{ headerShown: false }} />
            <Stack.Screen name="RateUsScreen" component={RateUsScreen} options={{ headerShown: false }} />
            {/* Admin screens */}
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{
                headerShown: false,
                gestureEnabled: false // Prevent swipe back
              }}
            />
            <Stack.Screen name="Exams" component={Exams} options={{ headerShown: false }} />
            <Stack.Screen name="Candidates" component={Candidates} options={{ headerShown: false }} />
            <Stack.Screen name="QuestionsPage" component={QuestionsPage} options={{ headerShown: false }} />
            <Stack.Screen name="StatisticsPage" component={StatisticsPage} options={{ headerShown: false }} />
            <Stack.Screen name="ManageQuestions" component={ManageQuestions} options={{ headerShown: false }} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminSettings" component={AdminSettings} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </ErrorBoundary>
  );
}
