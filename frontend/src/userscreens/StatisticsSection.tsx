import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const WHITE = '#fff';

const StatisticsSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const statsData = [
    { value: '15 Million+', label: 'Happy Students', bgColor: '#FFF5E6' }, // Light peach/cream
    { value: '24000+', label: 'Mock Tests', bgColor: '#FFE5E5' }, // Light pink
    { value: '14000+', label: 'Video Lectures', bgColor: '#E5F5FF' }, // Light blue/cyan
    { value: '80000+', label: 'Practice Papers', bgColor: '#F0E5FF' }, // Light lavender/purple
  ];

  return (
    <View style={[styles.statsContainer, { paddingVertical: isMobile ? 40 : 60, paddingHorizontal: isMobile ? 16 : 32 }]}>
      {/* Header */}
      <View style={styles.statsHeader}>
        <Text style={[styles.statsTitle, { fontSize: isMobile ? 24 : 36 }]}>
          A Platform Trusted by Students
        </Text>
        <Text style={[styles.statsSubtitle, { fontSize: isMobile ? 14 : 18, marginTop: isMobile ? 12 : 16 }]}>
          Vidyank aims to transform not just through words, but provide results with numbers!
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={[styles.statsGrid, { 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 16 : 20,
        marginTop: isMobile ? 24 : 40,
      }]}>
        {statsData.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: stat.bgColor,
                width: isMobile ? '100%' : undefined,
                flex: isMobile ? undefined : 1,
                minWidth: isMobile ? undefined : 200,
                padding: isMobile ? 24 : 32,
              },
            ]}
          >
            <Text style={[styles.statValue, { fontSize: isMobile ? 32 : 40 }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { fontSize: isMobile ? 14 : 16 }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={[styles.getStartedButton, {
          marginTop: isMobile ? 32 : 48,
          paddingHorizontal: isMobile ? 32 : 48,
          paddingVertical: isMobile ? 14 : 18,
        }]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.getStartedText, { fontSize: isMobile ? 16 : 18 }]}>
          Get Started
        </Text>
      </TouchableOpacity>

      {/* Floating Phone Icon */}
      {!isMobile && (
        <TouchableOpacity
          style={styles.floatingPhoneIcon}
          onPress={() => console.log('Phone clicked')}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={24} color={WHITE} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    width: '100%',
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statsHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 900,
  },
  statsTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  statsSubtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#222',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsGrid: {
    width: '100%',
    maxWidth: 1200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  getStartedText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: WHITE,
  },
  floatingPhoneIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
  },
});

export default StatisticsSection;
