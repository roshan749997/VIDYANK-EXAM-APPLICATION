import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllExams, getAllCandidates, getExamStatistics } from '../utils/multiTenantUtils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import AdminLayout from './AdminLayout';

const { width } = Dimensions.get('window');

const StatisticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState<{
    totalExams: number;
    totalCandidates: number;
    activeExams: number;
    completedExams: number;
    averageScore: string;
    passRate: string;
  } | null>(null);
  const [examStats, setExamStats] = useState<Array<{
    name: string;
    total: number;
    completed: number;
    avgScore: string;
    passRate: string;
  }>>([]);
  const [performanceData, setPerformanceData] = useState<Array<{
    score: string;
    count: number;
    percentage: string;
  }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<any>>([]);

  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        (navigation as any).navigate('AdminDashboard');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' },
    { key: 'year', label: 'This Year' },
  ];

  const metrics = [
    { key: 'overview', label: 'Overview', icon: 'analytics' },
    { key: 'exams', label: 'Exams', icon: 'document-text' },
    { key: 'candidates', label: 'Candidates', icon: 'people' },
    { key: 'performance', label: 'Performance', icon: 'trending-up' },
  ];

  const fetchStats = async () => {
    setLoading(true);
    const exams = await getAllExams();
    const candidates: Array<any> = await getAllCandidates();
    const stats = await getExamStatistics();

    setOverviewStats({
      totalExams: stats.totalExams,
      totalCandidates: stats.totalCandidates,
      activeExams: stats.activeExams,
      completedExams: stats.completedExams || 0,
      averageScore: stats.averageScore || '0',
      passRate: stats.passRate || '0',
    });

    setExamStats(stats.examStats || []);

    setPerformanceData(stats.performanceData || []);

    setRecentActivity(stats.recentActivity || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: any;
    subtitle?: string;
    icon: string;
    color?: string;
    trend?: { direction: 'up' | 'down'; value: number };
  }> = ({ title, value, subtitle, icon, color = '#6366f1', trend }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <View style={styles.statCardInfo}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={[styles.statCardValue, { color }]}>{value}</Text>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
      </View>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend.direction === 'up' ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={trend.direction === 'up' ? '#10b981' : '#ef4444'} 
          />
          <Text style={[styles.trendText, { 
            color: trend.direction === 'up' ? '#10b981' : '#ef4444' 
          }]}> {trend.value}% from last {selectedPeriod}</Text>
        </View>
      )}
    </View>
  );

  const ProgressBar: React.FC<{ percentage: number | string; color?: string }> = ({ percentage, color = '#6366f1' }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );

  const renderOverview = () => {
    if (!overviewStats) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Exams"
            value={overviewStats.totalExams}
            icon="document-text"
            color="#6366f1"
            trend={{ direction: 'up', value: 12 }}
          />
          <StatCard
            title="Total Candidates"
            value={overviewStats.totalCandidates.toLocaleString()}
            icon="people"
            color="#10b981"
            trend={{ direction: 'up', value: 8 }}
          />
          <StatCard
            title="Active Exams"
            value={overviewStats.activeExams}
            icon="time"
            color="#f59e0b"
          />
          <StatCard
            title="Completed Exams"
            value={overviewStats.completedExams}
            icon="checkmark-circle"
            color="#8b5cf6"
          />
          <StatCard
            title="Average Score"
            value={`${overviewStats.averageScore}%`}
            icon="analytics"
            color="#06b6d4"
            trend={{ direction: 'up', value: 3.2 }}
          />
          <StatCard
            title="Pass Rate"
            value={`${overviewStats.passRate}%`}
            icon="trophy"
            color="#10b981"
            trend={{ direction: 'up', value: 2.1 }}
          />
        </View>
      </View>
    );
  };

  const renderExamStats = () => {
    if (!examStats || examStats.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exam Statistics</Text>
        {examStats.map((exam, index) => (
          <View key={index} style={styles.examStatCard}>
            <View style={styles.examStatHeader}>
              <Text style={styles.examStatName}>{exam.name}</Text>
              <Text style={styles.examStatTotal}>{exam.completed}/{exam.total} completed</Text>
            </View>
            <View style={styles.examStatMetrics}>
              <View style={styles.examStatMetric}>
                <Text style={styles.examStatLabel}>Average Score</Text>
                <Text style={styles.examStatValue}>{exam.avgScore}%</Text>
                <ProgressBar percentage={exam.avgScore} color="#06b6d4" />
              </View>
              <View style={styles.examStatMetric}>
                <Text style={styles.examStatLabel}>Pass Rate</Text>
                <Text style={styles.examStatValue}>{exam.passRate}%</Text>
                <ProgressBar percentage={exam.passRate} color="#10b981" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPerformance = () => {
    if (!performanceData || performanceData.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score Distribution</Text>
        <View style={styles.performanceChart}>
          {performanceData.map((item, index) => (
            <View key={index} style={styles.performanceItem}>
              <View style={styles.performanceBar}>
                <View style={[styles.performanceBarFill, { width: `${parseFloat(item.percentage) * 3}%` }]} />
              </View>
              <View style={styles.performanceLabels}>
                <Text style={styles.performanceScore}>{item.score}</Text>
                <Text style={styles.performanceCount}>{item.count} candidates</Text>
                <Text style={styles.performancePercentage}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRecentActivity = () => {
    if (!recentActivity || recentActivity.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}> 
              <Ionicons name={getActivityIcon(activity.type) as any} size={20} color={getActivityColor(activity.type)} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{getActivityTitle(activity.type)}</Text>
              <Text style={styles.activityDescription}>
                {activity.exam} • {activity.candidates} candidates
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_completed': return 'checkmark-circle';
      case 'exam_started': return 'play-circle';
      case 'exam_created': return 'add-circle';
      default: return 'analytics';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam_completed': return '#10b981';
      case 'exam_started': return '#6366f1';
      case 'exam_created': return '#f59e0b';
      default: return '#06b6d4';
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'exam_completed': return 'Exam Completed';
      case 'exam_started': return 'Exam Started';
      case 'exam_created': return 'Exam Created';
      default: return 'Activity';
    }
  };

  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;

  return (
    <AdminLayout title="Statistics">
      {loading ? <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} /> : (
        isMobile ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            {selectedMetric === 'overview' && renderOverview()}
            {selectedMetric === 'exams' && renderExamStats()}
            {selectedMetric === 'performance' && renderPerformance()}
            {selectedMetric === 'candidates' && renderRecentActivity()}
          </ScrollView>
        ) : (
          <>
            {selectedMetric === 'overview' && renderOverview()}
            {selectedMetric === 'exams' && renderExamStats()}
            {selectedMetric === 'performance' && renderPerformance()}
            {selectedMetric === 'candidates' && renderRecentActivity()}
          </>
        )
      )}
    </AdminLayout>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  periodTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  activePeriodTab: {
    backgroundColor: '#6366f1',
  },
  periodTabText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  activePeriodTabText: {
    color: 'white',
  },
  metricTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  metricTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  activeMetricTab: {
    backgroundColor: '#e0e7ff',
  },
  metricTabText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  activeMetricTabText: {
    color: '#6366f1',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: width > 600 ? (width - 80) / 3 : (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardInfo: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statCardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trendText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  examStatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  examStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  examStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  examStatTotal: {
    fontSize: 13,
    color: '#64748b',
  },
  examStatMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  examStatMetric: {
    flex: 1,
  },
  examStatLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  examStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e7ef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  performanceChart: {
    marginTop: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  performanceBar: {
    width: 90,
    height: 10,
    backgroundColor: '#e0e7ef',
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  performanceLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceScore: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
    width: 60,
  },
  performanceCount: {
    fontSize: 13,
    color: '#64748b',
    width: 80,
  },
  performancePercentage: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    width: 40,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  activityDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
});

export default StatisticsPage; 