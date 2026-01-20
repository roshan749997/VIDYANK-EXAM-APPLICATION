import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

interface AddCandidateModalProps {
  visible: boolean;
  onClose: () => void;
  onCandidateAdded: (candidate: any) => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  visible,
  onClose,
  onCandidateAdded,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const isDesktop = windowWidth >= 900;
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = newCandidate.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const payload = {
        firstName: firstName || 'Candidate',
        lastName: lastName || '.',
        email: newCandidate.email,
        phone: newCandidate.phone,
        password: 'Password@123', // Default password for manually added candidates
        termsAccepted: true,
        city: 'N/A',
        category: 'General',
        referralSource: 'Admin',
        instituteName: 'Vidyank'
      };

      const { data } = await api.post('/users', payload);

      const candidate = {
        id: data._id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        status: 'Active',
        examsAttempted: 0,
        lastLogin: 'Never',
        registeredDate: new Date().toISOString().split('T')[0],
      };

      onCandidateAdded(candidate);
      setNewCandidate({ name: '', email: '', phone: '' });
      onClose();

      Alert.alert('Success', 'Candidate added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewCandidate({ name: '', email: '', phone: '' });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={isDesktop}
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, isDesktop && styles.modalContainerDesktop]}>
        {isDesktop ? (
          <View style={[styles.modalContentDesktop]}>
            <View style={styles.modalHeaderDesktop}>
              <Text style={[styles.modalTitle, { fontSize: 24 }]}>Add New Candidate</Text>
              <TouchableOpacity onPress={handleClose} accessible accessibilityLabel="Close Add Candidate Modal">
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="person" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter full name"
                    value={newCandidate.name}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, name: text })}
                    accessible
                    accessibilityLabel="Full Name"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="mail" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter email address"
                    value={newCandidate.email}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessible
                    accessibilityLabel="Email Address"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="call" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter phone number"
                    value={newCandidate.phone}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, phone: text })}
                    keyboardType="phone-pad"
                    accessible
                    accessibilityLabel="Phone Number"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled, { backgroundColor: '#282FFB' }]}
                onPress={handleAddCandidate}
                disabled={loading}
                accessible
                accessibilityLabel="Add Candidate"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Add Candidate</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <>
            <View style={[styles.modalHeader, isDesktop && styles.modalHeaderDesktop]}>
              <Text style={styles.modalTitle}>Add New Candidate</Text>
              <TouchableOpacity onPress={handleClose} accessible accessibilityLabel="Close Add Candidate Modal">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={[styles.modalContent, isDesktop && styles.modalContentDesktop]} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="person" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter full name"
                    value={newCandidate.name}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, name: text })}
                    accessible
                    accessibilityLabel="Full Name"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="mail" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter email address"
                    value={newCandidate.email}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessible
                    accessibilityLabel="Email Address"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="call" size={20} color="#A1A1AA" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, isMobile && styles.textInputMobile]}
                    placeholder="Enter phone number"
                    value={newCandidate.phone}
                    onChangeText={(text) => setNewCandidate({ ...newCandidate, phone: text })}
                    keyboardType="phone-pad"
                    accessible
                    accessibilityLabel="Phone Number"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled, { backgroundColor: '#282FFB' }]}
                onPress={handleAddCandidate}
                disabled={loading}
                accessible
                accessibilityLabel="Add Candidate"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Add Candidate</Text>}
              </TouchableOpacity>
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainerDesktop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalHeaderDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 18,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalContentDesktop: {
    maxWidth: 600,
    minWidth: 380,
    width: 600,
    backgroundColor: '#fff',
    borderRadius: 18,
    boxShadow: '0 8px 32px rgba(40,47,251,0.10)',
    padding: 48,
    alignSelf: 'center',
    margin: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 0,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: '#374151',
    backgroundColor: 'transparent',
    height: 48,
    flex: 1,
  },
  textInputMobile: {
    fontSize: 15,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: '#282FFB',
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
    shadowColor: '#282FFB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default AddCandidateModal; 