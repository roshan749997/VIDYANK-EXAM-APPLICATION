import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import EmailIcon from '../../assets/icons/ULoginEmailIcon.svg';
import PassIcon from '../../assets/icons/ULoginPassIcon.svg';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#282FFB';
const WHITE = '#fff';

const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', {
        email: email.trim(),
        password,
      });

      if (!data.isAdmin) {
        setError('Not authorized as an admin');
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
      // Keep legacy keys if needed by legacy components
      await AsyncStorage.setItem('currentUser', JSON.stringify(data));
      await AsyncStorage.setItem('isAdmin', 'true');

      navigation.replace('AdminDashboard');
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { flexDirection: isMobile ? 'column' : 'row' }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, isMobile && styles.backButtonMobile]}
        onPress={() => navigation.navigate('Index')}
      >
        <Ionicons name="arrow-back" size={24} color="#282FFB" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      {/* Left: Image (desktop only) */}
      {!isMobile && (
        <View style={styles.left}>
          <Image source={require('../../assets/icons/ALoginImage.png')} style={styles.image} resizeMode="contain" />
        </View>
      )}
      {/* Right: Login Form */}
      <View style={[styles.right, isMobile && { width: '100%', alignItems: 'center' }]}>
        <View style={[styles.form, isMobile && { width: '100%', maxWidth: 400 }]}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}><EmailIcon /></View>
            <TextInput
              style={[styles.input, { paddingLeft: 44 }]}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
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
            <TouchableOpacity style={styles.showHide} onPress={() => setShowPassword(v => !v)}>
              <Text style={{ color: BLUE, fontSize: 13 }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 18 }}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {loading ? <ActivityIndicator color={BLUE} style={{ marginVertical: 10 }} /> : null}
          <TouchableOpacity style={styles.loginBtn} onPress={handleAdminLogin} disabled={loading}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: 600,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 0,
  },
  left: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    borderRadius: 0,
    margin: 32,
    backgroundColor: '#fff',
    maxWidth: 540,
    minWidth: 340,
  },
  image: {
    width: 620,
    height: 620,
  },
  imageMobile: {
    width: 220,
    height: 220,
  },
  right: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 400,
    paddingHorizontal: 32,
    maxWidth: 540,
    width: '100%',
  },
  form: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 34,
    color: '#111',
    marginBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  label: {
    color: '#222',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'left',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    color: '#111',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#282FFB',
    marginBottom: 0,
  },
  showHide: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  forgot: {
    color: '#222',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#dc2626',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
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
    color: '#282FFB',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminLoginScreen; 