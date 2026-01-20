import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const StartYourJourney = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenthMarks: '',
    twelfthMarks: '',
    bachelorDegree: '',
    masterDegree: '',
    selectCourse: 'UPSC',
    aboutUs: 'Social media',
  });

  const courseItems = [
    { label: 'UPSC', value: 'UPSC' },
    { label: 'SSC', value: 'SSC' },
    { label: 'Banking', value: 'Banking' },
    { label: 'Railway', value: 'Railway' },
  ];
  const aboutItems = [
    { label: 'Social media', value: 'Social media' },
    { label: 'Friends', value: 'Friends' },
    { label: 'Advertisement', value: 'Advertisement' },
    { label: 'Website', value: 'Website' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Handle form submission
    Alert.alert('Success', 'Registration submitted successfully!');
    console.log('Form Data:', formData);
  };

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 768;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Start Your Journey</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile number"
                  value={formData.mobileNumber}
                  onChangeText={(value) => handleInputChange('mobileNumber', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                />
              </View>
              <Text style={styles.helperText}>Forgot Password?</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Educational Details</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>10th</Text>
              <View style={styles.inputWrapper}>
                <Icon name="school" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Marks"
                  value={formData.tenthMarks}
                  onChangeText={(value) => handleInputChange('tenthMarks', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>12th</Text>
              <View style={styles.inputWrapper}>
                <Icon name="school" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Marks"
                  value={formData.twelfthMarks}
                  onChangeText={(value) => handleInputChange('twelfthMarks', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bachelor's Degree</Text>
              <View style={styles.inputWrapper}>
                <Icon name="school" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Marks"
                  value={formData.bachelorDegree}
                  onChangeText={(value) => handleInputChange('bachelorDegree', value)}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Master's Degree</Text>
              <View style={styles.inputWrapper}>
                <Icon name="school" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Marks"
                  value={formData.masterDegree}
                  onChangeText={(value) => handleInputChange('masterDegree', value)}
                />
              </View>
            </View>
          </View>

          {isDesktop ? (
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
              <View style={[styles.inputContainer, { flex: 1 }]}> 
                <Text style={styles.label}>Select Your Course</Text>
                <Dropdown
                  data={courseItems}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Course"
                  value={formData.selectCourse}
                  onChange={item => handleInputChange('selectCourse', item.value)}
                  style={{ backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#ddd', height: 44, paddingHorizontal: 12, marginBottom: 8 }}
                  placeholderStyle={{ color: '#999', fontSize: 14 }}
                  selectedTextStyle={{ color: '#333', fontSize: 14 }}
                  itemTextStyle={{ fontSize: 16 }}
                  containerStyle={{ borderRadius: 6 }}
                  activeColor="#f0f0f0"
                  renderLeftIcon={() => <Icon name="book" size={20} color="#666" style={{ marginRight: 10 }} />}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}> 
                <Text style={styles.label}>How Did You Hear About Us?</Text>
                <Dropdown
                  data={aboutItems}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Option"
                  value={formData.aboutUs}
                  onChange={item => handleInputChange('aboutUs', item.value)}
                  style={{ backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#ddd', height: 44, paddingHorizontal: 12, marginBottom: 8 }}
                  placeholderStyle={{ color: '#999', fontSize: 14 }}
                  selectedTextStyle={{ color: '#333', fontSize: 14 }}
                  itemTextStyle={{ fontSize: 16 }}
                  containerStyle={{ borderRadius: 6 }}
                  activeColor="#f0f0f0"
                  renderLeftIcon={() => <Icon name="info" size={20} color="#666" style={{ marginRight: 10 }} />}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Select Your Course</Text>
                  <Dropdown
                    data={courseItems}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Course"
                    value={formData.selectCourse}
                    onChange={item => handleInputChange('selectCourse', item.value)}
                    style={{ backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#ddd', height: 44, paddingHorizontal: 12, marginBottom: 8 }}
                    placeholderStyle={{ color: '#999', fontSize: 14 }}
                    selectedTextStyle={{ color: '#333', fontSize: 14 }}
                    itemTextStyle={{ fontSize: 16 }}
                    containerStyle={{ borderRadius: 6 }}
                    activeColor="#f0f0f0"
                    renderLeftIcon={() => <Icon name="book" size={20} color="#666" style={{ marginRight: 10 }} />}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>How Did You Hear About Us?</Text>
                  <Dropdown
                    data={aboutItems}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Option"
                    value={formData.aboutUs}
                    onChange={item => handleInputChange('aboutUs', item.value)}
                    style={{ backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#ddd', height: 44, paddingHorizontal: 12, marginBottom: 8 }}
                    placeholderStyle={{ color: '#999', fontSize: 14 }}
                    selectedTextStyle={{ color: '#333', fontSize: 14 }}
                    itemTextStyle={{ fontSize: 16 }}
                    containerStyle={{ borderRadius: 6 }}
                    activeColor="#f0f0f0"
                    renderLeftIcon={() => <Icon name="info" size={20} color="#666" style={{ marginRight: 10 }} />}
                  />
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.signInButtonText}>Already registered? Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 14,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingLeft: 12,
    backgroundColor: '#fff',
    height: 44,
  },
  picker: {
    flex: 1,
    height: 44,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 14,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#fff',
    borderColor: '#4F46E5',
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartYourJourney; 