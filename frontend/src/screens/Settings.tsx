import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Dimensions,
  TextInput,
  Modal,
  useWindowDimensions,
  Platform,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassSidebar from '../components/GlassSidebar';
import GlassInput from '../components/GlassInput';
import { colors } from '../theme';
import * as Clipboard from 'expo-clipboard';
import DashboardHeader from '../components/DashboardHeader';
import BlankHeader from '../components/BlankHeader';
import { getUserSidebarItems } from '../components/userSidebarItems';
import UserDashboardLayout from '../components/UserDashboardLayout';
import api from '../services/api';

const { width } = Dimensions.get('window');

const Settings: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768; // Mobile breakpoint
  const isTablet = windowWidth >= 768 && windowWidth < 1024; // Tablet breakpoint
  const isDesktop = windowWidth >= 1024; // Desktop breakpoint
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State for notification settings
  const [notifications, setNotifications] = useState(true);
  const [examReminder, setExamReminder] = useState(true);
  const [resultNotifications, setResultNotifications] = useState(true);
  const [testSeriesUpdates, setTestSeriesUpdates] = useState(true);

  // State for user data
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State for reset password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // State for profile settings
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileCategory, setProfileCategory] = useState('');
  const [profileReferralSource, setProfileReferralSource] = useState('');
  const [profileInstituteName, setProfileInstituteName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setSidebarCollapsed(isMobile);
      loadUserData();
    }, [isMobile])
  );

  useEffect(() => {
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
              onPress: handleSignOut,
            },
          ]
        );
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userRaw = await AsyncStorage.getItem('currentUser');
      if (userRaw) {
        const userData = JSON.parse(userRaw);
        setUser(userData);
        setProfileFirstName(userData.firstName || '');
        setProfileLastName(userData.lastName || '');
        setProfileEmail(userData.email || '');
        setProfilePhone(userData.phone || '');
      }

      // Load notification preferences
      const notificationPrefs = await AsyncStorage.getItem('notificationPreferences');
      if (notificationPrefs) {
        const prefs = JSON.parse(notificationPrefs);
        setNotifications(prefs.notifications ?? true);
        setExamReminder(prefs.examReminder ?? true);
        setResultNotifications(prefs.resultNotifications ?? true);
        setTestSeriesUpdates(prefs.testSeriesUpdates ?? true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save notification preferences
  const saveNotificationPreferences = async () => {
    try {
      const prefs = {
        notifications,
        examReminder,
        resultNotifications,
        testSeriesUpdates,
      };
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  // Notification toggle handlers
  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    await saveNotificationPreferences();
    console.log(`Notifications are ${value ? 'enabled' : 'disabled'}`);
  };

  const handleExamReminderToggle = async (value: boolean) => {
    setExamReminder(value);
    await saveNotificationPreferences();
    console.log(`Exam reminders are ${value ? 'enabled' : 'disabled'}`);
  };

  const handleResultNotificationsToggle = async (value: boolean) => {
    setResultNotifications(value);
    await saveNotificationPreferences();
    console.log(`Result notifications are ${value ? 'enabled' : 'disabled'}`);
  };

  const handleTestSeriesUpdatesToggle = async (value: boolean) => {
    setTestSeriesUpdates(value);
    await saveNotificationPreferences();
    console.log(`Test series updates are ${value ? 'enabled' : 'disabled'}`);
  };

  // Button handlers
  const handleForgotPassword = () => {
    setResetEmail(user?.email || '');
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would call your backend API here
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: resetEmail })
      // });

      Alert.alert(
        'Reset Link Sent',
        `Password reset instructions have been sent to ${resetEmail}`,
        [
          {
            text: 'OK',
            onPress: () => setShowResetModal(false)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleShareProfile = async () => {
    Alert.alert('DEBUG', 'Share Profile button pressed');
    if (!user) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    const profileData = {
      name: user.name,
      email: user.email,
      achievements: user.achievements || [],
      testScores: user.testScores || [],
      rank: user.rank || 'N/A'
    };

    const profileText = `Check out my profile on Vidyank!\n\nName: ${profileData.name}\nEmail: ${profileData.email}\nRank: ${profileData.rank}\n\nDownload the app: https://play.google.com/store/apps/details?id=com.vidyank.app`;

    try {
      await Clipboard.setString(profileText);
      Alert.alert('Success', 'Profile information copied to clipboard!');
    } catch (error) {
      Alert.alert('Clipboard Error', 'Failed to copy profile information. Please copy manually.');
      console.log('Clipboard error:', error);
    }
  };

  const handleRateUs = () => {
    navigation.navigate('RateUsScreen');
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('sessionData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Index' }],
      });
    } catch (error) {
      Alert.alert('SignOut Error', 'Failed to sign out');
    }
  };

  const handlePrivacyPolicy = () => {
    const privacyPolicyUrl = 'https://vidyank.com/privacy-policy';
    Linking.openURL(privacyPolicyUrl).catch(() => {
      Alert.alert('Error', 'Unable to open privacy policy');
    });
  };

  const handleEditProfile = () => {
    setProfileFirstName(user?.firstName || '');
    setProfileLastName(user?.lastName || '');
    setProfileEmail(user?.email || '');
    setProfilePhone(user?.phone || '');
    setProfileCity(user?.city || '');
    setProfileCategory(user?.category || '');
    setProfileReferralSource(user?.referralSource || '');
    setProfileInstituteName(user?.instituteName || '');
    setShowProfileModal(true);
  };

  const handleSaveProfile = async () => {
    if (!profileFirstName.trim() || !profileLastName.trim() || !profileEmail.trim()) {
      Alert.alert('Error', 'First name, last name and email are required');
      return;
    }

    try {
      const { data } = await api.put('/users/profile', {
        firstName: profileFirstName.trim(),
        lastName: profileLastName.trim(),
        email: profileEmail.trim(),
        phone: profilePhone.trim(),
        city: profileCity.trim(),
        category: profileCategory.trim(),
        referralSource: profileReferralSource.trim(),
        instituteName: profileInstituteName.trim(),
      });

      const updatedUser = {
        ...data,
        password: user.password, // Keep existing password field if needed by frontend
      };

      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Keep for legacy compatibility
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));

      setUser(updatedUser);
      setShowProfileModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    }
  };

  const closeSidebar = () => setSidebarCollapsed(true);
  const sidebarItems = getUserSidebarItems(navigation, closeSidebar, 'Settings');

  const SettingItem: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
    <View style={[styles.settingItem, style]}>
      {children}
    </View>
  );

  const SettingSection: React.FC<{ title: string; children: React.ReactNode; icon?: string }> = ({ title, children, icon }) => (
    <View style={styles.settingSection}>
      <View style={styles.sectionHeader}>
        {icon && <Ionicons name={icon as any} size={24} color={colors.primary} style={styles.sectionIcon} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const ToggleItem: React.FC<{ label: string; value: boolean; onToggle: (value: boolean) => void; description?: string }> = ({ label, value, onToggle, description }) => (
    <SettingItem>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleLabel}>{label}</Text>
          {description && <Text style={styles.toggleDescription}>{description}</Text>}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#e5e7eb', true: colors.primary }}
          thumbColor={value ? '#ffffff' : '#ffffff'}
          ios_backgroundColor="#e5e7eb"
        />
      </View>
    </SettingItem>
  );

  // Helper for icon mapping
  const accountProfileButtons = [
    {
      title: 'Edit Profile',
      icon: <Ionicons name="person-circle-outline" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handleEditProfile,
    },
    {
      title: 'Reset Password',
      icon: <Ionicons name="key-outline" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handleForgotPassword,
    },
    {
      title: 'Share Profile',
      icon: <Ionicons name="share-social-outline" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handleShareProfile,
    },
    {
      title: 'Rate Us',
      icon: <Ionicons name="star-outline" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handleRateUs,
    },
    {
      title: 'Sign Out',
      icon: <MaterialCommunityIcons name="logout" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handleSignOut,
    },
    {
      title: 'Privacy Policy',
      icon: <Ionicons name="document-text-outline" size={32} color="#282FFB" style={{ marginRight: 12 }} />,
      onPress: handlePrivacyPolicy,
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <UserDashboardLayout title="Settings" activeLabel="Settings">
      <ScrollView style={styles.scrollContainer} contentContainerStyle={[styles.contentContainer, { paddingBottom: 80 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsPage}>
          {/* Responsive layout - side by side on desktop, stacked on mobile and tablet */}
          <View style={[
            styles.cardsRow,
            isMobile ? styles.cardsRowMobile : isTablet ? styles.cardsRowTablet : styles.cardsRowDesktop
          ]}>
            {/* Notification Card */}
            <View style={[
              styles.enhancedCard,
              isMobile ? styles.enhancedCardMobile : isTablet ? styles.enhancedCardTablet : styles.enhancedCardDesktop
            ]}>
              <SettingSection title="Notification Settings" icon="notifications-outline">
                <View style={[
                  styles.buttonGrid,
                  isMobile ? styles.buttonGridMobile : isTablet ? styles.buttonGridTablet : styles.buttonGridDesktop
                ]}>
                  <SettingItem style={[
                    styles.buttonGridItem,
                    isMobile ? styles.buttonGridItemMobile : isTablet ? styles.buttonGridItemTablet : styles.buttonGridItemDesktop
                  ]}>
                    <ToggleItem
                      label="Enable Notifications"
                      value={notifications}
                      onToggle={handleNotificationToggle}
                      description="Receive push notifications for important updates"
                    />
                  </SettingItem>
                  <SettingItem style={[
                    styles.buttonGridItem,
                    isMobile ? styles.buttonGridItemMobile : isTablet ? styles.buttonGridItemTablet : styles.buttonGridItemDesktop
                  ]}>
                    <ToggleItem
                      label="Exam Reminders"
                      value={examReminder}
                      onToggle={handleExamReminderToggle}
                      description="Get reminded about upcoming exams"
                    />
                  </SettingItem>
                  <SettingItem style={[
                    styles.buttonGridItem,
                    isMobile ? styles.buttonGridItemMobile : isTablet ? styles.buttonGridItemTablet : styles.buttonGridItemDesktop
                  ]}>
                    <ToggleItem
                      label="Result Notifications"
                      value={resultNotifications}
                      onToggle={handleResultNotificationsToggle}
                      description="Get notified when exam results are available"
                    />
                  </SettingItem>
                  <SettingItem style={[
                    styles.buttonGridItem,
                    isMobile ? styles.buttonGridItemMobile : isTablet ? styles.buttonGridItemTablet : styles.buttonGridItemDesktop
                  ]}>
                    <ToggleItem
                      label="Test Series Updates"
                      value={testSeriesUpdates}
                      onToggle={handleTestSeriesUpdatesToggle}
                      description="Receive updates about new test series"
                    />
                  </SettingItem>
                </View>
              </SettingSection>
            </View>

            {/* Account and Profile Card */}
            <View style={[
              styles.enhancedCard,
              isMobile ? styles.enhancedCardMobile : isTablet ? styles.enhancedCardTablet : styles.enhancedCardDesktop
            ]}>
              <SettingSection title="Account and Profile" icon="person-outline">
                {(isMobile || isTablet) ? (
                  <View style={styles.profileButtonCol}>
                    {accountProfileButtons.map((btn) => (
                      <TouchableOpacity
                        key={btn.title}
                        style={styles.profileCardButton}
                        onPress={btn.onPress}
                        activeOpacity={0.85}
                      >
                        {btn.icon}
                        <Text style={styles.profileCardText}>{btn.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.profileButtonRow}>
                    {accountProfileButtons.map((btn) => (
                      <TouchableOpacity
                        key={btn.title}
                        style={styles.profileCardButton}
                        onPress={btn.onPress}
                        activeOpacity={0.85}
                      >
                        {btn.icon}
                        <Text style={styles.profileCardText}>{btn.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </SettingSection>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Reset Password Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>Enter your email to receive reset instructions</Text>

            <GlassInput
              value={resetEmail}
              onChangeText={setResetEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowResetModal(false)}
                style={styles.cancelButton}
              />
              <GlassButton
                title={resetLoading ? "Sending..." : "Send Reset Link"}
                onPress={handleResetPassword}
                style={styles.confirmButton}
                disabled={resetLoading}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProfileModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => { }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={styles.closeButton} accessibilityLabel="Close Edit Profile">
                <Text style={{ fontSize: 22, color: colors.text, marginLeft: 8 }}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  value={profileFirstName}
                  onChangeText={setProfileFirstName}
                  placeholder="Enter your first name"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  value={profileLastName}
                  onChangeText={setProfileLastName}
                  placeholder="Enter your last name"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  value={profileEmail}
                  onChangeText={setProfileEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  value={profilePhone}
                  onChangeText={setProfilePhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  value={profileCity}
                  onChangeText={setProfileCity}
                  placeholder="Enter your city"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  value={profileCategory}
                  onChangeText={setProfileCategory}
                  placeholder="Enter your category"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Referral Source</Text>
                <TextInput
                  value={profileReferralSource}
                  onChangeText={setProfileReferralSource}
                  placeholder="How did you hear about us?"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Institute/Class Name</Text>
                <TextInput
                  value={profileInstituteName}
                  onChangeText={setProfileInstituteName}
                  placeholder="Enter institute/class name"
                  style={styles.textInput}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowProfileModal(false)}
                style={styles.cancelButton}
              />
              <GlassButton
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.confirmButton}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  settingsPage: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  mainTitle: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  mainSubtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    maxWidth: 400,
  },
  containerWrapper: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 24,
  },
  leftContainer: {
    width: width > 768 ? '48%' : '100%',
  },
  rightContainer: {
    width: width > 768 ? '48%' : '100%',
  },
  enhancedCard: {
    backgroundColor: '#282FFB1A',
    borderRadius: 0,
    padding: 24,
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 16,
  },
  enhancedCardMobile: {
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    padding: 20,
    marginBottom: 16,
  },
  enhancedCardDesktop: {
    width: '48%',
    minWidth: 0,
    maxWidth: '48%',
    padding: 24,
    marginBottom: 0,
  },
  enhancedCardTablet: {
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    padding: 24,
    marginBottom: 16,
  },
  settingSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#282FFB',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  settingItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  privacyPolicyItem: {
    paddingHorizontal: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  settingButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: 'transparent',
    elevation: 0,
    marginBottom: 8,
  },
  signOutButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: 'transparent',
    elevation: 0,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31,41,55,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sidebarToggle: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginBottom: 24,
  },
  cardsRowMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  cardsRowDesktop: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 24,
  },
  cardsRowTablet: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 8,
  },
  buttonGridMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  buttonGridTablet: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 8,
  },
  buttonGridItem: {
    width: '100%',
    marginBottom: 8,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  buttonGridItemMobile: {
    width: '100%',
    marginBottom: 8,
  },
  buttonGridItemDesktop: {
    width: '48%',
    marginBottom: 12,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  buttonGridItemTablet: {
    width: '100%',
    marginBottom: 8,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  profileButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 8,
    marginBottom: 8,
  },
  profileButtonCol: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  profileCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: '#282FFB',
    borderRadius: 14,
    paddingVertical: 28, // increased from 18
    paddingHorizontal: 18,
    minWidth: 220,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    shadowColor: 'transparent',
    gap: 22, // increased space between icon and text
  },
  profileCardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});

export default Settings; 