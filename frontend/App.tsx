import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import RegisterScreen from './src/screens/RegisterScreen';
import SignInScreen from './src/screens/SignInScreen';
import newdashboard from './src/screens/NewDashboard';
import VidyankaTestSeries from './src/screens/VidyankaTestSeries';
import Notifications from './src/screens/Notifications';
import ExamHistory from './src/screens/ExamHistory';
import StudyPlanner from './src/screens/StudyPlanner';
import Leaderboard from './src/screens/Leaderboard';
import Settings from './src/screens/Settings';
import Progress from './src/screens/Progress';
import ExamScreen from './src/screens/ExamScreen';
import NEETMockTest from './src/screens/NEETMockTest';
import UPSCMockTest from './src/screens/UPSCMockTest';
import MPSCMockTest from './src/screens/MPSCMockTest';
import IndexScreen from './src/screens/IndexScreen';
import AvailableExams from './src/screens/AvailableExams';
import AvailableExamsNew from './src/screens/AvailableExamsNew';
import TakeExam from './src/screens/TakeExam';
import PerformanceOverview from './src/screens/PerformanceOverview';
import RateUsScreen from './src/screens/RateUsScreen';
import StartYourJourney from './src/screens/StartYourJourney';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
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
  VidyankaTestSeries: undefined;
  Notifications: undefined;
  ExamHistory: undefined;
  StudyPlanner: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  Progress: undefined;
  ExamScreen: { examType: 'UPSC' | 'MPSC', questions: any[] };
  NEETMockTest: undefined;
  UPSCMockTest: undefined;
  MPSCMockTest: undefined;
  AvailableExams: undefined;
  AvailableExamsNew: undefined;
  TakeExam: { examId: string };
  PerformanceOverview: undefined;
  RateUsScreen: undefined;
  StartYourJourney: undefined;
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
            <Stack.Screen name="VidyankaTestSeries" component={VidyankaTestSeries} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="ExamHistory" component={ExamHistory} options={{ headerShown: false }} />
            <Stack.Screen name="StudyPlanner" component={StudyPlanner} options={{ headerShown: false }} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="Progress" component={Progress} options={{ headerShown: false }} />
            <Stack.Screen name="ExamScreen" component={ExamScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NEETMockTest" component={NEETMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="UPSCMockTest" component={UPSCMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="MPSCMockTest" component={MPSCMockTest} options={{ headerShown: false }} />
            <Stack.Screen name="AvailableExams" component={AvailableExams} options={{ headerShown: false }} />
            <Stack.Screen name="AvailableExamsNew" component={AvailableExamsNew} options={{ headerShown: false }} />
            <Stack.Screen name="TakeExam" component={TakeExam} options={{ headerShown: false }} />
            <Stack.Screen name="PerformanceOverview" component={PerformanceOverview} options={{ headerShown: false }} />
            <Stack.Screen name="RateUsScreen" component={RateUsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="StartYourJourney" component={StartYourJourney} options={{ headerShown: false }} />
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
