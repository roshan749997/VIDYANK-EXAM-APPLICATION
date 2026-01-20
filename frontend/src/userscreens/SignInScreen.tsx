import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors } from '../theme';
// import GlassInput from '../components/GlassInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlankHeader from './BlankHeader';
import EmailIcon from '../../assets/icons/ULoginEmailIcon.svg';
import PassIcon from '../../assets/icons/ULoginPassIcon.svg';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const SignInScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const route = useRoute();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (route.params && route.params.showSignOutToast) {
      setTimeout(() => {
        alert('You have been signed out successfully.');
      }, 300);
    }
  }, [route.params]);

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('Email and password required.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login', {
        email: username,
        password: password,
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
        
        // Use reset instead of replace to clear the navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'NewDashboard' }],
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center' }]}> 
      <BlankHeader />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, isMobile && styles.backButtonMobile]} 
        onPress={() => navigation.navigate('Index')}
      >
        <Ionicons name="arrow-back" size={24} color="#2342f5" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
      
      {!isMobile && (
        <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center', height: '100%', marginRight: 24 }}>
          <Image source={require('../../assets/ULoginImage.png')} style={{ width: '100%', height: '90%', resizeMode: 'contain' }} />
        </View>
      )}
      <View style={{ width: isMobile ? '100%' : '32%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.loginCard}> 
          <Text style={styles.title}>Login</Text>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}><EmailIcon /></View>
            <TextInput
              style={[styles.input, { paddingLeft: 44 }]}
              placeholder="Enter Email"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}><PassIcon /></View>
            <TextInput
              style={[styles.input, { paddingLeft: 44 }]}
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.showHide}
              onPress={() => setShowPassword(v => !v)}
            >
              <Text style={{ color: '#6b7280', fontSize: 13 }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {loading ? <ActivityIndicator color="#4f46e5" style={{ marginVertical: 10 }} /> : null}
          <View style={styles.links}>
            <TouchableOpacity style={{ marginRight: 'auto' }} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginLeft: 'auto' }}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#1f2937',
    marginBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    color: '#1f2937',
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#080710',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 16,
  },
  link: {
    color: '#4f46e5',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: 15,
  },
  glassCard: {
    // removed glass effect, replaced by loginCard
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    padding: 32,
  },
  error: {
    color: '#dc2626',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2342f5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 18,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: 16,
    zIndex: 2,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showHide: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonMobile: {
    top: 40,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#2342f5',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignInScreen;
