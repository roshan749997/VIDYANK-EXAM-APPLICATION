// Desktop-only dashboard extracted from original newdashboard.tsx
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from './DashboardHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlankHeader from './BlankHeader';
import { getUserSidebarItems } from './userSidebarItems';
import { useUser } from '../context/UserContext';
import api from '../services/api';

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.progressBar}>
    <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
  </View>
);
const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <TouchableOpacity onPress={onChange} style={[styles.taskCheckbox, checked && styles.taskCheckboxChecked]}>
    {checked && <Feather name="check" size={14} color="#fff" />}
  </TouchableOpacity>
);

const DashboardDesktop = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 600 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => { setSidebarCollapsed(true); }, []);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const closeSidebar = () => setSidebarCollapsed(true);


  const [realData, setRealData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!user) { setLoading(false); return; }

      try {
        // Fetch real data
        const [examsRes, resultsRes, statsRes] = await Promise.all([
          api.get('/exams'),
          api.get('/exam-results'),
          api.get('/exam-results/stats/performance')
        ]);

        const upcoming = examsRes.data
          .filter((e: any) => e.status === 'Active')
          .map((e: any) => ({
            id: e._id || e.id,
            name: e.title,
            priority: false,
            date: 'Available Now',
            registration: 'Open',
            daysLeft: e.duration + ' mins',
            danger: false
          }));

        const history = resultsRes.data.slice(0, 5).map((r: any) => ({
          id: r._id,
          name: r.examTitle,
          date: new Date(r.createdAt).toLocaleDateString(),
          score: `${r.score}%`,
          rank: 'N/A',
          total: r.totalQuestions,
          trend: 'stable',
          scoreType: r.score >= 50 ? 'good' : 'normal' // Simple logic
        }));

        const progress = statsRes.data.subjects.map((s: any, idx: number) => ({
          id: String(idx),
          subject: s.name,
          progress: s.progress,
          color: ['#6366f1', '#3b82f6', '#22c55e', '#f59e0b'][idx % 4]
        }));

        setRealData({
          upcomingExams: upcoming,
          examHistory: history,
          syllabusProgress: progress
        });

      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const getData = () => {
    const staticData = {
      upcomingExams: [],
      syllabusProgress: [],
      testSeries: [
        { id: '1', name: 'MPSC Complete Series', subject: 'General Studies', progress: 60, completed: 18, total: 30, nextTest: '22/04/2025' },
        { id: '2', name: 'UPSC Prelims Mock Tests', subject: 'Current Affairs', progress: 40, completed: 10, total: 25, nextTest: '20/04/2025' },
      ],
      examHistory: [],
      notifications: [
        { id: '1', title: 'Welcome to Vidyank', time: 'Just now', desc: 'Start your preparation journey today!', type: 'success', unread: true },
      ],
      leaderboard: [
        { id: '1', rank: 1, name: 'Amit Patel', score: 950 },
        { id: '2', rank: 2, name: 'Priya Sharma', score: 925 },
        { id: '3', rank: 3, name: 'Rahul Singh', score: 890, isCurrentUser: true },
      ],
      recommendations: [
        { id: '1', title: 'UPSC Geography Mock Test', desc: 'Based on your performance', difficulty: 'Medium', duration: '90 mins', tags: ['Geography'] },
      ],
      recentActivity: [],
      todaySchedule: [],
      upcomingSessions: [],
    };

    if (realData) {
      return {
        ...staticData,
        ...realData, // Overwrite with real data
        upcomingExams: realData.upcomingExams.length > 0 ? realData.upcomingExams : staticData.upcomingExams,
        examHistory: realData.examHistory.length > 0 ? realData.examHistory : staticData.examHistory,
        syllabusProgress: realData.syllabusProgress.length > 0 ? realData.syllabusProgress : staticData.syllabusProgress,
      };
    }
    return staticData;
  };
  const handleNavigation = (screenName: keyof RootStackParamList) => {
    try {
      closeSidebar();
      navigation.navigate(screenName as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  const [scheduleChecked, setScheduleChecked] = useState<{ [key: string]: boolean }>({});
  const handleCheckChange = (id: string) => setScheduleChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const difficultyStyles: Record<string, any> = { Medium: styles.difficultyMedium, Hard: styles.difficultyHard };
  const filterData = (items: any[], fields: string[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(item => fields.some(f => {
      const value = item[f];
      if (typeof value === 'string') return value.toLowerCase().includes(q);
      if (Array.isArray(value)) return value.join(' ').toLowerCase().includes(q);
      return false;
    }));
  };
  const filteredData = {
    upcomingExams: filterData(getData().upcomingExams, ['name']),
    testSeries: filterData(getData().testSeries, ['name', 'subject']),
    examHistory: filterData(getData().examHistory, ['name']),
    recommendations: filterData(getData().recommendations, ['title', 'desc', 'tags']),
  };
  const [notifications, setNotifications] = useState(getData().notifications);
  const handleMarkAllAsRead = () => setNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, unread: false })));
  const renderUpcomingExam = ({ item }: any) => (
    <View style={styles.examItem}>
      <View style={styles.examInfo}>
        <View style={styles.examTitleRow}>
          <Text style={styles.examName}>{item.name}</Text>
          {item.priority && item.name !== 'MPSC State Services' && (
            <View style={styles.priorityBadge}><Text style={styles.priorityBadgeText}>Priority</Text></View>
          )}
        </View>
        <Text style={styles.examDetailsText}>Date: {item.date}{'   '}Registration: {item.registration}</Text>
      </View>
      <View style={styles.countdown}>
        <Text style={[styles.daysLeft, item.danger && styles.countdownDanger]}>{item.daysLeft}</Text>
        <Text style={styles.countdownLabel}>days left</Text>
      </View>
      <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Register</Text></TouchableOpacity>
    </View>
  );
  const renderNotification = ({ item }: any) => {
    const iconMap: { [key: string]: { name: string; color: string } } = {
      reminder: { name: 'calendar-outline', color: '#3b82f6' },
      alert: { name: 'alert-circle-outline', color: '#f97316' },
      success: { name: 'checkmark-circle-outline', color: '#22c55e' },
    };
    const currentIcon = iconMap[item.type];
    return (
      <View style={[styles.notificationItem, item.unread && styles.notificationUnread]}>
        <View style={[styles.notificationIconContainer, { backgroundColor: `${currentIcon.color}20` }]}>
          <Ionicons name={currentIcon.name as any} size={20} color={currentIcon.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}><Text style={styles.notificationTitle}>{item.title}</Text><Text style={styles.notificationTime}>{item.time}</Text></View>
          <Text style={styles.notificationDesc}>{item.desc}</Text>
        </View>
      </View>
    );
  };
  const sidebarItems = getUserSidebarItems(navigation, closeSidebar, 'Dashboard');
  return (
    <View style={styles.dashboardContainer}>
      {/* <BlankHeader /> */}
      {/* <GlassSidebar items={sidebarItems} collapsed={sidebarCollapsed} onClose={closeSidebar} /> */}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* <DashboardHeader
          title="Dashboard"
          onToggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={true}
          user={user}
        /> */}
        <FlatList
          data={[1]}
          keyExtractor={() => 'dashboard-main'}
          renderItem={() => (
            <View>
              <View style={[
                styles.dashboardGrid,
                isDesktop ? styles.dashboardGridDesktop : isTablet ? styles.dashboardGridTablet : null
              ]}>
                <View style={[
                  styles.mainColumn,
                  isDesktop ? styles.mainColumnDesktop : isTablet ? styles.mainColumnTablet : null
                ]}>
                  {/* Upcoming Exams Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Upcoming Exams</Text>
                      </View>
                      <TouchableOpacity style={styles.btnOutline}>
                        <Text style={styles.btnOutlineText}>View All</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList data={filteredData.upcomingExams} renderItem={renderUpcomingExam} keyExtractor={item => item.id} />
                  </GlassCard>
                  {/* Progress Tracker Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Progress Tracker</Text>
                      </View>
                    </View>
                    <View style={[styles.progressGrid, styles.progressGrid]}>
                      <View style={styles.progressColumn}>
                        <Text style={styles.sectionTitle}>Syllabus Coverage</Text>
                        {getData().syllabusProgress.map((item: any) => (
                          <View key={item.id} style={styles.progressItem}>
                            <View style={styles.progressHeader}>
                              <Text style={styles.progressLabel}>{item.subject}</Text>
                              <Text style={styles.progressValue}>{item.progress}%</Text>
                            </View>
                            <ProgressBar progress={item.progress} color={item.color} />
                          </View>
                        ))}
                      </View>
                      <View style={[styles.progressColumn, { marginLeft: 32 }]}> {/* Move Topic Mastery right */}
                        <Text style={styles.sectionTitle}>Topic Mastery</Text>
                        <View style={styles.topicSection}>
                          <Text style={styles.topicHeading}>Strong Areas</Text>
                          <View style={styles.topicList}>
                            <Text style={styles.topicTagStrong}>Indian History</Text>
                            <Text style={styles.topicTagStrong}>Geography</Text>
                          </View>
                        </View>
                        <View style={styles.topicSection}>
                          <Text style={styles.topicHeading}>Needs Improvement</Text>
                          <View style={styles.topicList}>
                            <Text style={styles.topicTagWeak}>Polity</Text>
                            <Text style={styles.topicTagWeak}>Current Affairs</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                  {/* Test Series & Practice Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Test Series & Practice</Text>
                      </View>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => handleNavigation('VidyankaTestSeries')}>
                        <Text style={styles.btnOutlineText}>View All</Text>
                      </TouchableOpacity>
                    </View>
                    {filteredData.testSeries.map((item: any) => (
                      <View key={item.id} style={styles.seriesItem}>
                        <View style={styles.seriesHeader}>
                          <Text style={styles.seriesName}>{item.name}</Text>
                          <View style={styles.subjectBadge}><Text style={styles.subjectBadgeText}>{item.subject}</Text></View>
                        </View>
                        <View style={styles.seriesProgress}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressValue}>{item.progress}%</Text>
                          </View>
                          <ProgressBar progress={item.progress} color="#0ea5e9" />
                        </View>
                        <View style={styles.seriesDetails}>
                          <Text style={styles.detailItem}><Ionicons name="checkmark-done-outline" size={14} /> {item.completed} of {item.total} tests completed</Text>
                          <Text style={[styles.detailItem, { marginTop: 4 }]}><Ionicons name="time-outline" size={14} /> Next test: {item.nextTest}</Text>
                        </View>
                        <View style={styles.seriesActions}>
                          <TouchableOpacity style={styles.btnSecondary}>
                            <Text style={styles.btnSecondaryText}>Continue Series</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.btnOutline}>
                            <Text style={styles.btnOutlineText}>Review Progress</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </GlassCard>
                  {/* Recent Activity Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Recent Activity</Text>
                      </View>
                      {/* <TouchableOpacity style={styles.btnOutline} onPress={() => handleNavigation('Activity')}> */}
                      <Text style={styles.btnOutlineText}>View All</Text>
                      {/* </TouchableOpacity> */}
                    </View>
                    {getData().recentActivity.map((item: any, index: any) => (
                      <View key={item.id} style={styles.timelineItem}>
                        <View style={styles.timelineMarkerContainer}>
                          <View style={[styles.timelineMarker, { backgroundColor: item.color }]}>
                            <Feather name={item.icon as any} size={14} color="#fff" />
                          </View>
                          {index < getData().recentActivity.length - 1 && <View style={styles.timelineLine} />}
                        </View>
                        <View style={styles.timelineContent}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={[styles.timelineTitle, { marginLeft: 10 }]}>{item.title}</Text>
                          </View>
                          <View style={styles.timelineDetails}>
                            <Text>{item.details.map((d: any) => <Text key={d.text} style={{ color: d.color }}>{d.text}</Text>)}</Text>
                          </View>
                          <Text style={styles.timelineTime}>{item.time}</Text>
                        </View>
                      </View>
                    ))}
                  </GlassCard>
                  {/* Exam History & Results Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Exam History & Results</Text>
                      </View>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => handleNavigation('ExamHistory')}>
                        <Text style={styles.btnOutlineText}>View All</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View style={styles.historyTableHeader}>
                        <Text style={[styles.historyTh, { flex: 2 }]}>Exam</Text>
                        <Text style={styles.historyTh}>Score</Text>
                        <Text style={styles.historyTh}>Rank</Text>
                        <Text style={styles.historyTh}>Trend</Text>
                      </View>
                      {filteredData.examHistory.map((item: any) => (
                        <View key={item.id} style={styles.historyTableRow}>
                          <Text style={[styles.historyTd, { flex: 2 }]}>{item.name}</Text>
                          <Text style={[styles.historyTd, item.scoreType === 'good' && styles.scoreGood]}>{item.score}</Text>
                          <Text style={styles.historyTd}>{item.rank}<Text style={styles.totalRank}> of {item.total}</Text></Text>
                          <Text style={styles.historyTd}>{item.trend === 'up' ? <Feather name="trending-up" size={18} color="#16a34a" /> : <Feather name="minus" size={18} color="#64748b" />}</Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                </View>
                <View style={[
                  styles.sideColumn,
                  isDesktop ? styles.sideColumnDesktop : isTablet ? styles.sideColumnTablet : null
                ]}>
                  {/* Notifications Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Notifications</Text>
                      </View>
                      <TouchableOpacity onPress={handleMarkAllAsRead}>
                        <Text style={styles.btnGhostText}>Mark All as Read</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList data={notifications} renderItem={renderNotification} keyExtractor={item => item.id} />
                    <View style={styles.cardFooter}>
                      <TouchableOpacity style={styles.notificationBtn} onPress={() => handleNavigation('Notifications')}>
                        <Text style={styles.btnLinkText}>View All Notifications</Text>
                      </TouchableOpacity >
                    </View>
                  </GlassCard>
                  {/* Leaderboard Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Leaderboard</Text>
                      </View>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => handleNavigation('Leaderboard')}>
                        <Text style={styles.btnOutlineText}>View Complete</Text>
                      </TouchableOpacity>
                    </View>
                    {getData().leaderboard.map((item: any) => {
                      const rankColors: Record<number, string> = { 1: '#f59e0b', 2: '#a8a29e', 3: '#a16207' };
                      return (
                        <View key={item.id} style={[styles.leaderboardItem, item.isCurrentUser && styles.currentUserItem]}>
                          <Feather name="award" size={24} color={rankColors[item.rank]} />
                          <View style={styles.leaderboardUser}>
                            {/* <View style={styles.userAvatarSmall}><Ionicons name="person" size={14} color="#fff" /></View> */}
                            <Text style={styles.leaderboardName}>{item.name}</Text>
                            {item.isCurrentUser && <Text style={styles.youBadge}>You</Text>}
                          </View>
                          <View style={styles.leaderboardScore}>
                            <Text style={styles.scoreValue}>{item.score}</Text>
                            <Text style={styles.scoreLabel}>points</Text>
                          </View>
                        </View>
                      )
                    })}
                  </GlassCard>
                  {/* Recommendations Card */}
                  <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Recommended for You</Text>
                      </View>
                      {/* <TouchableOpacity style={styles.btnOutline} onPress={() => handleNavigation('Recommendations')}> */}
                      <Text style={styles.btnOutlineText}>See All</Text>
                      {/* </TouchableOpacity> */}
                    </View>
                    {filteredData.recommendations.map((item: any) => (
                      <View key={item.id} style={styles.recommendationItem}>
                        <Text style={styles.recommendationTitle}>{item.title}</Text>
                        <Text style={styles.recommendationDesc}>{item.desc}</Text>
                        <View style={styles.recommendationTags}>
                          <Text style={[styles.difficultyBadge, difficultyStyles[item.difficulty] || null]}>{item.difficulty}</Text>
                          <Text style={styles.tag}><Ionicons name="time-outline" size={12} /> {item.duration}</Text>
                          {item.tags.map((tag: any) => <Text key={tag} style={styles.tag}>{tag}</Text>)}
                        </View>
                        <View style={styles.recommendationActions}>
                          <TouchableOpacity style={styles.btnSecondary}>
                            <Text style={styles.btnSecondaryText}>Take Test</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.btnOutline}>
                            <Ionicons name="bookmark-outline" size={16} color="#374151" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </GlassCard>
                  {/* Study Planner Card */}
                  <GlassCard style={[styles.card, { flex: 1 }]}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderTitle}>
                        <Text style={styles.cardTitle}>Study Planner</Text>
                      </View>
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => handleNavigation('StudyPlanner')}>
                        <Ionicons name="add" size={14} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Add Task</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    {getData().todaySchedule.map((item: any) => (
                      <View key={item.id} style={styles.scheduleItem}>
                        <CustomCheckbox checked={!!scheduleChecked[item.id]} onChange={() => handleCheckChange(item.id)} />
                        <View style={styles.taskDetails}>
                          <Text style={styles.taskTitle}>{item.title}</Text>
                          <View style={styles.taskMeta}>
                            <Text style={styles.taskInfo}><Ionicons name="time-outline" size={12} /> {item.time}</Text>
                            <Text style={styles.taskInfo}><Ionicons name="book-outline" size={12} /> {item.subject}</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.btnGhost} onPress={() => handleNavigation('StudyPlanner')}>
                          <Text style={styles.btnGhostText}>Start</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Upcoming Sessions</Text>
                    {getData().upcomingSessions.map((item: any) => (
                      <View key={item.id} style={styles.sessionItem}>
                        <View style={styles.sessionDetails}>
                          <Text style={styles.sessionTitle}>{item.title}</Text>
                          <View style={styles.sessionMeta}>
                            <Text>{item.date}, {item.time}</Text>
                            <Text style={[styles.subjectTag, { backgroundColor: `${item.color}30`, color: item.color }]}>{item.subject}</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={[styles.btnOutline, { marginTop: 8 }]} onPress={() => handleNavigation('StudyPlanner')}>
                          <Text style={styles.btnOutlineText}>Reschedule</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </GlassCard>
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.dashboardScrollContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    justifyContent: 'center', // Center the grid on desktop
  },
  sidebar: { width: 260, backgroundColor: '#282FFB40', padding: 15, },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 10, },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 10, },
  sidebarNav: { flex: 1, },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginVertical: 4, },
  activeNavItem: { backgroundColor: '#374151', },
  navText: { color: '#d1d5db', fontSize: 16, marginLeft: 15, fontWeight: '500' },
  sidebarFooter: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#374151', },
  closeSidebar: { position: 'absolute', top: 15, right: 15, zIndex: 1, },
  mainContent: { flex: 1, backgroundColor: '#f8fafc', },
  sidebarToggle: { padding: 5, },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginLeft: 15, },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, marginLeft: 40, paddingHorizontal: 12, },
  searchIcon: { marginRight: 8, },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1f2937', },
  headerActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', },
  notificationBtn: { position: 'relative', marginRight: 20, padding: 5, },
  notificationIndicator: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', },
  userProfile: { flexDirection: 'row', alignItems: 'center', },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', marginRight: 10, },
  userAvatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', },
  username: { fontSize: 14, fontWeight: '600', color: '#1f2937', },
  dashboardScrollContainer: { padding: 0, paddingHorizontal: 24, paddingVertical: 20, alignItems: 'center', },
  dashboardGrid: { flexDirection: 'row', gap: 24, maxWidth: 1200, width: '100%', alignSelf: 'center', },
  mainColumn: { flex: 2, minWidth: 0, maxWidth: 700, },
  sideColumn: { flex: 1, minWidth: 320, maxWidth: 400, },
  dashboardWideRow: { flexDirection: 'row', gap: 24, marginTop: 24, maxWidth: 1200, alignSelf: 'center', },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 24, shadowColor: "#4f46e5", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, minWidth: 320, maxWidth: 700, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#e5e7eb', flex: 1, width: '100%', alignSelf: 'center', },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, },
  cardHeaderTitle: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginLeft: 4, letterSpacing: 0.2, marginRight: 8 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 15, marginTop: 15, alignItems: 'center', },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12, },
  btnOutline: { borderWidth: 1, borderColor: '#282FFB', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center' },
  btnOutlineText: { fontSize: 12, fontWeight: '500', color: '#282FFB', },
  btnPrimary: { backgroundColor: '#282FFB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 5, },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 13, textAlign: 'center', },
  btnSecondary: { backgroundColor: '#282FFB', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, },
  btnSecondaryText: { color: '#fff', fontWeight: '600', fontSize: 13, textAlign: 'center', },
  btnGhost: { padding: 5, borderWidth: 1, borderColor: '#282FFB', borderRadius: 6 },
  btnGhostText: { fontSize: 12, color: '#282FFB', fontWeight: '500', },
  btnLinkText: { color: '#282FFB', fontWeight: '600', fontSize: 14, },
  examItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  examInfo: { flex: 1, marginRight: 10 },
  examTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  examName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  priorityBadge: { backgroundColor: '#fefce8', borderColor: '#facc15', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  priorityBadgeText: { color: '#a16207', fontSize: 10, fontWeight: 'bold' },
  examDetailsText: { fontSize: 12, color: '#6b7280' },
  countdown: { alignItems: 'center', marginHorizontal: 15 },
  daysLeft: { fontSize: 24, fontWeight: 'bold', color: '#16a34a' },
  countdownDanger: { color: '#dc2626' },
  countdownLabel: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase' },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressGrid: { flexDirection: 'row', gap: 24 },
  progressColumn: { flex: 1, minWidth: 220 },
  progressItem: { marginBottom: 15 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  progressLabel: { fontSize: 14, color: '#374151' },
  progressValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  topicSection: { marginBottom: 10 },
  topicHeading: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151', flexDirection: 'row', alignItems: 'center', gap: 4 },
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicTagStrong: { backgroundColor: '#dcfce7', color: '#166534', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, fontSize: 12 },
  topicTagWeak: { backgroundColor: '#ffedd5', color: '#9a3412', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, fontSize: 12 },
  seriesItem: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e5e7eb', minWidth: 220, width: '100%' },
  seriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seriesName: { fontSize: 16, fontWeight: '600' },
  subjectBadge: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  subjectBadgeText: { color: '#4338ca', fontSize: 12, fontWeight: '500' },
  seriesProgress: { marginBottom: 10 },
  seriesDetails: { flexDirection: 'column', marginVertical: 10, },
  detailItem: { fontSize: 13, color: '#6b7280', flexDirection: 'row', alignItems: 'center', gap: 4 },
  seriesActions: { flexDirection: 'row', },
  historyTableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10, marginBottom: 5 },
  historyTh: { flex: 1, fontWeight: '600', color: '#6b7280', fontSize: 12, textTransform: 'uppercase' },
  historyTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  historyTd: { flex: 1, color: '#374151', fontSize: 13 },
  scoreGood: { color: '#16a34a', fontWeight: '600' },
  totalRank: { color: '#6b7280', fontSize: 12 },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', },
  notificationUnread: { backgroundColor: '#eff6ff' },
  notificationIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  notificationTitle: { fontWeight: '600', color: '#1f2937' },
  notificationTime: { fontSize: 12, color: '#9ca3af' },
  notificationDesc: { fontSize: 13, color: '#6b7280' },
  leaderboardItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
  currentUserItem: { backgroundColor: '#eff6ff', borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8 },
  leaderboardUser: { flex: 1, flexDirection: 'row', alignItems: 'center', },
  leaderboardName: { fontWeight: '600', color: '#374151' },
  youBadge: { backgroundColor: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, borderRadius: 6, marginLeft: 4, overflow: 'hidden' },
  leaderboardScore: { alignItems: 'flex-end' },
  scoreValue: { fontWeight: 'bold', fontSize: 16 },
  scoreLabel: { fontSize: 12, color: '#6b7280' },
  recommendationItem: { paddingVertical: 15, borderTopWidth: 1, borderColor: '#f3f4f6' },
  recommendationTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  recommendationDesc: { fontSize: 13, color: '#6b7280', marginBottom: 10 },
  recommendationTags: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, fontWeight: '500', overflow: 'hidden' },
  difficultyMedium: { backgroundColor: '#ffedd5', color: '#c2410c' },
  difficultyHard: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  tag: { backgroundColor: '#e5e7eb', color: '#4b5563', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, overflow: 'hidden' },
  recommendationActions: { flexDirection: 'row', },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  timelineMarkerContainer: { alignItems: 'center' },
  timelineMarker: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#e5e7eb' },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineTitle: { fontWeight: '600', color: '#374151', fontSize: 15, marginBottom: 4 },
  timelineDetails: { flexDirection: 'row', marginBottom: 4 },
  timelineTime: { color: '#6b7280', fontSize: 12 },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 8 },
  taskCheckbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#9ca3af', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskCheckboxChecked: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  taskDetails: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '500', color: '#374151' },
  taskMeta: { flexDirection: 'row', marginTop: 4 },
  taskInfo: { fontSize: 12, color: '#6b7280', alignItems: 'center' },
  sessionItem: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderColor: '#f3f4f6' },
  sessionDetails: {},
  sessionTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, color: '#6b7280', fontSize: 12 },
  subjectTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, fontWeight: '500', overflow: 'hidden' },
  dashboardGridDesktop: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  mainColumnDesktop: { flex: 2, minWidth: 0, maxWidth: '66%' },
  sideColumnDesktop: { flex: 1, minWidth: 320, maxWidth: '34%' },
  dashboardWideRowDesktop: { flexDirection: 'row', gap: 24, marginTop: 24, alignItems: 'flex-start' },
  rowContainerDesktop: { flexDirection: 'row', gap: 24, width: '100%', alignItems: 'stretch', },
  dashboardGridTablet: { flexDirection: 'row', gap: 16, maxWidth: 900, width: '100%', alignSelf: 'center', alignItems: 'flex-start' },
  mainColumnTablet: { flex: 2, minWidth: 0, maxWidth: 540 },
  sideColumnTablet: { flex: 1, minWidth: 220, maxWidth: 320 },
});

export default DashboardDesktop; 