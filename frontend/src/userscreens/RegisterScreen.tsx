import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, ActivityIndicator, ScrollView, TextInput, Modal, Alert, Platform, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors } from '../theme';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import BlankHeader from './BlankHeader';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const { width } = Dimensions.get('window');

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [referralSource, setReferralSource] = useState('Social Media');
  const [instituteName, setInstituteName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Dropdown states
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showReferralPicker, setShowReferralPicker] = useState(false);

  const referralSources = [
    'Social Media',
    'Friends',
    'Teacher',
    'Internet',
    'Advertisement',
    'Other'
  ];

  useEffect(() => {
    setTimeout(() => {
      setCategories(['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']);
    }, 500);
  }, []);

  const handleRegister = async () => {
    setError('');
    setSuccess(false);
    
    // Validation
    if (!firstName || !lastName || !email || !password || !city || !phone || !category || !referralSource || !instituteName) {
      setError('All fields are required.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms and Conditions.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/users', {
        firstName,
        lastName,
        email,
        password,
        city,
        phone,
        category,
        referralSource,
        instituteName,
        termsAccepted,
      });

      if (response.data) {
        // Store user info and token
        const userInfo = {
          _id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          isAdmin: response.data.isAdmin,
          token: response.data.token,
        };
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        await AsyncStorage.setItem('currentUser', JSON.stringify(userInfo));
        
        setSuccess(true);
        setTimeout(() => {
          navigation.replace('SignIn');
        }, 1200);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const DropdownPicker = ({ 
    visible, 
    onClose, 
    onSelect, 
    data, 
    selectedValue, 
    title 
  }: {
    visible: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    data: string[];
    selectedValue: string;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} accessible accessibilityLabel="Close dropdown picker">
        <TouchableOpacity activeOpacity={1} style={styles.dropdownCard} onPress={() => {}}>
          <View style={styles.pickerHeaderRow}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} accessible accessibilityLabel="Done selecting">
              <Text style={styles.pickerDone}>Done</Text>
            </TouchableOpacity>
          </View>
          {/* Platform-specific dropdown: web uses <select>, mobile uses Picker */}
          {Platform.OS === 'web' ? (
            <select
              value={selectedValue}
              onChange={e => { onSelect(e.target.value); onClose(); }}
              style={styles.webSelect}
            >
              <option value="">Select an option</option>
              {data.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <Picker
              selectedValue={selectedValue}
              onValueChange={value => { onSelect(value); onClose(); }}
              itemStyle={{ fontSize: 18, color: '#22223b' }}
            >
              <Picker.Item label="Select an option" value="" color="#9ca3af" />
              {data.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} color="#22223b" />
              ))}
            </Picker>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <BlankHeader />
      <View style={styles.mainContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={[
            styles.formContainer, 
            isMobile && styles.formContainerMobile,
            isTablet && styles.formContainerTablet,
            isDesktop && styles.formContainerDesktop
          ]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconCircle}>
                <Animated.Text style={{ fontSize: 32 }}>📝</Animated.Text>
              </View>
              <Text style={[
                styles.title, 
                isMobile && { fontSize: 24 },
                isTablet && { fontSize: 28 },
                isDesktop && { fontSize: 34 }
              ]}>Register</Text>
            </View>
            <View style={[
              styles.formGrid, 
              isMobile && styles.formGridMobile,
              isTablet && styles.formGridTablet,
              isDesktop && styles.formGridDesktop
            ]}>
              <View style={styles.formCol}>
                <Text style={styles.label}>First Name</Text>
                <GlassInput placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
                <Text style={styles.label}>Last Name</Text>
                <GlassInput placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
                <Text style={styles.label}>Email</Text>
                <GlassInput placeholder="example@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
                <Text style={styles.label}>Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <GlassInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, marginBottom: 0 }, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>City</Text>
                <GlassInput placeholder="Enter your city" value={city} onChangeText={setCity} style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
                <Text style={styles.label}>Contact Number</Text>
                <GlassInput placeholder="Mobile No" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text style={[styles.dropdownText, !category && styles.placeholderText]}>
                    {category || (categories.length === 0 ? 'Loading categories...' : 'Select category')}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                
                <Text style={styles.label}>How did you hear about vidyȧक?</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowReferralPicker(true)}
                >
                  <Text style={[styles.dropdownText, !referralSource && styles.placeholderText]}>
                    {referralSource || 'Select source'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                
                <Text style={styles.label}>Institute / Class Name</Text>
                <GlassInput placeholder="Enter institute / class name" value={instituteName} onChangeText={setInstituteName} style={[styles.input, isMobile && { padding: 10, fontSize: 14 }, isTablet && { padding: 12, fontSize: 15 }, isDesktop && { padding: 14, fontSize: 16 }]} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} style={{ marginRight: 8 }}>
                    <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                      {termsAccepted && <Text style={styles.checkboxText}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ color: '#374151' }}>I accept the <Text style={{ color: '#4f46e5', textDecorationLine: 'underline' }}>Terms and Conditions</Text></Text>
                </View>
              </View>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading ? <ActivityIndicator color="#4f46e5" style={{ marginVertical: 10 }} /> : null}
            {success ? <Text style={styles.success}>Registration successful! Redirecting to Sign In...</Text> : null}
            <GlassButton title="Register" onPress={handleRegister} style={{ width: '100%', marginTop: 10 }} variant="primary" />
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.linkBtn}>
              <Text style={styles.link}>Back to Sign In</Text>
            </TouchableOpacity>
                      </View>
        </ScrollView>

        {/* Category Picker Modal */}
        <DropdownPicker
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          onSelect={(value) => {
            setCategory(value);
            setShowCategoryPicker(false);
          }}
          data={categories}
          selectedValue={category}
          title="Select Category"
        />

        {/* Referral Source Picker Modal */}
        <DropdownPicker
          visible={showReferralPicker}
          onClose={() => setShowReferralPicker(false)}
          onSelect={(value) => {
            setReferralSource(value);
            setShowReferralPicker(false);
          }}
          data={referralSources}
          selectedValue={referralSource}
          title="Select Referral Source"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 34,
    color: '#1f2937',
    marginBottom: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 15,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(243,244,246,0.9)',
    borderRadius: 8,
    padding: 14,
    color: '#1f2937',
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: 'rgba(243,244,246,0.9)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  dropdownText: {
    color: '#1f2937',
    fontSize: 16,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'nowrap',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownArrow: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4f46e5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4f46e5',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    maxWidth: 370,
    alignSelf: 'center',
    paddingBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22223b',
  },
  pickerDone: {
    fontSize: 16,
    color: '#5a4ff3',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  webSelect: {
    width: '100%',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  error: {
    color: '#dc2626',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linkBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: '#4f46e5',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: 15,
  },
  formContainer: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  formContainerMobile: {
    maxWidth: '100%',
    padding: 16,
  },
  formContainerTablet: {
    maxWidth: 800,
    padding: 24,
  },
  formContainerDesktop: {
    maxWidth: 1200,
    padding: 32,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  formGrid: {
    flexDirection: 'column',
    gap: 0,
  },
  formGridMobile: {
    flexDirection: 'column',
    gap: 0,
  },
  formGridTablet: {
    flexDirection: 'row',
    gap: 24,
  },
  formGridDesktop: {
    flexDirection: 'row',
    gap: 48,
  },
  formCol: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 0,
  },
  success: {
    color: '#16a34a',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RegisterScreen;
