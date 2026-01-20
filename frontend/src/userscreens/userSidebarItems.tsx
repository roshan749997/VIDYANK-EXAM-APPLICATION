import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function getUserSidebarItems(navigation: any, closeSidebar: () => void, activeLabel?: string) {
  const getColor = (label: string) => (activeLabel === label ? '#fff' : '#000');
  
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      closeSidebar();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Index' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return [
    { label: 'Dashboard', icon: <Ionicons name="speedometer-outline" size={20} color={getColor('Dashboard')} />, onPress: () => { closeSidebar(); navigation.navigate('NewDashboard'); }, active: activeLabel === 'Dashboard' },
    { label: 'Test Series', icon: <Ionicons name="book-outline" size={20} color={getColor('Test Series')} />, onPress: () => { closeSidebar(); navigation.navigate('VidyankaTestSeries'); }, active: activeLabel === 'Test Series' },
    { label: 'Available Exams', icon: <Ionicons name="list-circle-outline" size={20} color={getColor('Available Exams')} />, onPress: () => { closeSidebar(); navigation.navigate('AvailableExams'); }, active: activeLabel === 'Available Exams' },
    { label: 'Exam History', icon: <Ionicons name="calendar-outline" size={20} color={getColor('Exam History')} />, onPress: () => { closeSidebar(); navigation.navigate('ExamHistory'); }, active: activeLabel === 'Exam History' },
    { label: 'Progress', icon: <Ionicons name="bar-chart-outline" size={20} color={getColor('Progress')} />, onPress: () => { closeSidebar(); navigation.navigate('Progress'); }, active: activeLabel === 'Progress' },
    { label: 'Leaderboard', icon: <Ionicons name="trophy-outline" size={20} color={getColor('Leaderboard')} />, onPress: () => { closeSidebar(); navigation.navigate('Leaderboard'); }, active: activeLabel === 'Leaderboard' },
    { label: 'Performance Overview', icon: <Ionicons name="analytics-outline" size={20} color={getColor('Performance Overview')} />, onPress: () => { closeSidebar(); navigation.navigate('PerformanceOverview'); }, active: activeLabel === 'Performance Overview' },
    { label: 'Notifications', icon: <Ionicons name="notifications-outline" size={20} color={getColor('Notifications')} />, onPress: () => { closeSidebar(); navigation.navigate('Notifications'); }, active: activeLabel === 'Notifications' },
    { label: 'Study Planner', icon: <Ionicons name="calendar-outline" size={20} color={getColor('Study Planner')} />, onPress: () => { closeSidebar(); navigation.navigate('StudyPlanner'); }, active: activeLabel === 'Study Planner' },
    { label: 'Register', icon: <Ionicons name="person-add-outline" size={20} color={getColor('Register')} />, onPress: () => { closeSidebar(); navigation.navigate('Register'); }, active: activeLabel === 'Register' },
    { label: 'Settings', icon: <Ionicons name="settings-outline" size={20} color={getColor('Settings')} />, onPress: () => { closeSidebar(); navigation.navigate('Settings'); }, active: activeLabel === 'Settings' },
    { label: 'Sign Out', icon: <Ionicons name="log-out-outline" size={20} color={getColor('Sign Out')} />, onPress: handleSignOut, active: activeLabel === 'Sign Out' },
    { label: 'Rate Us', icon: <Ionicons name="star-outline" size={20} color={getColor('Rate Us')} />, onPress: () => { closeSidebar(); navigation.navigate('RateUsScreen'); }, active: activeLabel === 'Rate Us' },
  ];
} 