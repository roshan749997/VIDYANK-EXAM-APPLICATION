import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Modal, Animated, Easing, StyleSheet, useWindowDimensions, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';


interface DashboardHeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onUserPress?: () => void;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  showSearch?: boolean;
  user?: any;
  hideNotification?: boolean; // NEW
  hideProfile?: boolean; // NEW
  variant?: 'full' | 'pill'; // NEW
  isAdmin?: boolean; // NEW - for admin logout button
  onLogout?: () => void; // NEW - logout handler
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  onToggleSidebar,
  onUserPress,
  searchQuery = '',
  onSearchChange,
  showSearch = true,
  user: propUser,
  hideNotification = false, // NEW
  hideProfile = false, // NEW
  variant = 'full', // NEW
  isAdmin = false, // NEW
  onLogout, // NEW
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // State management
  const [user, setUser] = useState<any>(propUser);
  const [notificationCount, setNotificationCount] = useState(3);
  const avatarRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!propUser) {
        try {
          const userRaw = await AsyncStorage.getItem('currentUser');
          if (userRaw) {
            setUser(JSON.parse(userRaw));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };
    loadUserData();
  }, [propUser]);

  // Handle user profile press
  const handleUserPress = () => {
    console.log('User icon pressed');
    if (onUserPress) {
      onUserPress();
    }
  };

  // Handle notification press
  const handleNotificationPress = () => {
    try {
      navigation.navigate('Notifications');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <>
      <View
        style={[
          variant === 'pill' ? styles.headerPill : styles.header,
          { backgroundColor: '#282FFB1A', borderRadius: 0 },
        ]}
      >
        {/* Menu button - leftmost position */}
        <TouchableOpacity onPress={onToggleSidebar} style={styles.sidebarToggle}> 
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        
        {/* Logo - after menu button */}
        {!isMobile && (
          <Image source={require('../../assets/header-logo.png')}
            style={{ width: 120, height: 48, resizeMode: 'contain', marginLeft: 16, marginRight: 32 }}
          />
        )}
        
        {/* Title */}
        <Text style={[styles.pageTitle, { marginLeft: isMobile ? 16 : 0 }]}>{title}</Text>
        {!isMobile && showSearch && onSearchChange && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search..." 
              style={styles.searchInput} 
              value={searchQuery} 
              onChangeText={onSearchChange}
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}
        <View style={styles.headerActions}>
          {!hideNotification && (
            <TouchableOpacity 
              style={styles.notificationBtn} 
              onPress={handleNotificationPress}
            >
              <Ionicons name="notifications-outline" size={24} color="#000" />
              {notificationCount > 0 && (
                <View style={styles.notificationIndicator}>
                  <Text style={styles.notificationCount}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {!hideProfile && (
            <TouchableOpacity
              style={styles.userProfile}
              onPress={handleUserPress}
              activeOpacity={0.7}
              ref={avatarRef}
            >
              <View style={styles.userAvatar}>
                <Ionicons name="person-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
          {isAdmin && onLogout && (
            <TouchableOpacity
              style={[
                styles.logoutButton,
                isMobile && styles.logoutButtonMobile
              ]}
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.logoutButtonText,
                isMobile && styles.logoutButtonTextMobile
              ]}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
    margin: 0,
    borderRadius: 24,
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: '100%',
  },
  // NEW: pill/oval style for admin
  headerGradientPill: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    margin: 10,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',         // Set to 100% for full width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 0,
    elevation: 0,
    shadowColor: 'transparent',
    width: '100%',
  },
  sidebarToggle: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginLeft: 40,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  notificationBtn: {
    position: 'relative',
    marginRight: 20,
    padding: 5,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userProfile: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    maxWidth: 120,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 340,
    maxWidth: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  userAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalUserEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  modalUserPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 18,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Logout button styles - same as admin button from index page
  logoutButton: {
    backgroundColor: '#E0115E', // Same red color as admin button
    borderRadius: 28,
    paddingHorizontal: 24, // Increased from 18
    paddingVertical: 8, // Increased from 6
    marginLeft: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18, // Increased from 16
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  logoutButtonMobile: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
  },
  logoutButtonTextMobile: {
    fontSize: 14,
  },
});

export default DashboardHeader; 