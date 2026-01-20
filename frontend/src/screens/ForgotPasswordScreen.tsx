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
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlankHeader from '../components/BlankHeader';
import EmailIcon from '../../assets/icons/ULoginEmailIcon.svg';
import PassIcon from '../../assets/icons/ULoginPassIcon.svg';
import { Ionicons } from '@expo/vector-icons';
import otpService from '../utils/otpService';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showDevOtp, setShowDevOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpButtonPressed, setOtpButtonPressed] = useState(false);
  const [verifyOtpButtonPressed, setVerifyOtpButtonPressed] = useState(false);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpCountdown]);

  const sendOTP = async (email: string, mobile: string) => {
    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setShowDevOtp(true); // Show OTP for development
      
      // For development, always return true
      return true;
      
      // Commented out actual OTP sending for development
      /*
      let success = false;
      
      // Send Email OTP
      if (email) {
        success = await otpService.sendEmailOTP(email, newOtp);
      }
      
      // Send SMS OTP
      if (mobile) {
        success = await otpService.sendSMSOTP(mobile, newOtp);
      }
      
      return success;
      */
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const handleSendOtp = async () => {
    if (!email && !mobile) {
      Alert.alert('Error', 'Please enter email or mobile number to send OTP');
      return;
    }
    
    setOtpButtonPressed(true);
    setOtpLoading(true);
    const success = await sendOTP(email, mobile);
    setOtpLoading(false);
    
    if (success) {
      setOtpSent(true);
      setOtpCountdown(60); // 60 seconds countdown
      Alert.alert('Success', `OTP sent to ${email || mobile}`);
    } else {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const validateOTP = () => {
    return otpService.validateOTPFormat(otp) && otp === generatedOtp;
  };

  const handleVerifyOtp = async () => {
    setError('');
    setSuccess('');
    
    if (!email && !mobile) {
      setError('Please enter email or mobile number.');
      return;
    }
    
    if (!otp) {
      setError('Please enter OTP.');
      return;
    }
    
    if (!validateOTP()) {
      setError('Invalid OTP. Please check and try again.');
      return;
    }
    
    setVerifyOtpButtonPressed(true);
    setLoading(true);
    try {
      // OTP is valid, show password fields
      setOtpVerified(true);
      setSuccess('OTP verified successfully! Please enter your new password.');
    } catch (e) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    
    if (!newPassword) {
      setError('Please enter new password.');
      return;
    }
    
    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    try {
      // Update password in AsyncStorage
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      // Find user by email or mobile
      const userIndex = users.findIndex((u: any) => 
        u.email === email || u.phone === mobile
      );
      
      if (userIndex === -1) {
        setError('User not found.');
        setLoading(false);
        return;
      }
      
      // Update password
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 2000);
    } catch (e) {
      setError('Password reset failed.');
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
        onPress={() => navigation.navigate('SignIn')}
      >
        <Ionicons name="arrow-back" size={24} color="#2342f5" />
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
      
      {!isMobile && (
        <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center', height: '100%', marginRight: 24 }}>
          <Image source={require('../../assets/ULoginImage.png')} style={{ width: '100%', height: '90%', resizeMode: 'contain' }} />
        </View>
      )}
      <View style={{ width: isMobile ? '100%' : '32%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, !isMobile && styles.scrollViewContentDesktop]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginCard}> 
          <Text style={styles.title}>Forgot Password</Text>
          
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
          
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}><PassIcon /></View>
            <TextInput
              style={[styles.input, { paddingLeft: 44 }]}
              placeholder="Enter Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
          </View>
          
                     <Text style={styles.label}>OTP</Text>
           <View style={styles.inputWrapper}>
             <View style={styles.inputIcon}><PassIcon /></View>
             <TextInput
               style={[styles.input, { paddingLeft: 44 }]}
               placeholder="Enter OTP"
               value={otp}
               onChangeText={setOtp}
               keyboardType="numeric"
               placeholderTextColor="#888"
             />
           </View>
           
           {/* Password fields - shown after OTP verification */}
           {otpVerified && (
             <>
               <Text style={styles.label}>New Password</Text>
               <View style={styles.inputWrapper}>
                 <View style={styles.inputIcon}><PassIcon /></View>
                 <TextInput
                   style={[styles.input, { paddingLeft: 44, paddingRight: 50 }]}
                   placeholder="Enter New Password"
                   value={newPassword}
                   onChangeText={setNewPassword}
                   secureTextEntry={!showPassword}
                   placeholderTextColor="#888"
                 />
                 <TouchableOpacity 
                   style={styles.showHideButton}
                   onPress={() => setShowPassword(!showPassword)}
                 >
                   <Text style={styles.showHideText}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                 </TouchableOpacity>
               </View>
               
               <Text style={styles.label}>Confirm Password</Text>
               <View style={styles.inputWrapper}>
                 <View style={styles.inputIcon}><PassIcon /></View>
                 <TextInput
                   style={[styles.input, { paddingLeft: 44, paddingRight: 50 }]}
                   placeholder="Confirm New Password"
                   value={confirmPassword}
                   onChangeText={setConfirmPassword}
                   secureTextEntry={!showConfirmPassword}
                   placeholderTextColor="#888"
                 />
                 <TouchableOpacity 
                   style={styles.showHideButton}
                   onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                 >
                   <Text style={styles.showHideText}>{showConfirmPassword ? '👁' : '👁‍🗨'}</Text>
                 </TouchableOpacity>
               </View>
             </>
           )}
          
                     {error ? <Text style={styles.error}>{error}</Text> : null}
           {success ? <Text style={styles.success}>{success}</Text> : null}
           
                       {/* Development OTP Display */}
            {showDevOtp && generatedOtp && (
              <View style={styles.devOtpContainer}>
                <Text style={styles.devOtpLabel}>Development OTP:</Text>
                <Text style={styles.devOtpText}>{generatedOtp}</Text>
              </View>
            )}
           
           {loading ? <ActivityIndicator color="#4f46e5" style={{ marginVertical: 10 }} /> : null}
          
                     <View style={styles.buttonContainer}>
             <TouchableOpacity 
               onPress={handleSendOtp} 
               style={[
                 styles.sendOtpButton, 
                 otpButtonPressed && styles.sendOtpButtonPressed,
                 otpLoading && styles.disabledButton
               ]}
               disabled={otpLoading || otpCountdown > 0}
             >
               <Text style={[
                 styles.sendOtpButtonText,
                 otpButtonPressed && styles.sendOtpButtonTextPressed
               ]}>
                 {otpLoading ? 'Sending...' : otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Send OTP'}
               </Text>
             </TouchableOpacity>
             
             {!otpVerified ? (
               <TouchableOpacity 
                 onPress={handleVerifyOtp} 
                 style={[
                   styles.loginButton,
                   verifyOtpButtonPressed && styles.loginButtonPressed
                 ]}
               >
                 <Text style={[
                   styles.loginButtonText,
                   verifyOtpButtonPressed && styles.loginButtonTextPressed
                 ]}>Verify OTP</Text>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity onPress={handleResetPassword} style={styles.loginButton}>
                 <Text style={styles.loginButtonText}>Update Password</Text>
               </TouchableOpacity>
             )}
           </View>
          
                     <View style={styles.links}>
             <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginLeft: 'auto' }}>
               <Text style={styles.link}>Back to Login</Text>
             </TouchableOpacity>
           </View>
         </View>
       </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
  sendOtpButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#282FFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  sendOtpButtonPressed: {
    backgroundColor: '#282FFB',
    borderColor: '#282FFB',
  },
  sendOtpButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  sendOtpButtonTextPressed: {
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#282FFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  loginButtonPressed: {
    backgroundColor: '#282FFB',
    borderColor: '#282FFB',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginButtonTextPressed: {
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  link: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonMobile: {
    top: 40,
    left: 10,
  },
     backButtonText: {
     marginLeft: 8,
     fontSize: 16,
     color: '#2342f5',
     fontWeight: '500',
   },
       // Development OTP styles
    devOtpContainer: {
      backgroundColor: '#fef3c7',
      borderWidth: 1,
      borderColor: '#f59e0b',
      borderRadius: 6,
      padding: 8,
      marginBottom: 12,
      alignItems: 'center',
    },
    devOtpLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#92400e',
      marginBottom: 4,
    },
    devOtpText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#92400e',
      letterSpacing: 2,
    },
   showHideButton: {
     position: 'absolute',
     right: 12,
     top: 12,
     zIndex: 1,
   },
   showHideText: {
     fontSize: 18,
   },
   scrollView: {
     flex: 1,
     width: '100%',
   },
   scrollViewContent: {
     flexGrow: 1,
     justifyContent: 'flex-start',
     alignItems: 'center',
     paddingVertical: 60,
     paddingTop: 100,
     minHeight: '100%',
   },
   scrollViewContentDesktop: {
     paddingVertical: 80,
     paddingTop: 120,
     justifyContent: 'flex-start',
   },
 });

export default ForgotPasswordScreen; 