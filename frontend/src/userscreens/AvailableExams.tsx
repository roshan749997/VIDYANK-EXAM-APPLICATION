import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Dimensions, RefreshControl, useWindowDimensions, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from './DashboardHeader';
import BlankHeader from './BlankHeader';
import UserDashboardLayout from './UserDashboardLayout';
import { getUserSidebarItems } from './userSidebarItems';
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
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.warning;
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
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your exams...</Text>
      </View>
    );
  }

  const renderExamCard = ({ item }: any) => {
    const available = item.status === 'Active';

    return (
      <TouchableOpacity
        style={[styles.examCard, !available && styles.examCardDisabled]}
        onPress={() => available && handleStartTest(item)}
        activeOpacity={0.7}
      >
        {/* Header with Icon */}
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.examTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.examSubject}>{item.subject || 'General'}</Text>
          </View>
        </View>

        {/* Description */}
        {item.description && (
          <Text style={styles.examDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="help-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.totalQuestions || 0} Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.duration || 60} mins</Text>
          </View>
        </View>

        {/* Difficulty Badge */}
        {item.difficulty && (
          <View style={[styles.difficultyBadge, {
            backgroundColor: getDifficultyColor(item.difficulty) + '20'
          }]}>
            <Text style={[styles.difficultyText, {
              color: getDifficultyColor(item.difficulty)
            }]}>
              {item.difficulty}
            </Text>
          </View>
        )}

        {/* Start Button */}
        {available && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => handleStartTest(item)}
          >
            <Text style={styles.startButtonText}>Start Exam</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
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
            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyText}>
              No active exams found. Pull down to refresh.
            </Text>
          </View>
        }
      />
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  examCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examCardDisabled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  examSubject: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  examDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default AvailableExams;