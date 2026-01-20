import React, { useRef, useState, ReactNode } from 'react';
import { View, StyleSheet, useWindowDimensions, Modal, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from '../userscreens/DashboardHeader';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as logoutUser } from '../utils/authUtils';


interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

const getAdminSidebarItems = (route: any) => {
  const getColor = (key: string) => (route.name === key ? '#fff' : '#000');
  return [
    { label: 'Dashboard', icon: <Ionicons name="speedometer-outline" size={22} color={getColor('AdminDashboard')} />, key: 'AdminDashboard' },
    { label: 'Exams', icon: <Ionicons name="document-text-outline" size={22} color={getColor('Exams')} />, key: 'Exams' },
    { label: 'Candidates', icon: <Ionicons name="people-outline" size={22} color={getColor('Candidates')} />, key: 'Candidates' },
    { label: 'Questions', icon: <Ionicons name="help-circle-outline" size={22} color={getColor('QuestionsPage')} />, key: 'QuestionsPage' },
    { label: 'Statistics', icon: <FontAwesome5 name="chart-bar" size={20} color={getColor('StatisticsPage')} />, key: 'StatisticsPage' },
    { label: 'Settings', icon: <Ionicons name="settings-outline" size={22} color={getColor('AdminSettings')} />, key: 'AdminSettings' },
    { label: 'Logout', icon: <Ionicons name="log-out-outline" size={22} color={getColor('logout')} />, key: 'logout' },
  ];
};

const AdminLayout = ({ title, children }: AdminLayoutProps) => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const handleSidebarNav = async (key: string) => {
    if (key === 'logout') {
      // Clear auth/session and prevent back navigation
      await logoutUser();
      await AsyncStorage.removeItem('companyId');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('isAdmin');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminLogin' as never }],
      });
      return;
    }
    navigation.navigate(key as never);
    setSidebarCollapsed(isMobile);
  };

  const sidebarItems = getAdminSidebarItems(route).map((item: any) => ({
    ...item,
    onPress: () => handleSidebarNav(item.key),
    active: route.name === item.key,
  }));

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
        {/* Header full width at the top */}
        <View ref={headerRef} onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          <DashboardHeader 
            title={title} 
            onToggleSidebar={handleToggleSidebar} 
            showSearch={false} 
            hideNotification={true} 
            hideProfile={true} 
            variant="pill"
            isAdmin={true}
            onLogout={handleSidebarNav.bind(null, 'logout')}
          />
        </View>
        {/* Sidebar and content row below header (always, even on mobile) */}
        <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
          <GlassSidebar items={sidebarItems} collapsed={sidebarCollapsed} onClose={() => setSidebarCollapsed(true)} admin={true} />
          <View
            style={[
              styles.content,
              isMobile && styles.contentMobile,
              isMobile && !sidebarCollapsed && { marginLeft: 220 },
              { minHeight: 0 },
            ]}
          >
            {children}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#f8fafc' },
  content: { flex: 1, padding: 24, justifyContent: 'flex-start', alignItems: 'stretch' },
  contentMobile: { padding: 8 },
});

export default AdminLayout; 