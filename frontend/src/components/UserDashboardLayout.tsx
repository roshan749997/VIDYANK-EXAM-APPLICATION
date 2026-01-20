import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, useWindowDimensions, SafeAreaView, BackHandler, Alert } from 'react-native';
import GlassSidebar from './GlassSidebar';
import DashboardHeader from './DashboardHeader';
import BlankHeader from './BlankHeader';
import UserDetailsModal from './UserDetailsModal';
import { getUserSidebarItems } from './userSidebarItems';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDashboardLayout = ({ title, activeLabel, children }: { title: string; activeLabel: string; children: React.ReactNode }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();
  const closeSidebar = () => setSidebarCollapsed(true);
  const sidebarItems = getUserSidebarItems(navigation, closeSidebar, activeLabel);

  const handleToggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const handleUserPress = () => setShowUserModal(true);
  const closeUserModal = () => setShowUserModal(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userRaw = await AsyncStorage.getItem('currentUser');
        if (userRaw) {
          const userData = JSON.parse(userRaw);
          setUser(userData);
          console.log('User data loaded:', userData);
        } else {
          console.log('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Handle back button press
  useEffect(() => {
    const onBackPress = () => {
      if (user) {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                try {
                  await AsyncStorage.removeItem('currentUser');
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Index' }],
                  });
                } catch (error) {
                  console.error('Error during logout:', error);
                }
              },
            },
          ]
        );
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [user, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
        {/* Header full width at the top */}
        <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          <DashboardHeader
            title={title}
            onToggleSidebar={handleToggleSidebar}
            showSearch={false}
            onUserPress={handleUserPress}
            user={user}
          />
        </View>
        {/* Sidebar and content row below header */}
        {isMobile ? (
          <View style={{ flex: 1, flexDirection: 'column', minHeight: 0, position: 'relative' }}>
            {/* Overlay and Sidebar as absolute elements below the header */}
            {!sidebarCollapsed && (
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: headerHeight,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: 10,
                  }}
                  activeOpacity={1}
                  onPress={closeSidebar}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 220,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 11,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <GlassSidebar items={sidebarItems} collapsed={false} onClose={closeSidebar} />
                </View>
              </>
            )}
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', minHeight: 0, width: '100%' }}>
              {children}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
            <GlassSidebar items={sidebarItems} collapsed={sidebarCollapsed} onClose={closeSidebar} />
            <View style={{ 
              flex: 1, 
              flexDirection: 'column', 
              alignItems: 'stretch', 
              minHeight: 0, 
              width: '100%',
              paddingLeft: sidebarCollapsed ? 16 : 24, // Add padding when sidebar is visible
              paddingRight: 16,
              paddingTop: 16,
            }}>
              {children}
            </View>
          </View>
        )}
      </View>
      
      {/* User Details Modal - rendered at root level */}
      <UserDetailsModal
        user={user}
        visible={showUserModal}
        onClose={closeUserModal}
      />
    </SafeAreaView>
  );
};

export default UserDashboardLayout; 