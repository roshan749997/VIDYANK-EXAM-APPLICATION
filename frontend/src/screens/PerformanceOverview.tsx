import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  useWindowDimensions, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  Platform 
} from 'react-native';
import UserDashboardLayout from '../components/UserDashboardLayout';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import { useUser } from '../context/UserContext';
import api from '../services/api';

// Colors theme
const colors = {
  primary: '#2563eb',
  secondary: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#ffffff',
  border: '#e2e8f0',
  cardBg: '#ffffff',
  gradient: ['#2563eb', '#3b82f6'],
};

// Stats are now fetched from backend API

const allActivities = [
  { 
    id: '1', 
    category: 'test', 
    icon: 'checkcircle', 
    iconLib: AntDesign, 
    color: '#10b981', 
    title: 'Completed MPSC Prelims Mock Test 06', 
    details: 'Score: 82/100, Rank: 56/1250', 
    time: 'Today, 2:30 PM',
    type: 'success'
  },
  { 
    id: '2', 
    category: 'achievement', 
    icon: 'award', 
    iconLib: Feather, 
    color: '#f59e0b', 
    title: "Earned 'Quick Learner' Badge", 
    details: 'Completed 5 tests in a single day', 
    time: 'Today, 11:45 AM',
    type: 'achievement'
  },
  { 
    id: '3', 
    category: 'progress', 
    icon: 'trending-up', 
    iconLib: Feather, 
    color: '#06b6d4', 
    title: 'Reached 75% in UPSC Preparation', 
    details: 'Overall progress increased by 7%', 
    time: 'Yesterday, 4:15 PM',
    type: 'progress'
  },
  { 
    id: '4', 
    category: 'test', 
    icon: 'book-open', 
    iconLib: Feather, 
    color: '#8b5cf6', 
    title: 'Started UPSC Geography Mock Test', 
    details: 'Duration: 90 mins', 
    time: 'Yesterday, 10:00 AM',
    type: 'test'
  },
  { 
    id: '5', 
    category: 'achievement', 
    icon: 'star', 
    iconLib: Feather, 
    color: '#f59e0b', 
    title: "Achieved 'Top 10%' Rank", 
    details: 'In the All India History Championship', 
    time: '2 days ago',
    type: 'achievement'
  },
  { 
    id: '6', 
    category: 'test', 
    icon: 'checkcircle', 
    iconLib: AntDesign, 
    color: '#10b981', 
    title: 'Completed Current Affairs Quiz', 
    details: 'Score: 18/20', 
    time: '3 days ago',
    type: 'success'
  },
];

const mockRecommendations = [
  { 
    id: '1', 
    title: 'UPSC History Mock Test', 
    desc: 'Test your knowledge of Indian History with comprehensive questions.', 
    difficulty: 'Medium', 
    duration: '60 min', 
    tags: ['UPSC', 'History'],
    progress: 0,
    totalQuestions: 100
  },
  { 
    id: '2', 
    title: 'MPSC Current Affairs Quiz', 
    desc: 'Stay updated with the latest current affairs and trending topics.', 
    difficulty: 'Easy', 
    duration: '30 min', 
    tags: ['MPSC', 'Current Affairs'],
    progress: 0,
    totalQuestions: 50
  },
  { 
    id: '3', 
    title: 'Geography Practice Set', 
    desc: 'Practice important geography questions for competitive exams.', 
    difficulty: 'Hard', 
    duration: '45 min', 
    tags: ['Geography'],
    progress: 0,
    totalQuestions: 75
  },
];

const activityFilters = [
  { key: 'all', label: 'All', icon: 'grid' },
  { key: 'test', label: 'Tests', icon: 'file-text' },
  { key: 'achievement', label: 'Achievements', icon: 'award' },
  { key: 'progress', label: 'Progress', icon: 'trending-up' },
];

// Performance Stats Component
function PerformanceStatsSection({ isDesktop, userStats }) {
  const statsData = [
    { label: 'Average Score', value: `${userStats.averageScore}%`, icon: 'trending-up', color: colors.primary },
    { label: 'Total Tests', value: userStats.totalTests, icon: 'file-text', color: colors.success },
    { label: 'Study Hours', value: userStats.totalHours, icon: 'clock', color: colors.accent },
    { label: 'Best Subject', value: userStats.bestSubject, icon: 'award', color: colors.warning },
  ];

  return (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <Text style={styles.sectionTitle}>Performance Overview</Text>
      
      <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
        {statsData.map((stat, index) => (
          <View key={index} style={[styles.statCard, isDesktop && styles.statCardDesktop]}>
            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
              <Feather name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.subjectsSection}>
        <Text style={styles.subsectionTitle}>Subject Performance</Text>
        <View style={[styles.subjectsContainer, isDesktop && { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }]}> 
          {userStats.subjects.length > 0 ? (
            isDesktop
              ? userStats.subjects.reduce((rows: any[], subject: any, idx: number) => {
                  if (idx % 2 === 0) rows.push([subject]);
                  else rows[rows.length - 1].push(subject);
                  return rows;
                }, []).map((row, rowIndex) => (
                  <View key={rowIndex} style={{ flexDirection: 'row', gap: 16, width: '100%', marginBottom: 0 }}>
                    {row.map((subject: any, colIndex: number) => (
                      <View key={colIndex} style={[styles.subjectItem, { flex: 1 }]}> 
                        <View style={styles.subjectHeader}>
                          <Text style={styles.subjectName}>{subject.name}</Text>
                          <Text style={[styles.subjectScore, { color: subject.color }]}> {subject.progress}% </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBarBg}>
                            <View 
                              style={[
                                styles.progressBarFill, 
                                { width: `${subject.progress}%`, backgroundColor: subject.color }
                              ]} 
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))
              : userStats.subjects.map((subject: any, index: number) => (
                  <View key={index} style={styles.subjectItem}>
                    <View style={styles.subjectHeader}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={[styles.subjectScore, { color: subject.color }]}> {subject.progress}% </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBg}>
                        <View 
                          style={[
                            styles.progressBarFill, 
                            { width: `${subject.progress}%`, backgroundColor: subject.color }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                ))
          ) : (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
              No subject data available yet. Complete some exams to see your performance!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

// Activity Section Component
function ActivitySection({ isDesktop }) {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(isDesktop ? 6 : 4);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return allActivities;
    return allActivities.filter(item => item.category === filter);
  }, [filter]);

  const activitiesToShow = filteredActivities.slice(0, visibleCount);

  const handleGetAiSummary = () => {
    setIsLoading(true);
    setModalVisible(true);
    setTimeout(() => {
      setModalContent(`Based on your recent activity, here are key insights:

• Your test performance has improved by 15% over the last week
• History remains your strongest subject with consistent 85%+ scores  
• Current Affairs needs attention - consider daily practice sessions
• You're maintaining good study consistency with regular test attempts
• Focus on Polity concepts to improve overall performance

Recommendations:
- Increase Current Affairs practice by 30 minutes daily
- Take more Polity-focused mock tests
- Continue your strong performance in History`);
      setIsLoading(false);
    }, 1500);
  };

  const handleGetQuickTake = (activity) => {
    setIsLoading(true);
    setModalVisible(true);
    setTimeout(() => {
      setModalContent(`Quick Analysis for: ${activity.title}

Performance: ${activity.type === 'success' ? 'Excellent' : activity.type === 'progress' ? 'Good Progress' : 'Achievement Unlocked'}

Key Points:
• ${activity.details}
• Timing: ${activity.time}
• Category: ${activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}

${activity.type === 'success' ? 'Great job! Keep up this performance level.' : 
  activity.type === 'progress' ? 'Good improvement trend. Continue this momentum.' : 
  'Congratulations on this achievement!'}`);
      setIsLoading(false);
    }, 800);
  };

  return (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity style={styles.aiSummaryButton} onPress={handleGetAiSummary}>
          <Feather name="zap" size={16} color="#fff" />
          <Text style={styles.aiSummaryButtonText}>AI Summary</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.filtersContainer, isDesktop && styles.filtersContainerDesktop]}>
        {activityFilters.map(filterItem => (
          <TouchableOpacity
            key={filterItem.key}
            style={[
              styles.filterButton,
              filter === filterItem.key && styles.filterButtonActive
            ]}
            onPress={() => {
              setFilter(filterItem.key);
              setVisibleCount(isDesktop ? 6 : 4);
            }}
          >
            <Feather 
              name={filterItem.icon} 
              size={16} 
              color={filter === filterItem.key ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.filterButtonText,
              filter === filterItem.key && styles.filterButtonTextActive
            ]}>
              {filterItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.activitiesContainer, isDesktop && styles.activitiesContainerDesktop]}>
        {activitiesToShow.length > 0 ? (
          activitiesToShow.map((item) => (
            <View key={item.id} style={[styles.activityCard, isDesktop && styles.activityCardDesktop]}>
              <View style={styles.activityHeader}>
                <View style={[styles.activityIcon, { backgroundColor: item.color + '15' }]}>
                  {React.createElement(item.iconLib, { 
                    name: item.icon, 
                    size: 20, 
                    color: item.color 
                  })}
                </View>
                <TouchableOpacity 
                  style={styles.quickTakeButton}
                  onPress={() => handleGetQuickTake(item)}
                >
                  <Feather name="zap" size={14} color={colors.accent} />
                </TouchableOpacity>
              </View>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDetails}>{item.details}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="activity" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No activities found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different filter</Text>
          </View>
        )}
      </View>

      {visibleCount < filteredActivities.length && (
        <TouchableOpacity 
          style={styles.loadMoreButton} 
          onPress={() => setVisibleCount(prev => prev + (isDesktop ? 6 : 4))}
        >
          <Text style={styles.loadMoreText}>Load More Activities</Text>
          <Feather name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI-Powered Insights</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner}>
                  <AntDesign name="loading1" size={32} color={colors.primary} />
                </View>
                <Text style={styles.loadingText}>Analyzing your performance...</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalContentText}>{modalContent}</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Recommendations Section Component
function RecommendationsSection({ isDesktop }) {
  const navigation = useNavigation();

  const difficultyConfig = {
    Easy: { backgroundColor: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    Medium: { backgroundColor: '#fef3c7', color: '#92400e', border: '#fde68a' },
    Hard: { backgroundColor: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  };

  const handleTakeTest = (item) => {
    if (item.title.toLowerCase().includes('upsc') || (item.tags && item.tags.includes('UPSC'))) {
      navigation.navigate('UPSCMockTest');
    } else if (item.title.toLowerCase().includes('neet') || (item.tags && item.tags.includes('NEET'))) {
      navigation.navigate('NEETMockTest');
    } else if (item.title.toLowerCase().includes('mpsc') || (item.tags && item.tags.includes('MPSC'))) {
      navigation.navigate('MPSCMockTest');
    }
  };

  return (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      
      <View style={[styles.recommendationsContainer, isDesktop && styles.recommendationsContainerDesktop]}>
        {mockRecommendations.map((item) => (
          <View key={item.id} style={[styles.recommendationCard, isDesktop && styles.recommendationCardDesktop]}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationTitle}>{item.title}</Text>
              <View style={[
                styles.difficultyBadge,
                { 
                  backgroundColor: difficultyConfig[item.difficulty]?.backgroundColor,
                  borderColor: difficultyConfig[item.difficulty]?.border,
                }
              ]}>
                <Text style={[
                  styles.difficultyText,
                  { color: difficultyConfig[item.difficulty]?.color }
                ]}>
                  {item.difficulty}
                </Text>
              </View>
            </View>
            
            <Text style={styles.recommendationDesc}>{item.desc}</Text>
            
            <View style={styles.recommendationMeta}>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={colors.textSecondary} />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="help-circle" size={14} color={colors.textSecondary} />
                <Text style={styles.metaText}>{item.totalQuestions} Questions</Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationActions}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => handleTakeTest(item)}
              >
                <Feather name="play" size={16} color="#fff" />
                <Text style={styles.primaryButtonText}>Start Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Feather name="bookmark" size={16} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Save for Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Main Component
const PerformanceOverview = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 768;
  const { user } = useUser();
  const [userStats, setUserStats] = useState({
    averageScore: 0,
    bestSubject: 'N/A',
    worstSubject: 'N/A',
    totalTests: 0,
    totalHours: 0,
    subjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch performance stats from backend
        const response = await api.get('/exam-results/stats/performance');
        if (response.data) {
          setUserStats(response.data);
        } else {
          setUserStats({
            averageScore: 0,
            bestSubject: 'N/A',
            worstSubject: 'N/A',
            totalTests: 0,
            totalHours: 0,
            subjects: [],
          });
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        setUserStats({
          averageScore: 0,
          bestSubject: 'N/A',
          worstSubject: 'N/A',
          totalTests: 0,
          totalHours: 0,
          subjects: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user]);

  return (
    <UserDashboardLayout title={`${user?.firstName || 'Your'} Performance Overview`} activeLabel="Performance Overview">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>Loading your performance data...</Text>
          </View>
        ) : (
          <>
            <PerformanceStatsSection isDesktop={isDesktop} userStats={userStats} />
            <ActivitySection isDesktop={isDesktop} />
            <RecommendationsSection isDesktop={isDesktop} />
          </>
        )}
      </ScrollView>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  scrollContentDesktop: {
    padding: 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Section Styles
  section: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionDesktop: {
    padding: 32,
    borderRadius: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },

  // Stats Section
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    marginBottom: 32,
    gap: 12,
  },
  statsGridDesktop: {
    // Remove marginHorizontal for desktop, keep row layout
    marginHorizontal: 0,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    maxWidth: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 0,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardDesktop: {
    flex: 1,
    minWidth: 140,
    maxWidth: 220,
    marginHorizontal: 0,
    padding: 20,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Subjects Section
  subjectsSection: {
    marginTop: 8,
  },
  subjectsContainer: {
    gap: 16,
  },
  subjectItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },

  // Activity Section
  aiSummaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  aiSummaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filtersContainerDesktop: {
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: '#fff',
  },

  // Activities
  activitiesContainer: {
    gap: 12,
  },
  activitiesContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    gap: 0,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityCardDesktop: {
    width: '48%',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  quickTakeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Load More
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    gap: 8,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContentDesktop: {
    maxWidth: 600,
    padding: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalContentText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },

  // Recommendations Section
  recommendationsContainer: {
    gap: 20,
  },
  recommendationsContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12,
    gap: 0,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendationCardDesktop: {
    width: '31%',
    marginHorizontal: 12,
    marginBottom: 24,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  recommendationMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  recommendationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PerformanceOverview;