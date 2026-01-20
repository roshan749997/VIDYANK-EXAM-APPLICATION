import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Dimensions, RefreshControl, useWindowDimensions, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from '../components/DashboardHeader';
import BlankHeader from '../components/BlankHeader';
import UserDashboardLayout from '../components/UserDashboardLayout';
import { getUserSidebarItems } from '../components/userSidebarItems';
import api from '../services/api';

const { width } = Dimensions.get('window');

const AvailableExams = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 768;
  const isDesktop = windowWidth >= 768;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigation = useNavigation<any>();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get number of columns based on screen size
  const getNumColumns = () => {
    if (windowWidth >= 1200) return 3; // Large desktop
    if (windowWidth >= 768) return 2;  // Desktop/tablet
    return 1; // Mobile
  };

  // Get card width based on screen size and columns
  const getCardWidth = () => {
    const numColumns = getNumColumns();
    const containerPadding = isDesktop ? 48 : 32; // Account for sidebar and padding
    const cardGap = 16;
    return numColumns === 1 ? '100%' : `${(100 - ((numColumns - 1) * 2)) / numColumns}%`;
  };

  const closeSidebar = () => {
    setSidebarCollapsed(true);
  };

  const sidebarItems = getUserSidebarItems(navigation, closeSidebar, 'Available Exams');

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const fetchExams = async () => {
    try {
      const { data } = await api.get('/exams');
      // Filter Active exams and map _id to id
      const activeExams = data
        .filter((exam: any) => exam.status === 'Active')
        .map((exam: any) => ({ ...exam, id: exam._id || exam.id }));
      setExams(activeExams);
    } catch (e) {
      console.error('Error fetching exams:', e);
      setExams([]);
    }
  };

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      await fetchExams();
      setLoading(false);
    };
    loadExams();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExams();
    setRefreshing(false);
  };

  const handleStartTest = (exam: any) => {
    navigation.navigate('TakeExam', { examId: exam.id });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return colors.primary;
    }
  };

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject?.toLowerCase();
    if (subjectLower?.includes('math')) return 'calculator';
    if (subjectLower?.includes('science')) return 'flask';
    if (subjectLower?.includes('history')) return 'library';
    if (subjectLower?.includes('english')) return 'book';
    if (subjectLower?.includes('computer')) return 'laptop';
    return 'document-text';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingSpinnerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <View style={styles.loadingPulse} />
            </View>
            <Text style={styles.loadingText}>Loading your exams...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we prepare everything</Text>
          </View>
        </View>
      </View>
    );
  }

  const renderExamCard = ({ item, index }: { item: any; index: number }) => {
    const available = item.status === 'Active';
    const numColumns = getNumColumns();

    return (
      <GlassCard style={[
        styles.examCard,
        !available && styles.cardDisabled,
        numColumns > 1 ? styles.examCardMultiColumn : styles.examCardSingle,
      ]}>
        <TouchableOpacity
          onPress={() => available && handleStartTest(item)}
          style={styles.cardTouchable}
          activeOpacity={available ? 0.85 : 1}
        >
          {/* Enhanced Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: available ? `${colors.primary}15` : '#f3f4f6' }]}>
                <Ionicons
                  name={getSubjectIcon(item.subject)}
                  size={isDesktop ? 28 : 24}
                  color={available ? colors.primary : '#9ca3af'}
                />
              </View>
              {!available && (
                <View style={styles.lockIconContainer}>
                  <Ionicons name="lock-closed" size={12} color="#6b7280" />
                </View>
              )}
            </View>

            <View style={styles.cardTitleSection}>
              <Text style={[
                styles.examTitle,
                {
                  fontSize: isDesktop ? 18 : 16,
                  color: available ? '#1f2937' : '#6b7280'
                }
              ]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.examSubject}>{item.subject}</Text>
            </View>
          </View>

          {/* Status and Difficulty Badges */}
          <View style={styles.badgesContainer}>
            <View style={[
              styles.statusBadge,
              available ? styles.statusAvailable : styles.statusComingSoon
            ]}>
              <View style={[styles.statusDot, { backgroundColor: available ? '#16a34a' : '#6b7280' }]} />
              <Text style={[styles.statusText, { color: available ? '#16a34a' : '#6b7280' }]}>
                {available ? 'Available' : 'Coming Soon'}
              </Text>
            </View>

            {item.difficulty && (
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {item.description && (
            <Text style={styles.examDescription} numberOfLines={isDesktop ? 4 : 3}>
              {item.description}
            </Text>
          )}

          {/* Enhanced Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.statText}>{item.duration} min</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="help-circle-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.statText}>{item.totalQuestions || (Array.isArray(item.questions) ? item.questions.length : 0)} questions</Text>
            </View>

            {item.maxScore && (
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="trophy-outline" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statText}>{item.maxScore} pts</Text>
              </View>
            )}
          </View>

          {/* Enhanced Start Button */}
          {available && (
            <GlassButton
              title="Start Exam"
              onPress={() => handleStartTest(item)}
              style={[styles.startButton, isDesktop ? styles.startButtonDesktop : undefined]}
              variant="primary"
            />
          )}
        </TouchableOpacity>
      </GlassCard>
    );
  };

  // Main layout: sidebar + header + main content
  return (
    <UserDashboardLayout title="Available Exams" activeLabel="Available Exams">
      <FlatList
        data={exams}
        keyExtractor={item => item.id}
        renderItem={renderExamCard}
        contentContainerStyle={[
          styles.listContainer,
          { paddingHorizontal: isDesktop ? 24 : 16 }
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={getNumColumns()}
        columnWrapperStyle={getNumColumns() > 1 ? styles.columnWrapper : undefined}
        key={`${windowWidth}-${getNumColumns()}`} // Force re-render on window size change
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyIconBackground}>
                  <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No Exams Available</Text>
              <Text style={styles.emptySubtitle}>
                There are no active exams at the moment. Pull down to refresh or check back later.
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <Ionicons name="refresh" size={20} color={colors.primary} />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        }
      />
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingSpinnerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  loadingPulse: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: `${colors.primary}20`,
    opacity: 0.6,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  examCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    ...(Platform.OS === 'android' ? {
      elevation: 4,
    } : {}),
  },
  examCardSingle: {
    width: '100%',
  },
  examCardMultiColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cardTouchable: {
    padding: 20,
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitleSection: {
    flex: 1,
  },
  examTitle: {
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 4,
  },
  examSubject: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusAvailable: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  statusComingSoon: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  difficultyText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  examDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 12,
  },
  startButtonDesktop: {
    paddingVertical: 14,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  refreshButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  cardDisabled: {
    opacity: 0.6,
  },
});

export default AvailableExams;