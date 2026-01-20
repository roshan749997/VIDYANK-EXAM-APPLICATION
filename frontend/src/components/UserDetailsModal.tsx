import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserDetailsModalProps {
  user: any;
  visible: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  visible,
  onClose,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  console.log('UserDetailsModal - user data:', user);
  console.log('UserDetailsModal - visible:', visible);

  if (!visible) return null;

  return (
    <View style={styles.centeredModalContainer}>
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      />
      <TouchableOpacity 
        style={styles.modalContent}
        onPress={(e) => e.stopPropagation()}
        activeOpacity={1}
      >
        <View style={styles.userAvatarLarge}>
          <Ionicons name="person-outline" size={36} color="#fff" />
        </View>
        <Text style={styles.modalUserName}>
          {user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.email || 'User'}
        </Text>
        <View style={styles.userDetailsContainer}>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>First Name:</Text>
            <Text style={styles.userDetailValue}>{user?.firstName || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Last Name:</Text>
            <Text style={styles.userDetailValue}>{user?.lastName || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Email:</Text>
            <Text style={styles.userDetailValue}>{user?.email || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Phone:</Text>
            <Text style={styles.userDetailValue}>{user?.phone || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>City:</Text>
            <Text style={styles.userDetailValue}>{user?.city || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Category:</Text>
            <Text style={styles.userDetailValue}>{user?.category || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Institute/Class:</Text>
            <Text style={styles.userDetailValue}>{user?.instituteName || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Referral Source:</Text>
            <Text style={styles.userDetailValue}>{user?.referralSource || 'Not provided'}</Text>
          </View>
          <View style={styles.userDetailRow}>
            <Text style={styles.userDetailLabel}>Terms Accepted:</Text>
            <Text style={[styles.userDetailValue, { color: user?.termsAccepted ? '#10b981' : '#ef4444' }]}>
              {user?.termsAccepted ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: 400,
    maxWidth: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
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
  userDetailsContainer: {
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
  },
  userDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  userDetailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 2,
    textAlign: 'right',
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
});

export default UserDetailsModal; 