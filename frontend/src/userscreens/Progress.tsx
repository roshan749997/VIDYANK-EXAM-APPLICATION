import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, useWindowDimensions, Modal, TouchableOpacity } from 'react-native';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from './DashboardHeader';
import BlankHeader from './BlankHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { getUserSidebarItems } from './userSidebarItems';
import UserDashboardLayout from './UserDashboardLayout';
import { useUser } from '../context/UserContext';
import api from '../services/api';

const screenWidth = Dimensions.get('window').width;

// Progress is now fetched from backend API

// Additional mock data for desktop view
const mockRecentActivity = [
  { date: '2024-01-15', activity: 'Completed History Chapter 12', score: 85 },
  { date: '2024-01-14', activity: 'Geography Quiz - Rivers of India', score: 92 },
  { date: '2024-01-13', activity: 'Polity Mock Test - Fundamental Rights', score: 78 },
  { date: '2024-01-12', activity: 'Current Affairs - Weekly Review', score: 88 },
  { date: '2024-01-11', activity: 'Economics - Monetary Policy', score: 95 },
];

const mockUpcomingTasks = [
  { subject: 'History', task: 'Medieval India - Mughal Empire', dueDate: '2024-01-20', priority: 'High' },
  { subject: 'Geography', task: 'Climate and Weather Patterns', dueDate: '2024-01-22', priority: 'Medium' },
  { subject: 'Polity', task: 'Directive Principles of State Policy', dueDate: '2024-01-25', priority: 'High' },
  { subject: 'Current Affairs', task: 'Monthly Current Affairs Review', dueDate: '2024-01-28', priority: 'Medium' },
];

const mockWeeklyGoals = [
  { goal: 'Complete 3 History chapters', progress: 2, target: 3 },
  { goal: 'Solve 10 Geography MCQs daily', progress: 7, target: 10 },
  { goal: 'Read current affairs for 1 hour daily', progress: 5, target: 7 },
  { goal: 'Take 2 mock tests', progress: 1, target: 2 },
];

// These will be calculated dynamically based on user data

const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [40, 45, 50, 60, 70, 80, 90],
      color: () => colors.primary,
      strokeWidth: 2,
    },
  ],
};

function MobileProgress({ progressData }: { progressData: any[] }) {
  const pieData = progressData.map((item, i) => ({
    name: item.subject,
    population: item.completed,
    color: ['#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899'][i % 7],
    legendFontColor: '#374151',
    legendFontSize: 13,
  }));

  const barData = {
    labels: progressData.map(item => item.subject),
    datasets: [{ data: progressData.map(item => item.percent) }],
  };

  if (progressData.length === 0) {
    return (
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, flexGrow: 1, paddingBottom: 80 }} style={{ flex: 1 }}>
        <GlassCard style={[styles.glassCard, { maxWidth: 350, padding: 16 }]}>
          <Text style={styles.title}>Progress Overview</Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
            No progress data available yet. Complete some exams to see your progress!
          </Text>
        </GlassCard>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, flexGrow: 1, paddingBottom: 80 }} style={{ flex: 1 }}>
      <GlassCard style={[styles.glassCard, { maxWidth: 350, padding: 16 }]}>
        <Text style={styles.title}>Progress Overview</Text>
        <Text style={styles.sectionTitle}>Syllabus Completion</Text>
        <PieChart
          data={pieData}
          width={250}
          height={150}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={''}
          absolute
        />
        <Text style={styles.sectionTitle}>Per Subject Progress</Text>
        <BarChart
          yAxisLabel=""
          data={barData}
          width={250}
          height={150}
          yAxisSuffix="%"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={{ borderRadius: 12, marginBottom: 20 }}
        />
        <Text style={styles.sectionTitle}>Subject Breakdown</Text>
        {progressData.map(item => (
          <View key={item.subject} style={styles.progressRow}>
            <Text style={styles.subject}>{item.subject}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${item.percent}%` }]} />
            </View>
            <Text style={styles.percent}>{item.percent}%</Text>
            <Text style={styles.completed}>{item.completed}/{item.total}</Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  );
}

function TabletProgress({ windowWidth, progressData }: { windowWidth: number; progressData: any[] }) {
  const chartWidth = windowWidth >= 1024 ? 380 : 320;
  const chartHeight = windowWidth >= 1024 ? 240 : 200;

  const pieData = progressData.map((item, i) => ({
    name: item.subject,
    population: item.completed,
    color: ['#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899'][i % 7],
    legendFontColor: '#374151',
    legendFontSize: 13,
  }));

  const barData = {
    labels: progressData.map(item => item.subject),
    datasets: [{ data: progressData.map(item => item.percent) }],
  };

  if (progressData.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 32,
          paddingHorizontal: windowWidth >= 1024 ? 40 : 24,
          flexGrow: 1,
          paddingBottom: 100,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
          No progress data available yet. Complete some exams to see your progress!
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 32,
        paddingHorizontal: windowWidth >= 1024 ? 40 : 24,
        flexGrow: 1,
        paddingBottom: 100
      }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.tabletContainer, { maxWidth: windowWidth >= 1024 ? 900 : 700 }]}>
        <Text style={[styles.tabletTitle, { fontSize: windowWidth >= 1024 ? 36 : 32 }]}>Progress Overview</Text>

        {/* Charts Row */}
        <View style={[styles.tabletChartsRow, { gap: windowWidth >= 1024 ? 40 : 32, marginBottom: windowWidth >= 1024 ? 48 : 40 }]}>
          <View style={[styles.tabletChartSection, { flex: 1, minWidth: windowWidth >= 1024 ? 400 : 320 }]}>
            <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1024 ? 20 : 18, marginBottom: 16 }]}>Syllabus Completion</Text>
            <View style={[styles.tabletChartContainer, { padding: windowWidth >= 1024 ? 24 : 20, minHeight: chartHeight + 48 }]}>
              <PieChart
                data={pieData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'20'}
                absolute
              />
            </View>
          </View>
          <View style={[styles.tabletChartSection, { flex: 1, minWidth: windowWidth >= 1024 ? 400 : 320 }]}>
            <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1024 ? 20 : 18, marginBottom: 16 }]}>Weekly Progress Trend</Text>
            <View style={[styles.tabletChartContainer, { padding: windowWidth >= 1024 ? 24 : 20, minHeight: chartHeight + 48 }]}>
              <LineChart
                data={lineData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: 16 }}
              />
            </View>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View style={[styles.tabletBarChartSection, { marginBottom: windowWidth >= 1024 ? 48 : 40 }]}>
          <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1024 ? 20 : 18, marginBottom: 16 }]}>Subject Performance Overview</Text>
          <View style={[styles.tabletBarChartContainer, { padding: windowWidth >= 1024 ? 24 : 20 }]}>
            <BarChart
              yAxisLabel=""
              data={barData}
              width={windowWidth >= 1024 ? 780 : 620}
              height={280}
              yAxisSuffix="%"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={{ borderRadius: 16 }}
              showBarTops={false}
              fromZero={true}
            />
          </View>
        </View>

        {/* Subject Breakdown */}
        <View style={[styles.tabletSubjectSection, { marginBottom: windowWidth >= 1024 ? 48 : 40 }]}>
          <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1024 ? 20 : 18, marginBottom: 16 }]}>Detailed Subject Progress</Text>
          <View style={[styles.tabletProgressGrid, { gap: windowWidth >= 1024 ? 16 : 12 }]}>
            {progressData.map(item => (
              <View key={item.subject} style={styles.tabletProgressRow}>
                <Text style={[styles.subject, { fontSize: windowWidth >= 1024 ? 18 : 16, flex: 1, minWidth: 100 }]}>{item.subject}</Text>
                <View style={styles.tabletProgressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.percent}%`, height: windowWidth >= 1024 ? 16 : 14, borderRadius: windowWidth >= 1024 ? 8 : 7 }]} />
                  </View>
                </View>
                <Text style={[styles.percent, { fontSize: windowWidth >= 1024 ? 18 : 16, width: 60, textAlign: 'right' }]}>{item.percent}%</Text>
                <Text style={[styles.completed, { fontSize: windowWidth >= 1024 ? 16 : 14, width: 80, textAlign: 'right' }]}>{item.completed}/{item.total}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function DesktopProgress({ windowWidth, progressData }: { windowWidth: number; progressData: any[] }) {
  const chartWidth = windowWidth >= 1400 ? 480 : windowWidth >= 1200 ? 440 : 380;
  const chartHeight = windowWidth >= 1400 ? 300 : windowWidth >= 1200 ? 280 : 260;
  const barChartWidth = windowWidth >= 1400 ? 1000 : windowWidth >= 1200 ? 900 : 800;

  const pieData = progressData.map((item, i) => ({
    name: item.subject,
    population: item.completed,
    color: ['#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899'][i % 7],
    legendFontColor: '#374151',
    legendFontSize: 13,
  }));

  const barData = {
    labels: progressData.map(item => item.subject),
    datasets: [{ data: progressData.map(item => item.percent) }],
  };

  if (progressData.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 48,
          paddingHorizontal: windowWidth >= 1400 ? 80 : windowWidth >= 1200 ? 60 : 40,
          flexGrow: 1,
          paddingBottom: 120,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
          No progress data available yet. Complete some exams to see your progress!
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 48,
        paddingHorizontal: windowWidth >= 1400 ? 80 : windowWidth >= 1200 ? 60 : 40,
        flexGrow: 1,
        paddingBottom: 120
      }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.desktopContainer, { maxWidth: windowWidth >= 1400 ? 1600 : windowWidth >= 1200 ? 1400 : 1200 }]}>
        <Text style={[styles.desktopTitle, { fontSize: windowWidth >= 1400 ? 44 : windowWidth >= 1200 ? 40 : 36, marginBottom: windowWidth >= 1400 ? 48 : 40 }]}>Progress Overview</Text>

        {/* Charts Row: Syllabus Completion and Weekly Progress Trend side by side */}
        <View style={[styles.chartsRow, { gap: windowWidth >= 1400 ? 64 : windowWidth >= 1200 ? 48 : 32, marginBottom: windowWidth >= 1400 ? 48 : 40 }]}>
          <View style={[styles.chartSection, { minWidth: windowWidth >= 1400 ? 480 : windowWidth >= 1200 ? 440 : 400, flex: 1 }]}>
            <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1400 ? 22 : windowWidth >= 1200 ? 20 : 18, marginBottom: 16 }]}>Syllabus Completion</Text>
            <View style={[styles.chartContainer, { padding: windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 28 : 24, minHeight: chartHeight + 64 }]}>
              <PieChart
                data={pieData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'40'}
                absolute
              />
            </View>
          </View>
          <View style={[styles.chartSection, { minWidth: windowWidth >= 1400 ? 480 : windowWidth >= 1200 ? 440 : 400, flex: 1 }]}>
            <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1400 ? 22 : windowWidth >= 1200 ? 20 : 18, marginBottom: 16 }]}>Weekly Progress Trend</Text>
            <View style={[styles.chartContainer, { padding: windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 28 : 24, minHeight: chartHeight + 64 }]}>
              <LineChart
                data={lineData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: 18 }}
              />
            </View>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View style={[styles.barChartSection, { marginBottom: windowWidth >= 1400 ? 48 : 40 }]}>
          <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1400 ? 22 : windowWidth >= 1200 ? 20 : 18, marginBottom: 16 }]}>Subject Performance Overview</Text>
          <View style={[styles.barChartContainer, { padding: windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 28 : 24 }]}>
            <BarChart
              yAxisLabel=""
              data={barData}
              width={barChartWidth}
              height={320}
              yAxisSuffix="%"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={{ borderRadius: 18 }}
              showBarTops={false}
              fromZero={true}
            />
          </View>
        </View>

        {/* Subject Breakdown */}
        <View style={[styles.subjectSection, { marginBottom: windowWidth >= 1400 ? 48 : 40 }]}>
          <Text style={[styles.sectionTitle, { fontSize: windowWidth >= 1400 ? 22 : windowWidth >= 1200 ? 20 : 18, marginBottom: 16 }]}>Detailed Subject Progress</Text>
          <View style={[styles.progressGrid, { gap: windowWidth >= 1400 ? 18 : 16 }]}>
            {progressData.map(item => (
              <View key={item.subject} style={styles.progressRow}>
                <Text style={[styles.subject, { fontSize: windowWidth >= 1400 ? 20 : windowWidth >= 1200 ? 18 : 16, flex: 1, minWidth: 120 }]}>{item.subject}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.percent}%`, height: windowWidth >= 1400 ? 20 : windowWidth >= 1200 ? 18 : 16, borderRadius: windowWidth >= 1400 ? 10 : windowWidth >= 1200 ? 9 : 8 }]} />
                  </View>
                </View>
                <Text style={[styles.percent, { fontSize: windowWidth >= 1400 ? 20 : windowWidth >= 1200 ? 18 : 16, width: 80, textAlign: 'right' }]}>{item.percent}%</Text>
                <Text style={[styles.completed, { fontSize: windowWidth >= 1400 ? 18 : windowWidth >= 1200 ? 16 : 14, width: 100, textAlign: 'right' }]}>{item.completed}/{item.total}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#6366f1',
  },
  propsForLabels: {
    fontSize: 14,
    fontWeight: '600',
  },
  propsForVerticalLabels: {
    fontSize: 12,
    fontWeight: '500',
  },
  propsForHorizontalLabels: {
    fontSize: 12,
    fontWeight: '500',
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  glassCard: { width: '100%', maxWidth: 500, alignSelf: 'center', padding: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 18, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.primary, marginTop: 18, marginBottom: 8 },
  mainContent: { flex: 1, backgroundColor: colors.background },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  subject: { flex: 1, fontSize: 16, color: colors.text },
  progressBarBg: { flex: 3, height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, marginHorizontal: 10 },
  progressBarFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
  percent: { width: 50, textAlign: 'right', color: colors.primary, fontWeight: '600' },
  completed: { width: 60, textAlign: 'right', color: colors.textSecondary },
  // Desktop-specific styles
  desktopContainer: { width: '100%', maxWidth: 1600, alignSelf: 'center' },
  desktopTitle: { fontSize: 44, fontWeight: 'bold', color: colors.primary, marginBottom: 48, textAlign: 'left' },
  chartsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 64, marginBottom: 48 },
  chartSection: { flex: 1, minWidth: 480, maxWidth: 700 },
  chartContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 32, marginBottom: 12, elevation: 3 },
  barChartSection: { marginBottom: 48 },
  barChartContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 32, marginTop: 12, elevation: 3 },
  subjectSection: { marginBottom: 48 },
  progressGrid: { flexDirection: 'column', gap: 18 },
  progressBarContainer: { flex: 3, marginHorizontal: 18 },
  // Tablet-specific styles
  tabletContainer: { width: '100%', alignSelf: 'center' },
  tabletTitle: { fontSize: 36, fontWeight: 'bold', color: colors.primary, marginBottom: 32, textAlign: 'left' },
  tabletChartsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 32, marginBottom: 40 },
  tabletChartSection: { flex: 1 },
  tabletChartContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 12, elevation: 3 },
  tabletBarChartSection: { marginBottom: 40 },
  tabletBarChartContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginTop: 12, elevation: 3 },
  tabletSubjectSection: { marginBottom: 40 },
  tabletProgressGrid: { flexDirection: 'column', gap: 16 },
  tabletProgressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tabletProgressBarContainer: { flex: 3, marginHorizontal: 16 },
});

const Progress: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const { user } = useUser();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch progress from backend
        const response = await api.get('/exam-results/stats/progress');
        if (response.data) {
          setProgressData(response.data);
        } else {
          setProgressData([]);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        setProgressData([]);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  if (loading) {
    return (
      <UserDashboardLayout title="Progress" activeLabel="Progress">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Loading your progress...</Text>
        </View>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout title={`${user?.firstName || 'Your'} Progress`} activeLabel="Progress">
      {isMobile ? (
        <MobileProgress progressData={progressData} />
      ) : isTablet ? (
        <TabletProgress windowWidth={windowWidth} progressData={progressData} />
      ) : (
        <DesktopProgress windowWidth={windowWidth} progressData={progressData} />
      )}
    </UserDashboardLayout>
  );
};

export default Progress;